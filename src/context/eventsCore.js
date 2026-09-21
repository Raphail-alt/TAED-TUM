import { createContext, useContext } from 'react'

export const EventsContext = createContext(null)

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used inside EventsProvider')
  return ctx
}

export const sortByDate = (events) => [...events].sort((a, b) => a.date.localeCompare(b.date))
