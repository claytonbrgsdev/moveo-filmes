import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Cliente Supabase para as páginas PÚBLICAS (estáticas / SSG).
 *
 * Por que existe: invalidar a rota com `revalidatePath` não basta. A rota
 * re-renderiza, mas a query do Supabase volta do Data Cache do Next — o
 * snapshot gravado no build — e a página sai igualzinha. É preciso invalidar
 * as duas camadas, e para invalidar o fetch ele precisa carregar uma etiqueta.
 *
 * `cache: 'force-cache'` é explícito de propósito: desde o Next 15 o padrão do
 * fetch é `no-store`, e sem isso a página deixaria de ser estática.
 *
 * NÃO usar no /central nem nas rotas admin: lá a leitura tem que ser sempre
 * fresca (ver `createServiceClient` em `./service`, que continua sem cache).
 */
function fetchEtiquetado(tags: string[]) {
  return (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, cache: 'force-cache', next: { tags } })
}

/**
 * Chave de serviço — ignora RLS. As páginas públicas filtram
 * `visibilidade = 'publico'` na própria query.
 */
export function createCachedServiceClient(tags: string[]) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: fetchEtiquetado(tags) },
    }
  )
}

/** Chave anônima — sujeita a RLS. */
export function createCachedAnonClient(tags: string[]) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: fetchEtiquetado(tags) },
    }
  )
}
