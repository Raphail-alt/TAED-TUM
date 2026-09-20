import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedEvents } from '../data/events'

// Frontend-only stand-in for the Express + MongoDB events API.
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

const EventsContext = createContext(null)

export function EventsProvider({ children }) {
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

  const withSingleFeatured = (list, featuredId) =>
    list.map((e) => (e.featured && e.id !== featuredId ? { ...e, featured: false } : e))

  const addEvent = useCallback(
    (data) => {
      const event = { ...data, id: crypto.randomUUID() }
      commit((prev) => withSingleFeatured([...prev, event], event.featured ? event.id : null))
    },
    [commit],
  )

  const updateEvent = useCallback(
    (id, data) => {
      commit((prev) =>
        withSingleFeatured(
          prev.map((e) => (e.id === id ? { ...e, ...data } : e)),
          data.featured ? id : null,
        ),
      )
    },
    [commit],
  )

  const removeEvent = useCallback((id) => commit((prev) => prev.filter((e) => e.id !== id)), [commit])

  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events])
  const featured = useMemo(() => sorted.find((e) => e.featured) ?? null, [sorted])

  const value = useMemo(
    () => ({ events: sorted, featured, addEvent, updateEvent, removeEvent }),
    [sorted, featured, addEvent, updateEvent, removeEvent],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used inside EventsProvider')
  return ctx
}
