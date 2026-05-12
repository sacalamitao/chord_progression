import { useCallback, useMemo, useState } from 'react'
import { eventsApi, type EventSongSelectionOption } from '../api'

type UseAddSongsToEventModalParams = {
  onSubmitSongs: (payload: { eventId: number; songIds: number[] }) => Promise<void>
  onClosed?: (eventId: number | null) => void
  onSubmitted?: (eventId: number) => void
}

export function useAddSongsToEventModal({ onSubmitSongs, onClosed, onSubmitted }: UseAddSongsToEventModalParams) {
  const [visible, setVisible] = useState(false)
  const [eventId, setEventId] = useState<number | null>(null)
  const [options, setOptions] = useState<EventSongSelectionOption[]>([])
  const [selectedSongIds, setSelectedSongIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedSet = useMemo(() => new Set(selectedSongIds), [selectedSongIds])

  const open = useCallback(async (targetEventId: number) => {
    setVisible(true)
    setEventId(targetEventId)
    setSelectedSongIds([])
    setLoading(true)
    setError(null)

    try {
      const rows = await eventsApi.listSongSelectionOptionsForEvent(targetEventId)
      setOptions(rows)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load songs'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const close = useCallback(() => {
    if (submitting) return
    const closingEventId = eventId
    setVisible(false)
    setEventId(null)
    setSelectedSongIds([])
    setError(null)
    onClosed?.(closingEventId)
  }, [eventId, onClosed, submitting])

  const toggleSong = useCallback((songId: number) => {
    setSelectedSongIds((prev) => (prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]))
  }, [])

  const submit = useCallback(async () => {
    if (!eventId || selectedSongIds.length === 0) return

    try {
      setSubmitting(true)
      await onSubmitSongs({ eventId, songIds: selectedSongIds })
      setVisible(false)
      onSubmitted?.(eventId)
      setEventId(null)
      setSelectedSongIds([])
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add songs to event'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }, [eventId, onSubmitSongs, onSubmitted, selectedSongIds])

  return {
    visible,
    options,
    selectedSet,
    selectedCount: selectedSongIds.length,
    loading,
    submitting,
    error,
    open,
    close,
    toggleSong,
    submit,
  }
}
