import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { Logo } from './Navbar'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-mint/30 blur-3xl" />

        <div className="relative flex items-center gap-2.5 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-sm font-bold text-brand">T</span>
          TAED 2026
        </div>

        <div className="relative">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Where the classroom meets the industry.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/85">
            Join students, mentors and companies for four days of workshops, nights of code and one unforgettable finale in Diani.
          </p>
          <div className="mt-8 space-y-2 text-white/90">
            <p className="flex items-center gap-2"><CalendarDays size={18} className="text-mint" /> 9th &ndash; 12th November 2026</p>
            <p className="flex items-center gap-2"><MapPin size={18} className="text-mint" /> Technical University of Mombasa</p>
          </div>
        </div>

        <p className="relative text-sm text-white/70">Hosted by TUM TIS, ESA-TUM and Web3 Clubs-TUM</p>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="lg:hidden"><Logo /></div>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-mute transition hover:text-brand">
            <ArrowLeft size={16} /> Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-mute">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
