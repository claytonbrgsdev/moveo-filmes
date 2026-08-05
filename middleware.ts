import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './lib/supabase/database.types'
import {
  PREVIEW_COOKIE,
  PREVIEW_COOKIE_VALUE,
  LANDING_PATH,
  isGateEnabled,
  isAlwaysAllowed,
} from './lib/landingGate'

/**
 * Next.js Middleware
 *
 * 1. Landing gate — enquanto o site está em obras, quem não passou por
 *    `/preview` recebe `/em-breve` em qualquer rota (ver lib/landingGate.ts).
 * 2. Supabase session refresh — mantém os cookies de auth frescos. Sem isso,
 *    `auth.getUser()` no servidor não enxerga a sessão depois do login e
 *    /central redireciona para a home.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- 1. Landing gate -------------------------------------------------
  // Roda ANTES do Supabase de propósito: a landing precisa continuar de pé
  // mesmo se o projeto Supabase estiver pausado ou fora do ar.
  if (isGateEnabled() && !isAlwaysAllowed(pathname)) {
    const authorized = request.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_COOKIE_VALUE

    if (!authorized) {
      // Requisição de API não deve receber HTML de volta.
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }

      // Rewrite (não redirect): a URL na barra do navegador continua a mesma.
      const url = request.nextUrl.clone()
      url.pathname = LANDING_PATH
      url.search = ''
      const gated = NextResponse.rewrite(url)
      gated.headers.set('x-robots-tag', 'noindex')
      return gated
    }
  }

  // --- 2. Supabase session refresh -------------------------------------
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refreshes the session on every request — critical for server-side auth
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    // Exclui internos do Next e arquivos estáticos. A lista de extensões
    // cobre fontes (.otf) e vídeos (.mp4) — sem elas, o gate reescreveria
    // esses assets para a landing e a própria landing quebraria.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|otf|ttf|woff|woff2|mp4|webm|mp3|txt|xml|json|map)$).*)',
  ],
}
