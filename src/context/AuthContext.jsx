import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Frontend-only stand-in for Supabase Auth. Replace the bodies of signUp/logIn/logOut
// and the accounts loader with Supabase calls when the backend is ready.
const ACCOUNTS_KEY = 'taed.accounts.v1'
const SESSION_KEY = 'taed.session.v1'

export const DEMO_ADMIN = { email: 'admin@taed.tum.ac.ke', password: 'admin1234' }
const ADMIN_USER = { id: 'admin', role: 'admin', name: 'TAED Admin', email: DEMO_ADMIN.email }

export const ROLES = ['student', 'mentor', 'company']

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

async function hash(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => read(ACCOUNTS_KEY, []))
  const [user, setUser] = useState(() => read(SESSION_KEY, null))

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ACCOUNTS_KEY) setAccounts(read(ACCOUNTS_KEY, []))
      if (e.key === SESSION_KEY) setUser(read(SESSION_KEY, null))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const startSession = useCallback((u) => {
    setUser(u)
    write(SESSION_KEY, u)
    return u
  }, [])

  const signUp = useCallback(
    async ({ role, name, email, password }) => {
      const cleanEmail = email.trim().toLowerCase()
      const current = read(ACCOUNTS_KEY, [])
      if (cleanEmail === DEMO_ADMIN.email || current.some((a) => a.email === cleanEmail)) {
        throw new Error('An account with this email already exists.')
      }
      const account = {
        id: crypto.randomUUID(),
        role,
        name: name.trim(),
        email: cleanEmail,
        password_hash: await hash(password),
        created_at: new Date().toISOString(),
      }
      const next = [account, ...current]
      write(ACCOUNTS_KEY, next)
      setAccounts(next)
      return startSession({ id: account.id, role, name: account.name, email: account.email })
    },
    [startSession],
  )

  const logIn = useCallback(
    async (email, password) => {
      const cleanEmail = email.trim().toLowerCase()
      if (cleanEmail === DEMO_ADMIN.email) {
        if (password !== DEMO_ADMIN.password) throw new Error('Incorrect email or password.')
        return startSession(ADMIN_USER)
      }
      const account = read(ACCOUNTS_KEY, []).find((a) => a.email === cleanEmail)
      if (!account || account.password_hash !== (await hash(password))) {
        throw new Error('Incorrect email or password.')
      }
      return startSession({ id: account.id, role: account.role, name: account.name, email: account.email })
    },
    [startSession],
  )

  const logOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = useMemo(
    () => ({ user, accounts, isAdmin: user?.role === 'admin', signUp, logIn, logOut }),
    [user, accounts, signUp, logIn, logOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
