import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import type { FilmeInsert } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/filmes
 * Returns all films ordered by updated_at desc (service role — bypasses RLS)
 */
export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes')
    .select('id, slug, titulo_pt, titulo_en, categoria_site, visibilidade, ano, status_interno_pt, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * POST /api/admin/filmes
 * Creates a new film. Body: FilmeInsert (titulo_pt and slug required)
 */
export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  if (!body.titulo_pt || !body.slug) {
    return NextResponse.json({ error: 'titulo_pt e slug são obrigatórios' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('filmes')
    .insert(body as FilmeInsert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 201 })
}
