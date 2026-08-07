/**
 * Etiquetas de cache das leituras públicas do Supabase.
 *
 * Cada página pública marca suas queries com uma destas (ver
 * `lib/supabase/cached.ts`), e o /central as invalida ao salvar
 * (ver `lib/cache/revalidate.ts`). Sem etiqueta, a query fica presa no
 * snapshot do build mesmo depois da rota ser revalidada.
 */
export const TAG_FILMES = 'filmes'
export const TAG_POSTS = 'posts'
export const TAG_PESSOAS = 'pessoas'
