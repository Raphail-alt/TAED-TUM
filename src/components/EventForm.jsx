import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { eventCategories } from '../data/events'

const empty = {
  title: '',
  description: '',
  date: '',
  category: eventCategories[0],
  venue: '',
  external_link: '',
  image: '',
  featured: false,
}

const isHttpUrl = (value) => {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export default function EventForm({ event, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    event ? { ...empty, ...event, date: event.date.slice(0, 16) } : empty,
  )
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const link = form.external_link.trim()
    const image = form.image.trim()
    if (!isHttpUrl(link)) return setError('External link must be a full URL starting with http:// or https://')
    if (image && !isHttpUrl(image)) return setError('Image must be a full URL starting with http:// or https://')
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      category: form.category,
      venue: form.venue.trim(),
      external_link: link,
      image,
      featured: form.featured,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="event-form-title" className="font-display text-2xl font-bold">{event ? 'Edit event' : 'Add event'}</h2>
            <p className="mt-1 text-sm text-mute">Saved events appear on the landing page immediately.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-mute hover:bg-panel hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="ev-title" className="mb-1.5 block text-sm font-medium">Title</label>
            <input id="ev-title" required maxLength={100} className="field" value={form.title} onChange={set('title')} />
          </div>

          <div>
            <label htmlFor="ev-desc" className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea id="ev-desc" required rows={3} maxLength={400} className="field resize-y" value={form.description} onChange={set('description')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ev-date" className="mb-1.5 block text-sm font-medium">Date and time</label>
              <input id="ev-date" type="datetime-local" required className="field" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label htmlFor="ev-cat" className="mb-1.5 block text-sm font-medium">Category</label>
              <select id="ev-cat" className="field" value={form.category} onChange={set('category')}>
                {eventCategories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ev-venue" className="mb-1.5 block text-sm font-medium">Venue <span className="font-normal text-mute">(optional)</span></label>
            <input id="ev-venue" maxLength={100} className="field" value={form.venue} onChange={set('venue')} />
          </div>

          <div>
            <label htmlFor="ev-link" className="mb-1.5 block text-sm font-medium">External link</label>
            <input id="ev-link" type="url" required className="field" placeholder="https://lu.ma/your-event" value={form.external_link} onChange={set('external_link')} />
            <p className="mt-1 text-xs text-mute">Where people register or pay (Luma, a form, any outside page).</p>
          </div>

          <div>
            <label htmlFor="ev-img" className="mb-1.5 block text-sm font-medium">Image URL <span className="font-normal text-mute">(optional)</span></label>
            <input id="ev-img" type="url" className="field" placeholder="https://..." value={form.image} onChange={set('image')} />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-panel p-3">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-brand" checked={form.featured} onChange={set('featured')} />
            <span className="text-sm">
              <span className="font-medium">Feature as the main event</span>
              <span className="block text-mute">Shows in the large card under the hero. Only one event can be featured.</span>
            </span>
          </label>
        </div>

        {error && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-coral">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 font-medium hover:border-brand hover:text-brand">
            Cancel
          </button>
          <button type="submit" className="rounded-xl bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-2">
            {event ? 'Save changes' : 'Add event'}
          </button>
        </div>
      </form>
    </div>
  )
}
