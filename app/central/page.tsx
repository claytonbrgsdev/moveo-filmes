import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createServiceClient } from '@/lib/supabase/service'
import CentralClient from './CentralClient'

// Force dynamic rendering so cookies() works for auth
export const dynamic = 'force-dynamic'

export type FilmeListItem = {
  id: string
  slug: string
  titulo_pt: string | null
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
  const { data: filmes } = await supabase
    .from('filmes')
    .select('id, slug, titulo_pt, titulo_en, categoria_site, visibilidade, ano, status_interno_pt, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <CentralClient
      initialFilmes={(filmes ?? []) as FilmeListItem[]}
      userEmail={user.email ?? ''}
    />
  )
}
