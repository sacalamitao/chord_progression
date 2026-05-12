import { useCallback, useEffect, useState } from 'react'
import { eventsApi } from '../api'

export type EventSetlistSection = {
  label: string
  numeric: string
  progression: string
}

export type EventSetlistSong = {
  id: string
  songId: number
  title: string
  performanceKeyId: number
  performanceKey: string
  keyShortcut: string
  sections: EventSetlistSection[]
}

function translateNumericToChords(numeric: string, degreeChords: Record<string, string>) {
  const value = numeric ?? ''
  if (!value.trim()) return ''

  return value.replace(/\b([1-8])\b/g, (match, degree: string) => {
    return degreeChords[degree] ?? match
  })
}

function toSections(progressions: Record<string, string>, degreeChords: Record<string, string>) {
  return Object.entries(progressions).map(([label, numeric]) => ({
    label,
    numeric,
    progression: translateNumericToChords(numeric, degreeChords),
  }))
}

export function useEventSetlist(eventId: number | null) {
  const [songs, setSongs] = useState<EventSetlistSong[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSetlist = useCallback(async () => {
    if (!eventId) {
      setSongs([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const rows = await eventsApi.getSetlist(eventId)
      const mapped = rows
        .filter((row) => row.song && row.key)
        .map((row) => {
          const song = row.song!
          const key = row.key!

          return {
            id: String(row.id),
            songId: song.id,
            title: song.title,
            performanceKeyId: key.id,
            performanceKey: key.name,
            keyShortcut: key.name.split(' ')[0],
            sections: toSections(song.progressions ?? {}, key.degree_chords ?? {}),
          }
        })

      setSongs(mapped)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load event setlist'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  const removeFromSetlist = useCallback(async (eventSongId: number) => {
    await eventsApi.removeSongFromEvent({ eventSongId })
    setSongs((prev) => prev.filter((song) => song.id !== String(eventSongId)))
  }, [])

  const updateSetlistSongKey = useCallback(
    async (payload: { eventSongId: number; keyId: number; keyName: string; degreeChords: Record<string, string> }) => {
      await eventsApi.updateEventSongKey({ eventSongId: payload.eventSongId, keyId: payload.keyId })

      setSongs((prev) =>
        prev.map((song) => {
          if (song.id !== String(payload.eventSongId)) return song

          return {
            ...song,
            performanceKeyId: payload.keyId,
            performanceKey: payload.keyName,
            keyShortcut: payload.keyName.split(' ')[0],
            sections: song.sections.map((section) => ({
              ...section,
              progression: translateNumericToChords(section.numeric, payload.degreeChords),
            })),
          }
        })
      )
    },
    []
  )

  useEffect(() => {
    void loadSetlist()
  }, [loadSetlist])

  return { songs, loading, error, loadSetlist, removeFromSetlist, updateSetlistSongKey }
}
