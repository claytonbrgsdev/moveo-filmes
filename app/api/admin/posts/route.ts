import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  await requireAdmin()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, titulo_pt, titulo_en, tipo, visibilidade, publicado_em, updated_at')
    .order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  await requireAdmin()
  const supabase = createServiceClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('posts')
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
