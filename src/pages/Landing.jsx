import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin, Palmtree, Target, Users, Handshake, GraduationCap, Wrench, Building2, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import Countdown from '../components/Countdown'
import EventCard from '../components/EventCard'
import SectionHeading from '../components/SectionHeading'
import { useEvents } from '../context/EventsContext'
import { useAuth } from '../context/AuthContext'
import { eventCategories, organizers, focusAreas, audiences } from '../data/events'
import { formatDate, formatTime } from '../lib/format'

const audienceIcons = [GraduationCap, Wrench, Building2]

function Hero() {
  const { featured } = useEvents()
  const { user } = useAuth()

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-mint/25 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs text-mute shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-brand" /> Technical University of Mombasa &middot; 9th &ndash; 12th November 2026
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
            Tech &amp; Engineering <span className="text-gradient">Days</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mute">
            A week where builders, engineers and innovators come together for workshops, a symposium,
            nights of code and one unforgettable finale on the beaches of Diani.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/#events" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-2">
              Explore events <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link to="/signup" className="rounded-full border border-brand px-7 py-3.5 font-semibold text-brand transition hover:bg-brand hover:text-white">
                Create a free account
              </Link>
            )}
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-mute">Kicks off in</p>
            <Countdown />
          </div>
        </div>

        {featured && (
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_80px_-40px_rgb(21_128_61/0.45)]">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-64 bg-gradient-to-br from-brand to-mint md:min-h-full">
                {featured.image && (
                  <img src={featured.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Main event
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">{featured.category}</p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{featured.title}</h2>
                <p className="mt-4 leading-relaxed text-mute">{featured.description}</p>
                <div className="mt-5 space-y-2 text-sm text-mute">
                  <div className="flex items-center gap-2"><CalendarDays size={16} className="text-brand" />{formatDate(featured.date)} &middot; {formatTime(featured.date)}</div>
                  {featured.venue && <div className="flex items-center gap-2"><MapPin size={16} className="text-brand" />{featured.venue}</div>}
                </div>
                <a
                  href={featured.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-brand"
                >
                  Reserve your spot <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="About the week" title="Where the classroom meets the industry">
        Four days. Dozens of builders. One campus that never really sleeps.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-3xl border border-line bg-panel p-7 sm:p-9 lg:col-span-3">
          <div className="mb-4 flex items-center gap-3 text-brand"><Target size={22} /><span className="text-xs font-semibold uppercase tracking-[0.25em]">Our mission</span></div>
          <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
            To close the gap between students and real industry.
          </p>
          <p className="mt-5 leading-relaxed text-mute">
            Too many brilliant students graduate having never touched the tools, teams and problems they will face at work.
            TUM Tech &amp; Engineering Days changes that. We give young engineers and technologists hands-on exposure to AI,
            blockchain, cloud, data and the wider engineering fields, while building a stronger, more connected tech
            community across East African universities.
          </p>
          <p className="mt-4 leading-relaxed text-mute">
            Expect workshops where you actually build, a symposium that sets the tone, nights of code fuelled by coffee
            and curiosity, an engineering roundtable with people doing the job today, honest tech storytelling, an
            innovation challenge with real stakes, and an exchange program that brings students from other universities
            to our campus. Then we head to the coast to celebrate together.
          </p>
        </div>

        <div className="grid gap-6 lg:col-span-2">
          <div className="rounded-3xl border border-line bg-white p-7">
            <div className="mb-3 flex items-center gap-3 text-brand"><Handshake size={22} /><span className="text-xs font-semibold uppercase tracking-[0.25em]">What you'll do</span></div>
            <ul className="space-y-2.5 text-mute">
              {['Build in hands-on workshops', 'Code through the night', 'Pitch at the Innovation Challenge', 'Meet mentors and companies', 'Swap ideas with other universities'].map((i) => (
                <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{i}</li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-brand p-7 text-white">
            <Palmtree className="absolute -bottom-4 -right-4 text-white/15" size={130} />
            <div className="mb-3 flex items-center gap-3 text-mint"><Palmtree size={22} /><span className="text-xs font-semibold uppercase tracking-[0.25em]">The finale</span></div>
            <p className="relative font-display text-xl font-semibold">Diani Day</p>
            <p className="relative mt-2 text-white/85">The week closes with a mega gathering at Diani. Sand, music and the whole community together.</p>
          </div>
        </div>
      </div>

      <div className="relative mt-14 overflow-hidden rounded-2xl border border-line bg-panel py-5">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...focusAreas, ...focusAreas, ...focusAreas, ...focusAreas].map((f, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-2xl font-semibold">
              <span className="text-gradient">{f.title}</span>
              <span className="text-mint">&#10022;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Events() {
  const { events, loading, error } = useEvents()
  const [active, setActive] = useState('All')
  const shown = useMemo(
    () => (active === 'All' ? events : events.filter((e) => e.category === active)),
    [active, events],
  )

  return (
    <section id="events" className="scroll-mt-16 border-y border-line bg-panel py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="The schedule" title="What's happening">
          Every event links out to where you register or pay. Pick what fits and we'll see you there.
        </SectionHeading>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {['All', ...eventCategories].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                active === c ? 'border-brand bg-brand font-semibold text-white' : 'border-line bg-white text-mute hover:border-brand hover:text-brand'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-16 text-center text-mute">Loading events...</p>
        ) : error ? (
          <p role="alert" className="py-16 text-center text-mute">We could not load the events right now. Please refresh in a moment.</p>
        ) : shown.length === 0 ? (
          <p className="py-16 text-center text-mute">No events in this category yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function Audience() {
  const { user } = useAuth()

  return (
    <section id="audience" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Who it's for" title="Built for everyone in the pipeline">
        Students, engineers, developers and tech enthusiasts at TUM and beyond, plus the mentors and companies
        looking to connect with the next generation of Kenyan tech and engineering talent.
      </SectionHeading>
      <div className="grid gap-6 md:grid-cols-3">
        {audiences.map((a, i) => {
          const Icon = audienceIcons[i]
          return (
            <div key={a.title} className="rounded-3xl border border-line bg-white p-8 transition hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-panel-2 text-brand"><Icon size={24} /></div>
              <h3 className="font-display text-xl font-semibold">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{a.text}</p>
            </div>
          )
        })}
      </div>

      {!user && (
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand p-8 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-semibold">Join the community</h3>
            <p className="mt-1 text-white/85">Create a free student, mentor or company account. It takes a minute.</p>
          </div>
          <Link to="/signup" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand transition hover:bg-ink hover:text-white">
            Create account <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </section>
  )
}

function Partners() {
  return (
    <section id="partners" className="scroll-mt-16 border-t border-line bg-panel py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Sponsors & Partners" title="Backed by people who build">
          Confirmed sponsors and partners will appear here.
        </SectionHeading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="grid h-24 place-items-center rounded-2xl border border-dashed border-brand/40 bg-white text-xs uppercase tracking-widest text-mute/70">
              Logo {i + 1}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-mute">
          Want to partner with us? <a href="#footer" className="font-medium text-brand underline-offset-4 hover:underline">Get in touch</a>.
        </p>
      </div>
    </section>
  )
}

function Organizers() {
  return (
    <section id="organizers" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="The team" title="Meet the organizers">
        The people making the week happen.
      </SectionHeading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-3xl border border-line bg-white p-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-panel-2 text-brand">
              <Users size={30} />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">Organizer name</h3>
            <p className="text-sm font-medium text-brand">Club / Role</p>
            <p className="mt-2 text-sm text-mute">A short bio goes here.</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="footer" className="scroll-mt-16 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-mint">Hosted by</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {organizers.map((o) => (
            <div key={o.name} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white font-display text-lg font-bold text-brand">
                {o.initials}
              </div>
              <div>
                <p className="font-display font-semibold">{o.name}</p>
                <p className="text-xs leading-snug text-white/65">{o.full}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/65 sm:flex-row">
          <p>&copy; 2026 TUM Tech &amp; Engineering Days &middot; Technical University of Mombasa</p>
          <p>9th &ndash; 12th November 2026 &middot; Diani Day closing</p>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Events />
        <Audience />
        <Partners />
        <Organizers />
      </main>
      <Footer />
    </>
  )
}
