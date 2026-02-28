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
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/central'

  const supabase = await createClient()

  if (code) {
    // PKCE flow (OAuth, magic link)
    await supabase.auth.exchangeCodeForSession(code)
  } else if (token_hash && type) {
    // OTP flow (email confirmation, password recovery)
    await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'recovery' | 'email' | 'signup' | 'invite' | 'magiclink',
    })
  }

  // Password recovery always goes to the reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
