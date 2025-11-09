import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Service Role Client - Use apenas no servidor!
 * Esta chave tem acesso TOTAL ao banco de dados, ignorando RLS.
 * NUNCA exponha esta chave no cliente/browser.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não está configurada')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

