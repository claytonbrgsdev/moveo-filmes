import { requireAuth } from '@/lib/auth/requireAuth'
import { redirect } from 'next/navigation'

/**
 * Server-side utility to require admin access.
 * 1. Checks authentication (redirects to /auth/login if not logged in)
 * 2. Checks if the user's email is in the ADMIN_EMAILS whitelist
 *    (redirects to / if not authorized)
 *
 * Usage: await requireAdmin() at the top of any admin Server Component or API Route.
 */
export async function requireAdmin() {
  const user = await requireAuth()

  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (allowed.length === 0 || !allowed.includes((user.email ?? '').toLowerCase())) {
    redirect('/')
  }

  return user
}
