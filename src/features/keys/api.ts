import { supabase } from '../../core/config/supabase'
import type { Key } from './types'

type CreateKeyPayload = {
  name: string
  degree_chords: Record<string, string>
}

export const keysApi = {
  async list(): Promise<Key[]> {
    const { data, error } = await supabase.from('keys').select('*').order('name', { ascending: true })

    if (error) throw error
    return (data ?? []) as Key[]
  },

  async create(payload: CreateKeyPayload): Promise<Key> {
    const { data, error } = await supabase.from('keys').insert(payload).select('*').single()

    if (error) throw error
    return data as Key
  },
}
