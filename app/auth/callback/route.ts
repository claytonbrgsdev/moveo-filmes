import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Auth Callback Route
 *
 * Handles Supabase auth redirects for:
 * - Password reset (type=recovery)
 * - Email confirmation (type=email)
 * - OAuth sign-in (code= PKCE flow)
 *
 * Supabase sends users here after they click an email link.
 * This route exchanges the token for a session, then redirects
 * to the appropriate page.
 *
 * Erro de token não pode ser engolido. Link de recuperação expira em uma hora
 * e só serve uma vez — quem clica no link velho (ou pela segunda vez) chegava
 * aqui, tinha o erro descartado, caía em `/auth/reset-password` sem sessão,
 * era rebotado para `/auth/login` e não via explicação nenhuma. Parecia o
 * painel estar quebrado. Agora o motivo viaja na querystring e o formulário de
 * login mostra.
 */
/**
 * O Supabase responde em inglês e quem lê isto é a produção da Moveo. Só os
 * casos que realmente acontecem com link de e-mail; o resto passa como veio,
 * que é melhor do que uma mensagem genérica escondendo a causa.
 */
function emPortugues(mensagem: string): string {
  const m = mensagem.toLowerCase()
  if (m.includes('expired') || m.includes('invalid')) {
    return 'Este link não vale mais — ele expira em uma hora e só funciona uma vez. '
      + 'Peça um novo em "Esqueceu sua senha?".'
  }
  if (m.includes('already') && m.includes('registered')) {
    return 'Já existe uma conta com esse e-mail. Entre com a senha, ou peça um link de recuperação.'
  }
  return mensagem
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/central'

  const supabase = await createClient()

  let erro: string | null = null

  if (code) {
    // PKCE flow (OAuth, magic link)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    erro = error?.message ?? null
  } else if (token_hash && type) {
    // OTP flow (email confirmation, password recovery)
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'recovery' | 'email' | 'signup' | 'invite' | 'magiclink',
    })
    erro = error?.message ?? null
  } else {
    erro = 'Link de acesso incompleto ou já utilizado.'
  }

  if (erro) {
    const destino = new URL('/auth/login', origin)
    destino.searchParams.set('erro', emPortugues(erro))
    return NextResponse.redirect(destino)
  }

  // Password recovery always goes to the reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
