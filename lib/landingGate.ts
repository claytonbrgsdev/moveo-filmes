/**
 * Landing gate — modo "site em obras".
 *
 * Enquanto o gate está ativo, o visitante recebe a landing (`/em-breve`) em
 * QUALQUER rota, sem que a URL mude. Isso vale também para quem chega pelo
 * Google em `/sobre` ou numa página de filme — o site antigo está indexado.
 *
 * A porta de entrada é `/preview`: abrir uma vez libera o site completo nas
 * URLs reais, por 30 dias, naquele navegador. Não há senha — quem descobrir o
 * endereço entra. É de propósito.
 *
 * Como desligar o gate de vez: `LANDING_GATE=off` (ou remover estes arquivos —
 * ver README-INFRA.md).
 */

export const PREVIEW_COOKIE = 'moveo_preview'
export const LANDING_PATH = '/em-breve'
export const UNLOCK_PATH = '/preview'

/** Duração do cookie de preview: 30 dias. */
export const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30

/** Valor gravado no cookie. Não é segredo, só um marcador. */
export const PREVIEW_COOKIE_VALUE = 'on'

/**
 * O gate é ligado por padrão em produção — assim um deploy novo nunca expõe o
 * site por esquecimento de variável. Em desenvolvimento fica desligado por
 * padrão, para `pnpm dev` continuar abrindo o site inteiro.
 *
 * `LANDING_GATE` aceita 'on' | 'off' e tem a palavra final nos dois ambientes.
 */
export function isGateEnabled(): boolean {
  const flag = process.env.LANDING_GATE?.toLowerCase()
  if (flag === 'off') return false
  if (flag === 'on') return true
  return process.env.NODE_ENV === 'production'
}

/**
 * Caminhos que continuam respondendo normalmente mesmo com o gate ligado:
 * a própria landing, a porta de entrada e os assets que a landing consome
 * (fontes .otf, vídeo .mp4, imagens). Sem isso a landing carregaria sem
 * tipografia e sem vídeo.
 */
const STATIC_FILE = /\.(?:otf|ttf|woff2?|mp4|webm|mp3|svg|png|jpe?g|gif|webp|avif|ico|txt|xml|json|map)$/i

export function isAlwaysAllowed(pathname: string): boolean {
  return (
    pathname === LANDING_PATH ||
    pathname.startsWith(`${LANDING_PATH}/`) ||
    pathname === UNLOCK_PATH ||
    pathname.startsWith(`${UNLOCK_PATH}/`) ||
    pathname.startsWith('/_next/') ||
    STATIC_FILE.test(pathname)
  )
}
