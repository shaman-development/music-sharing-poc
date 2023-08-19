import {createClient, type SupabaseClientOptions} from '@supabase/supabase-js'
import type { Database } from '@/plugins/supabase.types'

const options: SupabaseClientOptions<"public"> = {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
  options
)
export default supabase
