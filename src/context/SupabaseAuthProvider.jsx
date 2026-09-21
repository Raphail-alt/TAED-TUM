import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authCore'

const ACCOUNT_TABLES = [
  { table: 'students', role: 'student', emailColumn: 'email' },
  { table: 'mentors', role: 'mentor', emailColumn: 'email' },
  { table: 'companies', role: 'company', emailColumn: 'contact_email' },
]

async function buildUser(authUser) {
  if (!authUser) return null
  const { data: role, error } = await supabase.rpc('my_role')
  if (error) console.error('Could not load role. Has supabase/schema.sql been run?', error.message)
  return {
    id: authUser.id,
    role: role ?? null,
    name: authUser.user_metadata?.name || authUser.email,
    email: authUser.email,
  }
}

export default function SupabaseAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState(null)

  useEffect(() => {
    let active = true
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: calling supabase inside this callback can deadlock the auth client.
      setTimeout(async () => {
        const next = await buildUser(session?.user)
        if (!active) return
        setUser(next)
        setLoading(false)
      }, 0)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = user?.role === 'admin'

  const reloadAccounts = useCallback(async () => {
    setAccountsError(null)
    try {
      const groups = await Promise.all(
        ACCOUNT_TABLES.map(async ({ table, role, emailColumn }) => {
          const { data, error } = await supabase.from(table).select('*')
          if (error) throw error
          return data.map((r) => ({
            id: r.id,
            role,
            name: r.name,
            email: r[emailColumn],
            created_at: r.created_at,
          }))
        }),
      )
      setAccounts(groups.flat().sort((a, b) => b.created_at.localeCompare(a.created_at)))
    } catch (err) {
      setAccountsError(err.message)
    } finally {
      setAccountsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    reloadAccounts()

    const channel = supabase.channel('admin-accounts')
    ACCOUNT_TABLES.forEach(({ table }) => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, reloadAccounts)
    })
    channel.subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin, reloadAccounts])

  const signUp = useCallback(async ({ role, name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { role, name: name.trim() } },
    })
    if (error) throw new Error(error.message)
    // With email confirmation on, an already-registered email returns a user with no identities.
    if (data.user && data.user.identities?.length === 0) {
      throw new Error('An account with this email already exists.')
    }
    return { needsConfirmation: !data.session }
  }, [])

  const logIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      throw new Error(
        /confirm/i.test(error.message)
          ? 'Please confirm your email first. Check your inbox for the link.'
          : 'Incorrect email or password.',
      )
    }
  }, [])

  const logOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({
      mode: 'supabase',
      loading,
      user,
      isAdmin,
      accounts: isAdmin ? accounts : [],
      accountsLoading: isAdmin && accountsLoading,
      accountsError,
      reloadAccounts,
      signUp,
      logIn,
      logOut,
    }),
    [loading, user, isAdmin, accounts, accountsLoading, accountsError, reloadAccounts, signUp, logIn, logOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
