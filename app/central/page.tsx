import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import CentralClient from './CentralClient'
import type { PessoaListItem } from './components/PessoasList'
import type { PostListItem } from './components/PostsList'

// Force dynamic rendering so cookies() works for auth
export const dynamic = 'force-dynamic'

export type FilmeListItem = {
  id: string
  slug: string
  titulo_pt: string
  titulo_en: string | null
  categoria_site: string | null
  visibilidade: string | null
  ano: number | null
  status_interno_pt: string | null
  updated_at: string
}

export default async function CentralPage() {
  const user = await requireAdmin()

  const supabase = createServiceClient()

  const [filmesResult, pessoasResult, postsResult] = await Promise.all([
    supabase
      .from('filmes')
      .select('id, slug, titulo_pt, titulo_en, categoria_site, visibilidade, ano, status_interno_pt, updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('pessoas')
      .select('id, nome, nome_exibicao, slug, areas_atuacao, foto_url, visibilidade, updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('posts')
      .select('id, slug, titulo_pt, titulo_en, tipo, visibilidade, publicado_em, updated_at')
      .order('updated_at', { ascending: false }),
  ])

  return (
    <CentralClient
      initialFilmes={(filmesResult.data ?? []) as FilmeListItem[]}
      initialPessoas={(pessoasResult.data ?? []) as PessoaListItem[]}
      initialPosts={(postsResult.data ?? []) as PostListItem[]}
      userEmail={user.email ?? ''}
    />
  )
}
