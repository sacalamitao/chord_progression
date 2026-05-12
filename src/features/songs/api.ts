import { supabase } from '../../core/config/supabase'
import type { Song } from './types'

export const songsApi = {
  async list(): Promise<Song[]> {
    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as Song[]
  },

  async create(payload: { title: string; default_key_id: number | null; progressions?: Record<string, string> }): Promise<Song> {
    const { data, error } = await supabase.from('songs').insert(payload).select('*').single()

    if (error) throw error
    return data as Song
  },

  async updateDefaultKey(payload: { songId: number; default_key_id: number | null }): Promise<Song> {
    const { data, error } = await supabase
      .from('songs')
      .update({ default_key_id: payload.default_key_id })
      .eq('id', payload.songId)
      .select('*')
      .single()

    if (error) throw error
    return data as Song
  },

  async updateProgression(payload: { songId: number; progression: string }): Promise<Song> {
    const nextProgressions = payload.progression.trim() ? { main: payload.progression.trim() } : {}

    const { data, error } = await supabase
      .from('songs')
      .update({ progressions: nextProgressions })
      .eq('id', payload.songId)
      .select('*')
      .single()

    if (error) throw error
    return data as Song
  },
}
