import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; pId: string }> }) {
  await requireAdmin()
  const { pId } = await params
  const supabase = createServiceClient()
  const body = await request.json()
  const { id: _id, created_at: _ca, filme_id: _fid, ...rest } = body
  const { data, error } = await supabase
    .from('filmes_premiacoes')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', pId)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; pId: string }> }) {
  await requireAdmin()
  const { pId } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('filmes_premiacoes').delete().eq('id', pId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
