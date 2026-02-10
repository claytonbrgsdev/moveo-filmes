/**
 * Posts data fetching functions
 *
 * Server-side functions to fetch posts from Supabase database.
 * Used for static generation at build time.
 */

import { createServiceClient } from './service'
import type { PostRow } from './types'

/**
 * Get all published posts, ordered by publication date
 */
export async function getAllPosts(): Promise<PostRow[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('visibilidade', 'publico')
    .order('publicado_em', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('visibilidade', 'publico')
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('visibilidade', 'publico')

  if (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }

  return data?.map(post => post.slug) || []
}

/**
 * Get posts by category (tipo)
 */
export async function getPostsByCategory(category: string): Promise<PostRow[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('tipo', category)
    .eq('visibilidade', 'publico')
    .order('publicado_em', { ascending: false })

  if (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }

  return data || []
}

/**
 * Get Instagram posts only
 */
export async function getInstagramPosts(): Promise<PostRow[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('tipo', 'instagram')
    .eq('visibilidade', 'publico')
    .order('publicado_em', { ascending: false })

  if (error) {
    console.error('Error fetching Instagram posts:', error)
    return []
  }

  return data || []
}

/**
 * Format a post for display (helper for language-based content)
 */
export function formatPostForLanguage(post: PostRow, language: 'pt' | 'en') {
  return {
    id: post.id,
    slug: post.slug,
    title: language === 'pt' ? post.titulo_pt : (post.titulo_en || post.titulo_pt),
    excerpt: language === 'pt' ? post.resumo_pt : (post.resumo_en || post.resumo_pt),
    content: language === 'pt' ? post.conteudo_pt : (post.conteudo_en || post.conteudo_pt),
    imageUrl: post.imagem_capa_url,
    imageAlt: language === 'pt' ? post.alt_pt : (post.alt_en || post.alt_pt),
    date: post.publicado_em,
    category: post.tipo,
    externalUrl: post.url_externa,
  }
}
