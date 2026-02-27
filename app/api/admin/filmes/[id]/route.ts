import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import type { FilmeUpdate } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/filmes/[id]
 * Returns a single film with all columns
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

/**
 * PATCH /api/admin/filmes/[id]
 * Updates a film. Body: partial FilmeUpdate
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  // Remove read-only fields that shouldn't be updated directly
  delete body.id
  delete body.created_at

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes')
    .update(body as FilmeUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

/**
 * DELETE /api/admin/filmes/[id]
 * Deletes a film permanently
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('filmes')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return new NextResponse(null, { status: 204 })
}
