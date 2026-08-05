import { NextResponse, type NextRequest } from 'next/server'
import {
  PREVIEW_COOKIE,
  PREVIEW_COOKIE_VALUE,
  PREVIEW_MAX_AGE,
  LANDING_PATH,
} from '@/lib/landingGate'

/**
 * Porta de entrada do site completo enquanto o landing gate está ativo.
 *
 *   /preview           libera o site por 30 dias e manda para a home
 *   /preview?sair=1    volta a ver a landing
 *
 * Sem senha, de propósito: é um link para mandar para a cliente, não um
 * controle de acesso.
 */
export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('sair')) {
    const response = NextResponse.redirect(new URL(LANDING_PATH, request.url))
    response.cookies.delete(PREVIEW_COOKIE)
    return response
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set(PREVIEW_COOKIE, PREVIEW_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: PREVIEW_MAX_AGE,
    path: '/',
  })
  return response
}
