import { useCallback, useEffect, useState } from 'react'
import { eventsApi } from '../api'
import type { Event } from '../types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await eventsApi.list()
      setEvents(rows)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(
    async (name: string, scheduledOn?: string | null, imageUrl?: string | null) => {
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Event name is required')

      const created = await eventsApi.create({
        name: trimmed,
        scheduled_on: scheduledOn ?? null,
        image_url: imageUrl?.trim() ? imageUrl.trim() : null,
      })

      setEvents((prev) => [created, ...prev])
      return created
    },
    []
  )

  const updateEvent = useCallback(
    async (id: number, name: string, scheduledOn?: string | null, imageUrl?: string | null) => {
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Event name is required')

      const updated = await eventsApi.update(id, {
        name: trimmed,
        scheduled_on: scheduledOn ?? null,
        image_url: imageUrl?.trim() ? imageUrl.trim() : null,
      })

      setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)))
      return updated
    },
    []
  )

  const deleteEvent = useCallback(async (id: number) => {
    await eventsApi.delete(id)
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }, [])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  return { events, loading, error, loadEvents, createEvent, updateEvent, deleteEvent }
}
