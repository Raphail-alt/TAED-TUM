import { supabase } from '../lib/supabase'
import LocalAuthProvider from './LocalAuthProvider'
import SupabaseAuthProvider from './SupabaseAuthProvider'

export { ROLES, useAuth } from './authCore'
export { DEMO_ADMIN } from './LocalAuthProvider'

export function AuthProvider({ children }) {
  return supabase ? (
    <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
  ) : (
    <LocalAuthProvider>{children}</LocalAuthProvider>
  )
}
