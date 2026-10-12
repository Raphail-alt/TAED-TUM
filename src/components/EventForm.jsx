import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
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

const MAX_BYTES = 2 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png']

const isHttpUrl = (value) => {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

async function uploadEventImage(file) {
  if (!supabase) throw new Error('Image upload needs the live Supabase connection.')
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `events/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from('event-images')
    .upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('event-images').getPublicUrl(path).data.publicUrl
}

export default function EventForm({ event, onSave, onClose, saveError }) {
  const [form, setForm] = useState(() =>
    event ? { ...empty, ...event, date: event.date.slice(0, 16) } : empty,
  )
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(event?.image || '')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const pickImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!ALLOWED.includes(file.type)) {
      setError('Image must be a JPEG or PNG file.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be under 2MB.')
      e.target.value = ''
      return
    }
    setError('')
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const link = form.external_link.trim()
    if (!isHttpUrl(link)) return setError('External link must be a full URL starting with http:// or https://')
    setBusy(true)
    try {
      const image = imageFile ? await uploadEventImage(imageFile) : form.image
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        category: form.category,
        venue: form.venue.trim(),
        external_link: link,
        image,
        featured: form.featured,
      })
    } catch (err) {
      setError(err.message || 'Could not save the event.')
    } finally {
      setBusy(false)
    }
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
            <label htmlFor="ev-img" className="mb-1.5 block text-sm font-medium">
              Event image <span className="font-normal text-mute">(optional, JPEG or PNG, max 2MB)</span>
            </label>
            <input id="ev-img" type="file" accept="image/jpeg,image/png" className="field" onChange={pickImage} />
            {preview && <img src={preview} alt="Preview" className="mt-3 h-32 w-full rounded-xl object-cover" />}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-panel p-3">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-brand" checked={form.featured} onChange={set('featured')} />
            <span className="text-sm">
              <span className="font-medium">Feature as the main event</span>
              <span className="block text-mute">Shows in the large card under the hero. Only one event can be featured.</span>
            </span>
          </label>
        </div>

        {(error || saveError) && (
          <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-coral">{error || saveError}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 font-medium hover:border-brand hover:text-brand">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="rounded-xl bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-2 disabled:opacity-60">
            {busy ? 'Saving...' : event ? 'Save changes' : 'Add event'}
          </button>
        </div>
      </form>
    </div>
  )
}