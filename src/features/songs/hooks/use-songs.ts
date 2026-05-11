import { useCallback, useEffect, useState } from 'react'
import { songsApi } from '../api'
import type { Song } from '../types'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSongs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const rows = await songsApi.list()
      setSongs(rows)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load songs'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createSong = useCallback(async (title: string, defaultKeyId: number | null) => {
    const trimmed = title.trim()
    if (!trimmed) throw new Error('Song title is required')

    const created = await songsApi.create({ title: trimmed, default_key_id: defaultKeyId })
    setSongs((prev) => [created, ...prev])
    return created
  }, [])

  useEffect(() => {
    void loadSongs()
  }, [loadSongs])

  return { songs, loading, error, loadSongs, createSong }
}
