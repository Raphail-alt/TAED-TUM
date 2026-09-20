import { CalendarDays, MapPin, ArrowUpRight } from 'lucide-react'
import { formatDate, formatTime } from '../lib/format'

const accent = {
  'Diani Day': 'bg-amber-50 text-sun border-amber-300',
  Hackathon: 'bg-rose-50 text-coral border-rose-300',
}

export default function EventCard({ event }) {
  const badge = accent[event.category] ?? 'bg-white text-brand border-line'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_20px_40px_-20px_rgb(21_128_61/0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-panel-2 to-mint/40">
        {event.image && (
          <img
            src={event.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${badge}`}>
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug">{event.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{event.description}</p>

        <div className="mt-4 space-y-1.5 text-sm text-mute">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-brand" />
            {formatDate(event.date)} &middot; {formatTime(event.date)}
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-brand" />
              {event.venue}
            </div>
          )}
        </div>

        <a
          href={event.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          Register / Details <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  )
}
