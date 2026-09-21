import { useCallback, useEffect, useMemo, useState } from 'react'
import { seedEvents } from '../data/events'
import { EventsContext, sortByDate } from './eventsCore'

// Demo-mode events used when Supabase keys are not configured. Data lives in this browser only.
const EVENTS_KEY = 'taed.events.v1'

function load() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through to seed */
  }
  return seedEvents
}

function persist(events) {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  } catch {
    /* storage unavailable */
  }
}

const withSingleFeatured = (list, featuredId) =>
  list.map((e) => (e.featured && e.id !== featuredId ? { ...e, featured: false } : e))

export default function LocalEventsProvider({ children }) {
  const [events, setEvents] = useState(load)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === EVENTS_KEY) setEvents(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const commit = useCallback((updater) => {
    setEvents((prev) => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addEvent = useCallback(
    async (data) => {
      const event = { ...data, id: crypto.randomUUID() }
      commit((prev) => withSingleFeatured([...prev, event], event.featured ? event.id : null))
    },
    [commit],
  )

  const updateEvent = useCallback(
    async (id, data) => {
      commit((prev) =>
        withSingleFeatured(
          prev.map((e) => (e.id === id ? { ...e, ...data } : e)),
          data.featured ? id : null,
        ),
      )
    },
    [commit],
  )

  const removeEvent = useCallback(async (id) => commit((prev) => prev.filter((e) => e.id !== id)), [commit])

  const sorted = useMemo(() => sortByDate(events), [events])
  const featured = useMemo(() => sorted.find((e) => e.featured) ?? null, [sorted])

  const value = useMemo(
    () => ({ mode: 'local', loading: false, error: null, events: sorted, featured, addEvent, updateEvent, removeEvent }),
    [sorted, featured, addEvent, updateEvent, removeEvent],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}
