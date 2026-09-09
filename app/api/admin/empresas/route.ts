import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidarEmpresas } from '@/lib/cache/revalidate'

/**
 * O `filmes_creditos(count)` é o que diferencia esta lista de um CRUD cego.
 * A tabela chegou ao painel com registros duplicados ("Moveo Filmes" e
 * "Mão Única Filmes" aparecem duas vezes cada) e sem jeito de saber qual das
 * cópias os filmes realmente usam. Com a contagem na lista, a duplicata órfã
 * se identifica sozinha — é a que marca 0.
 */
export async function GET() {
  await requireAdmin()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('empresas')
    .select('id, nome, slug, tipo, pais, logo_url, visibilidade, updated_at, filmes_creditos(count)')
    .order('nome', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  await requireAdmin()
  const supabase = createServiceClient()
  const body = await request.json()
  const { data, error } = await supabase
    .from('empresas')
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidarEmpresas()
  return NextResponse.json(data, { status: 201 })
}
