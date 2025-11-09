import { createServiceClient } from '@/lib/supabase/service'

/**
 * Admin User Management Utilities
 * Requer Service Role Key - Use apenas no servidor!
 */

/**
 * Send a user an invite over email
 * Send a user a passwordless link which they can use to sign up and log in.
 * 
 * ⚠️ This endpoint requires you use the service_role_key when initializing the client,
 * and should only be invoked from the server, never from the client.
 * 
 * Documentação: https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail
 */
export async function inviteUserByEmail(email: string): Promise<{ error: Error | null }> {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase.auth.admin.inviteUserByEmail(email)
    
    return { error }
  } catch (error: any) {
    return { error }
  }
}

