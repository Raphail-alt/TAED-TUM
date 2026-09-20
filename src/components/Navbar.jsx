import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { hash: '#about', label: 'About' },
  { hash: '#events', label: 'Events' },
  { hash: '#audience', label: 'Who it\'s for' },
  { hash: '#partners', label: 'Partners' },
  { hash: '#organizers', label: 'Organizers' },
]

export function Logo() {
  return (
    <Link to="/#top" className="flex items-center gap-2.5 font-display text-lg font-semibold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">T</span>
      <span>TAED <span className="text-mute">2026</span></span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, logOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.hash} to={`/${l.hash}`} className="text-sm text-mute transition hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-2">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              )}
              <span className="max-w-32 truncate text-sm text-mute">{user.name}</span>
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-brand hover:text-brand">
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-mute transition hover:text-brand">Log in</Link>
              <Link to="/signup" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-2">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <Link key={l.hash} to={`/${l.hash}`} onClick={() => setOpen(false)} className="block py-2.5 text-mute hover:text-brand">
              {l.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="rounded-full bg-brand px-4 py-2.5 text-center font-semibold text-white">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="rounded-full border border-line px-4 py-2.5 font-medium">
                  Log out ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-line px-4 py-2.5 text-center font-medium">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-brand px-4 py-2.5 text-center font-semibold text-white">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
