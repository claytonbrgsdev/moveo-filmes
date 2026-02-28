import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes_creditos')
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
    .from('filmes_creditos')
    .insert({ ...body, filme_id: id })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  await params
  const supabase = createServiceClient()
  const { items } = await request.json() as { items: { id: string; ordem: number }[] }
  if (!Array.isArray(items)) return NextResponse.json({ error: 'items array required' }, { status: 400 })
  await Promise.all(items.map(({ id: rowId, ordem }) =>
    supabase.from('filmes_creditos').update({ ordem }).eq('id', rowId)
  ))
  return NextResponse.json({ updated: items.length })
}
