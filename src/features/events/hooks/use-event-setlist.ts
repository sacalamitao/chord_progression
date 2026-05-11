import { useCallback, useEffect, useState } from 'react'
import { eventsApi } from '../api'

export type EventSetlistSection = {
  label: string
  numeric: string
  progression: string
}

export type EventSetlistSong = {
  id: string
  title: string
  performanceKey: string
  keyShortcut: string
  sections: EventSetlistSection[]
}

function parseNumericProgression(raw: string) {
  return raw
    .split('')
    .filter((char) => /[1-8]/.test(char))
}

function translateNumericToChords(numeric: string, degreeChords: Record<string, string>) {
  const tokens = parseNumericProgression(numeric)
  if (tokens.length === 0) return numeric.trim()

  return tokens
    .map((token) => degreeChords[token] ?? token)
    .join(' ')
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
            title: song.title,
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

  useEffect(() => {
    void loadSetlist()
  }, [loadSetlist])

  return { songs, loading, error, loadSetlist }
}

