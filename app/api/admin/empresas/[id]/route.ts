import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidarEmpresas } from '@/lib/cache/revalidate'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()
  const body = await request.json()
  const { id: _id, created_at: _ca, ...rest } = body
  const { data, error } = await supabase
    .from('empresas')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidarEmpresas()
  return NextResponse.json(data)
}

/**
 * `filmes_creditos.empresa_id` referencia `empresas(id)` sem `ON DELETE`, ou
 * seja: o Postgres barra a exclusão de uma empresa que ainda esteja em algum
 * crédito. Sem a checagem abaixo o painel devolveria o texto cru da violação
 * de chave estrangeira — que não diz ao editor o que fazer. Trinta dos
 * cinquenta e sete créditos apontam para empresas, então este caminho é
 * frequente, não excepcional.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceClient()

  const { count, error: countError } = await supabase
    .from('filmes_creditos')
    .select('id', { count: 'exact', head: true })
    .eq('empresa_id', id)
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })
  if (count && count > 0) {
    return NextResponse.json({
      error: `Esta empresa aparece em ${count} crédito${count > 1 ? 's' : ''} de filme. `
        + 'Troque ou remova esses créditos antes de excluí-la.',
    }, { status: 409 })
  }

  const { error } = await supabase.from('empresas').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidarEmpresas()
  return new NextResponse(null, { status: 204 })
}
