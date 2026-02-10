/**
 * Instagram Sync Edge Function
 *
 * This function fetches the latest posts from the @moveofilmes Instagram account
 * and syncs them to the Supabase posts table.
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - INSTAGRAM_ACCESS_TOKEN
 * - INSTAGRAM_USER_ID
 * - GITHUB_REBUILD_TOKEN
 *
 * Deploy with:
 * supabase functions deploy instagram-sync --project-ref <project-id>
 *
 * Set secrets with:
 * supabase secrets set INSTAGRAM_ACCESS_TOKEN=xxx INSTAGRAM_USER_ID=xxx GITHUB_REBUILD_TOKEN=xxx
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const INSTAGRAM_API = 'https://graph.instagram.com/v18.0'
const GITHUB_REPO = 'claytonbrgsdev/moveo-filmes'

interface InstagramMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  timestamp: string
  thumbnail_url?: string
}

interface InstagramResponse {
  data: InstagramMedia[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

/**
 * Generate a URL-friendly slug from text
 */
function generateSlug(text: string | undefined, id: string): string {
  if (!text) return `instagram-${id}`

  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .slice(0, 50) // Limit length

  return slug || `instagram-${id}`
}

/**
 * Truncate text to a maximum length, breaking at word boundaries
 */
function truncate(text: string | undefined, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
}

/**
 * Trigger GitHub Actions rebuild
 */
async function triggerGitHubRebuild(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'instagram-sync',
          client_payload: {
            timestamp: new Date().toISOString(),
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('GitHub rebuild trigger failed:', response.status, await response.text())
      return false
    }

    console.log('GitHub rebuild triggered successfully')
    return true
  } catch (error) {
    console.error('Error triggering GitHub rebuild:', error)
    return false
  }
}

/**
 * Fetch media from Instagram Graph API
 */
async function fetchInstagramMedia(
  accessToken: string,
  userId: string
): Promise<InstagramMedia[]> {
  const fields = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url'
  const url = `${INSTAGRAM_API}/${userId}/media?fields=${fields}&access_token=${accessToken}&limit=25`

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Instagram API error: ${response.status} - ${errorText}`)
  }

  const data: InstagramResponse = await response.json()
  return data.data || []
}

Deno.serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Verify authorization
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const instagramToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
    const instagramUserId = Deno.env.get('INSTAGRAM_USER_ID')
    const githubToken = Deno.env.get('GITHUB_REBUILD_TOKEN')

    if (!instagramToken || !instagramUserId) {
      return new Response(
        JSON.stringify({ error: 'Instagram credentials not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Fetch Instagram posts
    console.log('Fetching Instagram media...')
    const instagramPosts = await fetchInstagramMedia(instagramToken, instagramUserId)
    console.log(`Fetched ${instagramPosts.length} posts from Instagram`)

    // Process each post
    let synced = 0
    let skipped = 0
    const errors: string[] = []

    for (const post of instagramPosts) {
      try {
        // Check if post already exists
        const { data: existing } = await supabase
          .from('posts')
          .select('id')
          .eq('slug', `instagram-${post.id}`)
          .maybeSingle()

        if (existing) {
          skipped++
          continue
        }

        // Generate slug and prepare data
        const slug = `instagram-${post.id}`
        const title = truncate(post.caption, 100) || 'Instagram Post'
        const excerpt = truncate(post.caption, 200)

        // Get the image URL (use thumbnail for videos)
        const imageUrl = post.media_type === 'VIDEO'
          ? post.thumbnail_url || post.media_url
          : post.media_url

        // Insert new post
        const { error: insertError } = await supabase.from('posts').insert({
          slug,
          titulo_pt: title,
          titulo_en: title, // Same text for both languages (user preference)
          conteudo_pt: post.caption || '',
          conteudo_en: post.caption || '',
          resumo_pt: excerpt,
          resumo_en: excerpt,
          imagem_capa_url: imageUrl,
          url_externa: post.permalink,
          publicado_em: post.timestamp,
          visibilidade: 'publico',
          tipo: 'instagram',
        })

        if (insertError) {
          console.error(`Error inserting post ${post.id}:`, insertError)
          errors.push(`${post.id}: ${insertError.message}`)
          continue
        }

        synced++
        console.log(`Synced post: ${slug}`)
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error)
        errors.push(`${post.id}: ${String(error)}`)
      }
    }

    // Log sync result
    const status = errors.length > 0 ? 'partial' : 'success'
    await supabase.from('instagram_sync_log').insert({
      sync_type: 'polling',
      status,
      posts_synced: synced,
      error_message: errors.length > 0 ? errors.join('; ') : null,
    })

    // Trigger site rebuild if new posts were synced
    let rebuildTriggered = false
    if (synced > 0 && githubToken) {
      rebuildTriggered = await triggerGitHubRebuild(githubToken)
    }

    const result = {
      success: true,
      synced,
      skipped,
      errors: errors.length,
      rebuildTriggered,
      timestamp: new Date().toISOString(),
    }

    console.log('Sync complete:', result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Sync failed:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
