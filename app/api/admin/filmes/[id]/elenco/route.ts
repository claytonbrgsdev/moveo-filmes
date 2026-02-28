import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes_elenco')
    .select('*, pessoas(id, nome, nome_exibicao)')
    .eq('filme_id', id)
    .order('ordem', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('filmes_elenco')
    .insert({ ...body, filme_id: id })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
