import { supabase } from '../../core/config/supabase'
import type { Event } from './types'

export const eventsApi = {
  async list(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('scheduled_on', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as Event[]
  },

  async create(payload: { name: string; scheduled_on?: string | null }): Promise<Event> {
    const { data, error } = await supabase.from('events').insert(payload).select('*').single()

    if (error) throw error
    return data as Event
  },

  async update(id: number, payload: { name: string; scheduled_on?: string | null }): Promise<Event> {
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select('*').single()

    if (error) throw error
    return data as Event
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) throw error
  },
}
