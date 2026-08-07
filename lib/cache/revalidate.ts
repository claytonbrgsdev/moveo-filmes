import { revalidatePath, revalidateTag } from 'next/cache'
import { TAG_FILMES, TAG_POSTS, TAG_PESSOAS } from './tags'

/**
 * Republicação das páginas públicas depois de uma escrita no /central.
 *
 * Todas as páginas públicas são estáticas ou SSG (confira o quadro de rotas no
 * fim do `pnpm build`): elas leem o Supabase **no momento do build** e nunca
 * mais. Sem isso aqui, salvar no painel gravava no banco e o site continuava
 * mostrando o conteúdo antigo até o próximo deploy.
 *
 * São **duas** camadas de cache, e invalidar só uma não adianta:
 *
 *   1. `revalidateTag` — o Data Cache, onde a resposta do Supabase fica
 *      guardada desde o build. Sem isto a rota até re-renderiza, mas
 *      re-renderiza com os mesmos dados velhos.
 *   2. `revalidatePath` — o Full Route Cache, o HTML pronto em disco.
 *
 * A ordem importa: etiqueta primeiro, rota depois.
 *
 * As rotas com `[slug]` são revalidadas por rota inteira, não por caminho
 * literal. É de propósito: o slug pode ter mudado na própria edição, e um
 * filme pode trocar de `categoria_site` (e portanto de página de listagem).
 * Revalidar a rota inteira cobre os dois casos sem precisar rastrear o valor
 * anterior. Com o volume atual do catálogo (dezenas de páginas) o custo é
 * irrelevante.
 *
 * Conteúdo **novo** não precisa de tratamento: `dynamicParams` está no padrão
 * (`true`), então um slug que não existia no build é renderizado sob demanda
 * na primeira visita e fica em cache a partir dali.
 */

/** Listagens do catálogo — uma por `categoria_site`. */
const CATALOGO_LISTAS = [
  '/catalogo/cinema',
  '/catalogo/mostras-e-exposicoes',
  '/catalogo/desenvolvimento',
  '/catalogo/pre-producao',
  '/catalogo/pos-producao',
  '/catalogo/distribuicao',
] as const

/** Rotas dinâmicas que renderizam a página de detalhe de um filme. */
const FILME_ROTAS_DETALHE = [
  '/catalogo/cinema/[slug]',
  '/catalogo/mostras-e-exposicoes/[slug]',
] as const

/**
 * `revalidatePath` só é válido dentro de Route Handler ou Server Action, e uma
 * falha aqui não pode derrubar uma escrita que já foi commitada no banco — o
 * dado está salvo, o pior caso é o site demorar para refletir. Por isso o
 * catch: registra e segue.
 */
function republicar(caminho: string, tipo?: 'page' | 'layout') {
  try {
    revalidatePath(caminho, tipo)
  } catch (err) {
    console.error(`[revalidate] falhou em ${caminho}:`, err)
  }
}

/**
 * Mesma proteção do `republicar`, para o Data Cache.
 *
 * O segundo argumento do `revalidateTag` passou a ser obrigatório no Next 16 e
 * decide o comportamento. `'max'`, o padrão recomendado, é
 * stale-while-revalidate com `stale: 300` — ou seja, o site continuaria
 * servindo o conteúdo velho por até cinco minutos depois do salvar. Para um
 * CMS isso é inaceitável, e a própria doc aponta `{ expire: 0 }` como o caso
 * de "sistema externo chamando um Route Handler que precisa expirar já".
 */
function invalidarEtiqueta(tag: string) {
  try {
    revalidateTag(tag, { expire: 0 })
  } catch (err) {
    console.error(`[revalidate] falhou na etiqueta ${tag}:`, err)
  }
}

/**
 * Chamar depois de criar, editar ou apagar um filme — e também depois de
 * qualquer escrita nas tabelas filhas (assets, créditos, elenco, festivais,
 * premiações, financiamentos), que alimentam a mesma página de detalhe.
 */
export function revalidarFilmes() {
  invalidarEtiqueta(TAG_FILMES)
  for (const lista of CATALOGO_LISTAS) republicar(lista)
  for (const rota of FILME_ROTAS_DETALHE) republicar(rota, 'page')
  // A filmografia em /pessoa/[slug] resolve o slug do filme para montar o
  // link — renomear um filme quebraria esses links sem isto.
  republicar('/pessoa/[slug]', 'page')
}

/** Chamar depois de criar, editar ou apagar um post. */
export function revalidarPosts() {
  invalidarEtiqueta(TAG_POSTS)
  republicar('/posts')
  republicar('/noticias')
  republicar('/post/[slug]', 'page')
}

/** Chamar depois de criar, editar ou apagar uma pessoa. */
export function revalidarPessoas() {
  invalidarEtiqueta(TAG_PESSOAS)
  republicar('/pessoa/[slug]', 'page')
}
