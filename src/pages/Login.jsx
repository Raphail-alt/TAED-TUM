import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { DEMO_ADMIN, useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, mode, logIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await logIn(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your student, mentor, company or admin account.">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" className="field pr-11"
              placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-brand">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-coral">{error}</p>
        )}

        <button type="submit" disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-2 disabled:opacity-60">
          {busy && <Loader2 size={18} className="animate-spin" />} Log in
        </button>

        <p className="text-center text-sm text-mute">
          New here? <Link to="/signup" className="font-semibold text-brand hover:underline">Create an account</Link>
        </p>

        {import.meta.env.DEV && mode === 'local' && (
          <div className="rounded-xl border border-dashed border-brand/40 bg-panel p-3 text-xs text-mute">
            <p className="font-semibold text-brand">Demo admin (dev only)</p>
            <p className="mt-1">{DEMO_ADMIN.email} / {DEMO_ADMIN.password}</p>
          </div>
        )}
      </form>
    </AuthLayout>
  )
}

