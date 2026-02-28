import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const excludeId = searchParams.get('excludeId')
  if (!slug) return NextResponse.json({ available: false, error: 'slug required' }, { status: 400 })

  const supabase = createServiceClient()
  let query = supabase.from('posts').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query.limit(1)
  return NextResponse.json({ available: !data?.length })
}
