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

export type AddSongsToEventPayload = {
  eventId: number
  items: Array<{
    songId: number
    keyId: number
  }>
}

export type EventSongSelectionOption = {
  id: number
  title: string
  default_key_id: number | null
}

type EventSetlistQueryRow = {
  id: number
  position: number
  song_id: number
  key_id: number
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
      .select('id, position, song_id, key_id')
      .eq('event_id', eventId)
      .order('position', { ascending: true })

    if (error) throw error

    const rows = (data ?? []) as EventSetlistQueryRow[]

    if (rows.length === 0) return []

    const songIds = Array.from(new Set(rows.map((row) => row.song_id)))
    const keyIds = Array.from(new Set(rows.map((row) => row.key_id)))

    const [{ data: songsData, error: songsError }, { data: keysData, error: keysError }] = await Promise.all([
      supabase.from('songs').select('id, title, progressions').in('id', songIds),
      supabase.from('keys').select('id, name, degree_chords').in('id', keyIds),
    ])

    if (songsError) throw songsError
    if (keysError) throw keysError

    const songById = new Map((songsData ?? []).map((song) => [song.id, song]))
    const keyById = new Map((keysData ?? []).map((key) => [key.id, key]))

    return rows.map((row) => ({
      id: row.id,
      position: row.position,
      song: songById.get(row.song_id) ?? null,
      key: keyById.get(row.key_id) ?? null,
    }))
  },

  async addSongsToEvent(payload: AddSongsToEventPayload): Promise<void> {
    if (payload.items.length === 0) return

    const { data: currentRows, error: currentError } = await supabase
      .from('event_songs')
      .select('position')
      .eq('event_id', payload.eventId)
      .order('position', { ascending: false })
      .limit(1)

    if (currentError) throw currentError

    const currentMaxPosition = currentRows?.[0]?.position ?? 0

    const rows = payload.items.map((item, index) => ({
      event_id: payload.eventId,
      song_id: item.songId,
      key_id: item.keyId,
      position: currentMaxPosition + index + 1,
    }))

    const { error } = await supabase.from('event_songs').insert(rows)
    if (error) throw error
  },

  async removeSongFromEvent(payload: { eventSongId: number }): Promise<void> {
    const { error } = await supabase.from('event_songs').delete().eq('id', payload.eventSongId)
    if (error) throw error
  },

  async updateEventSongKey(payload: { eventSongId: number; keyId: number }): Promise<void> {
    const { error } = await supabase
      .from('event_songs')
      .update({ key_id: payload.keyId })
      .eq('id', payload.eventSongId)

    if (error) throw error
  },

  async listSongSelectionOptions(): Promise<EventSongSelectionOption[]> {
    const { data, error } = await supabase.from('songs').select('id, title, default_key_id').order('title', { ascending: true })
    if (error) throw error
    return (data ?? []) as EventSongSelectionOption[]
  },

  async listSongSelectionOptionsForEvent(eventId: number): Promise<EventSongSelectionOption[]> {
    const [{ data: songsData, error: songsError }, { data: linkedRows, error: linkedError }] = await Promise.all([
      supabase.from('songs').select('id, title, default_key_id').order('title', { ascending: true }),
      supabase.from('event_songs').select('song_id').eq('event_id', eventId),
    ])

    if (songsError) throw songsError
    if (linkedError) throw linkedError

    const linkedSongIds = new Set((linkedRows ?? []).map((row) => row.song_id))
    const allSongs = (songsData ?? []) as EventSongSelectionOption[]
    return allSongs.filter((song) => !linkedSongIds.has(song.id))
  },
}
