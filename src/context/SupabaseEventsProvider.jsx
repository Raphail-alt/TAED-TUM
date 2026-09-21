import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { EventsContext, sortByDate } from './eventsCore'

const COLUMNS = 'id, title, description, date, category, venue, external_link, image, featured'

const pick = (e) => ({
  title: e.title,
  description: e.description,
  date: e.date,
  category: e.category,
  venue: e.venue ?? '',
  external_link: e.external_link,
  image: e.image ?? '',
  featured: Boolean(e.featured),
})

export default function SupabaseEventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from('events').select(COLUMNS).order('date')
    if (err) {
      setError(err.message)
    } else {
      setError(null)
      setEvents(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const channel = supabase
      .channel('public-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const addEvent = useCallback(
    async (data) => {
      const { error: err } = await supabase.from('events').insert(pick(data))
      if (err) throw new Error(err.message)
      await load()
    },
    [load],
  )

  const updateEvent = useCallback(
    async (id, data) => {
      const { data: rows, error: err } = await supabase.from('events').update(pick(data)).eq('id', id).select('id')
      if (err) throw new Error(err.message)
      if (!rows.length) throw new Error('Not allowed, or this event no longer exists.')
      await load()
    },
    [load],
  )

  const removeEvent = useCallback(
    async (id) => {
      const { data: rows, error: err } = await supabase.from('events').delete().eq('id', id).select('id')
      if (err) throw new Error(err.message)
      if (!rows.length) throw new Error('Not allowed, or this event no longer exists.')
      await load()
    },
    [load],
  )

  const sorted = useMemo(() => sortByDate(events), [events])
  const featured = useMemo(() => sorted.find((e) => e.featured) ?? null, [sorted])

  const value = useMemo(
    () => ({ mode: 'supabase', loading, error, events: sorted, featured, addEvent, updateEvent, removeEvent }),
    [loading, error, sorted, featured, addEvent, updateEvent, removeEvent],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}
