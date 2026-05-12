import { supabase } from '../../core/config/supabase'
import type { Event } from './types'

export type EventSetlistRow = {
  id: number
  position: number
  song: {
    id: number
    title: string
    progressions: Record<string, string>
  } | null
  key: {
    id: number
    name: string
    degree_chords: Record<string, string>
  } | null
}

type EventSetlistQueryRow = {
  id: number
  position: number
  song: { id: number; title: string; progressions: Record<string, string> }[] | null
  key: { id: number; name: string; degree_chords: Record<string, string> }[] | null
}

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

  async create(payload: { name: string; scheduled_on?: string | null; image_url?: string | null }): Promise<Event> {
    const { data, error } = await supabase.from('events').insert(payload).select('*').single()

    if (error) throw error
    return data as Event
  },

  async update(id: number, payload: { name: string; scheduled_on?: string | null; image_url?: string | null }): Promise<Event> {
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select('*').single()

    if (error) throw error
    return data as Event
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) throw error
  },

  async listSongCounts(): Promise<Record<number, number>> {
    const { data, error } = await supabase.from('event_songs').select('event_id')

    if (error) throw error

    return (data ?? []).reduce<Record<number, number>>((acc, row) => {
      const eventId = row.event_id
      acc[eventId] = (acc[eventId] ?? 0) + 1
      return acc
    }, {})
  },

  async getSetlist(eventId: number): Promise<EventSetlistRow[]> {
    const { data, error } = await supabase
      .from('event_songs')
      .select('id, position, song:songs(id, title, progressions), key:keys(id, name, degree_chords)')
      .eq('event_id', eventId)
      .order('position', { ascending: true })

    if (error) throw error

    const rows = (data ?? []) as EventSetlistQueryRow[]

    return rows.map((row) => ({
      id: row.id,
      position: row.position,
      song: row.song?.[0] ?? null,
      key: row.key?.[0] ?? null,
    }))
  },
}
