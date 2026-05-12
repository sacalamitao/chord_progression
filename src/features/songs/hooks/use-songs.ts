import { useCallback, useEffect, useState } from 'react'
import { songsApi } from '../api'
import type { Song } from '../types'

export type CreateSongPayload = {
  title: string
  defaultKeyId: number | null
  numbering?: string
}

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

  const createSong = useCallback(async (payload: CreateSongPayload) => {
    const trimmed = payload.title.trim()
    if (!trimmed) throw new Error('Song title is required')

    const numbering = payload.numbering?.trim() ?? ''

    const created = await songsApi.create({
      title: trimmed,
      default_key_id: payload.defaultKeyId,
      progressions: numbering ? { main: numbering } : {},
    })
    setSongs((prev) => [created, ...prev])
    return created
  }, [])

  const updateSongDefaultKey = useCallback(async (payload: { songId: number; defaultKeyId: number | null }) => {
    const updated = await songsApi.updateDefaultKey({
      songId: payload.songId,
      default_key_id: payload.defaultKeyId,
    })

    setSongs((prev) => prev.map((song) => (song.id === updated.id ? updated : song)))
    return updated
  }, [])

  const updateSongProgression = useCallback(async (payload: { songId: number; progression: string }) => {
    const updated = await songsApi.updateProgression({
      songId: payload.songId,
      progression: payload.progression,
    })

    setSongs((prev) => prev.map((song) => (song.id === updated.id ? updated : song)))
    return updated
  }, [])

  useEffect(() => {
    void loadSongs()
  }, [loadSongs])

  return { songs, loading, error, loadSongs, createSong, updateSongDefaultKey, updateSongProgression }
}
