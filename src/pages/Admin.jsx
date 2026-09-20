import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CalendarDays, ExternalLink, GraduationCap, Building2, LogOut, Pencil, Plus, Search, Star, Trash2, Users, Wrench, ShieldAlert } from 'lucide-react'
import { Logo } from '../components/Navbar'
import EventForm from '../components/EventForm'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import { formatDate, formatFullDate, formatTime } from '../lib/format'

const roleStyle = {
  student: { label: 'Student', icon: GraduationCap, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  mentor: { label: 'Mentor', icon: Wrench, cls: 'bg-lime-50 text-lime-700 border-lime-200' },
  company: { label: 'Company', icon: Building2, cls: 'bg-teal-50 text-teal-700 border-teal-200' },
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between text-mute">
        <span className="text-sm">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-panel-2 text-brand"><Icon size={18} /></span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  )
}

function EventsTab() {
  const { events, addEvent, updateEvent, removeEvent } = useEvents()
  const [editing, setEditing] = useState(null)

  const save = (data) => {
    if (editing === 'new') addEvent(data)
    else updateEvent(editing.id, data)
    setEditing(null)
  }

  const remove = (event) => {
    if (window.confirm(`Remove "${event.title}"? It will disappear from the landing page.`)) removeEvent(event.id)
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Events</h2>
          <p className="text-sm text-mute">Everything here is live on the landing page.</p>
        </div>
        <button onClick={() => setEditing('new')} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-2">
          <Plus size={18} /> Add event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center text-mute">
          No events yet. Add the first one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-panel text-xs uppercase tracking-wider text-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Link</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-line/60 last:border-0 hover:bg-panel/60">
                  <td className="max-w-xs px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      {e.title}
                      {e.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          <Star size={10} /> Main
                        </span>
                      )}
                    </div>
                    {e.venue && <p className="truncate text-xs text-mute">{e.venue}</p>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-mute">{formatDate(e.date)}, {formatTime(e.date)}</td>
                  <td className="px-4 py-3"><span className="rounded-full border border-line bg-panel px-2.5 py-1 text-xs font-medium">{e.category}</span></td>
                  <td className="px-4 py-3">
                    <a href={e.external_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                      Open <ExternalLink size={13} />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(e)} aria-label={`Edit ${e.title}`} className="rounded-lg border border-line p-2 text-mute hover:border-brand hover:text-brand">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(e)} aria-label={`Remove ${e.title}`} className="rounded-lg border border-line p-2 text-mute hover:border-coral hover:text-coral">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EventForm event={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}
    </section>
  )
}

function AccountsTab() {
  const { accounts } = useAuth()
  const [role, setRole] = useState('all')
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return accounts.filter(
      (a) => (role === 'all' || a.role === role) && (!q || a.name.toLowerCase().includes(q) || a.email.includes(q)),
    )
  }, [accounts, role, query])

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Registered accounts</h2>
          <p className="flex items-center gap-2 text-sm text-mute">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand" /></span>
            Updates live when someone signs up.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" aria-label="Search accounts" className="field pl-9" />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[['all', 'All'], ['student', 'Students'], ['mentor', 'Mentors'], ['company', 'Companies']].map(([r, label]) => (
          <button key={r} onClick={() => setRole(r)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${role === r ? 'border-brand bg-brand font-semibold text-white' : 'border-line bg-white text-mute hover:border-brand hover:text-brand'}`}>
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center text-mute">
          {accounts.length === 0 ? 'No accounts yet. They will appear here as people sign up.' : 'No accounts match your filters.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-panel text-xs uppercase tracking-wider text-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => {
                const meta = roleStyle[a.role]
                const Icon = meta.icon
                return (
                  <tr key={a.id} className="border-b border-line/60 last:border-0 hover:bg-panel/60">
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.cls}`}>
                        <Icon size={12} /> {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mute">{a.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-mute">{formatFullDate(a.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function Admin() {
  const { user, isAdmin, accounts, logOut } = useAuth()
  const { events } = useEvents()
  const navigate = useNavigate()
  const [tab, setTab] = useState('events')

  if (!user) return <Navigate to="/login" replace />

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <ShieldAlert size={40} className="mx-auto text-coral" />
          <h1 className="mt-4 font-display text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-mute">Your account does not have access to the dashboard.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-2">Back to site</Link>
        </div>
      </div>
    )
  }

  const count = (r) => accounts.filter((a) => a.role === r).length
  const tabs = [
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'accounts', label: 'Accounts', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-panel">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="hidden text-sm text-mute hover:text-brand sm:inline">View site</Link>
            <button
              onClick={() => { logOut(); navigate('/') }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-mute">Manage the events on the landing page and see who has signed up.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={CalendarDays} label="Events" value={events.length} />
          <Stat icon={GraduationCap} label="Students" value={count('student')} />
          <Stat icon={Wrench} label="Mentors" value={count('mentor')} />
          <Stat icon={Building2} label="Companies" value={count('company')} />
        </div>

        <div role="tablist" className="mt-8 mb-6 inline-flex gap-1 rounded-xl border border-line bg-white p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${tab === id ? 'bg-brand text-white shadow' : 'text-mute hover:text-brand'}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {tab === 'events' ? <EventsTab /> : <AccountsTab />}
      </main>
    </div>
  )
}
