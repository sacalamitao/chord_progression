import { supabase } from '../../core/config/supabase'
import type { Song } from './types'

export const songsApi = {
  async list(): Promise<Song[]> {
    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as Song[]
  },

  async create(payload: { title: string; default_key_id: number | null }): Promise<Song> {
    const { data, error } = await supabase.from('songs').insert(payload).select('*').single()

    if (error) throw error
    return data as Song
  },
}
