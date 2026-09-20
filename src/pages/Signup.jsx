import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, Eye, EyeOff, GraduationCap, Loader2, Wrench } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { ROLES, useAuth } from '../context/AuthContext'

const roleMeta = {
  student: { label: 'Student', icon: GraduationCap, nameLabel: 'Full name', emailLabel: 'Email', namePh: 'Jane Mwangi' },
  mentor: { label: 'Mentor', icon: Wrench, nameLabel: 'Full name', emailLabel: 'Email', namePh: 'Dr. Ali Hassan' },
  company: { label: 'Company', icon: Building2, nameLabel: 'Company name', emailLabel: 'Contact email', namePh: 'Acme Technologies' },
}

export default function Signup() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const initial = params.get('role')
  const role = ROLES.includes(initial) ? initial : 'student'
  const meta = roleMeta[role]

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setBusy(true)
    try {
      await signUp({ role, name: form.name, email: form.email, password: form.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Free and quick. Pick the option that describes you.">
      <div role="tablist" aria-label="Account type" className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-line bg-panel p-1">
        {ROLES.map((r) => {
          const Icon = roleMeta[r].icon
          const active = r === role
          return (
            <button key={r} type="button" role="tab" aria-selected={active}
              onClick={() => setParams({ role: r }, { replace: true })}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition ${
                active ? 'bg-brand text-white shadow' : 'text-mute hover:text-brand'
              }`}>
              <Icon size={16} /> {roleMeta[r].label}
            </button>
          )
        })}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">{meta.nameLabel}</label>
          <input id="name" required maxLength={80} autoComplete={role === 'company' ? 'organization' : 'name'} className="field"
            placeholder={meta.namePh} value={form.name} onChange={set('name')} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">{meta.emailLabel}</label>
          <input id="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com"
            value={form.email} onChange={set('email')} />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} required minLength={8} autoComplete="new-password" className="field pr-11"
              placeholder="At least 8 characters" value={form.password} onChange={set('password')} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-brand">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm password</label>
          <input id="confirm" type={show ? 'text' : 'password'} required autoComplete="new-password" className="field"
            placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-coral">{error}</p>
        )}

        <button type="submit" disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-2 disabled:opacity-60">
          {busy && <Loader2 size={18} className="animate-spin" />} Create {meta.label.toLowerCase()} account
        </button>

        <p className="text-center text-sm text-mute">
          Already have an account? <Link to="/login" className="font-semibold text-brand hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
