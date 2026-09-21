import { supabase } from '../lib/supabase'
import LocalEventsProvider from './LocalEventsProvider'
import SupabaseEventsProvider from './SupabaseEventsProvider'

export { useEvents } from './eventsCore'

export function EventsProvider({ children }) {
  return supabase ? (
    <SupabaseEventsProvider>{children}</SupabaseEventsProvider>
  ) : (
    <LocalEventsProvider>{children}</LocalEventsProvider>
  )
}
