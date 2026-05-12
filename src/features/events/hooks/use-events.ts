import { useCallback, useEffect, useState } from 'react'
import { eventsApi } from '../api'
import type { Event } from '../types'

export type CreateEventPayload = {
  name: string
  scheduledOn?: string | null
  imageUrl?: string | null
}

export type UpdateEventPayload = CreateEventPayload

export type AddSongsToEventPayload = {
  eventId: number
  items: Array<{
    songId: number
    keyId: number
  }>
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventSongCounts, setEventSongCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rows, songCounts] = await Promise.all([eventsApi.list(), eventsApi.listSongCounts()])
      setEvents(rows)
      setEventSongCounts(songCounts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(
    async (payload: CreateEventPayload) => {
      const trimmed = payload.name.trim()
      if (!trimmed) throw new Error('Event name is required')

      const created = await eventsApi.create({
        name: trimmed,
        scheduled_on: payload.scheduledOn ?? null,
        image_url: payload.imageUrl?.trim() ? payload.imageUrl.trim() : null,
      })

      setEvents((prev) => [created, ...prev])
      setEventSongCounts((prev) => ({ ...prev, [created.id]: prev[created.id] ?? 0 }))
      return created
    },
    []
  )

  const updateEvent = useCallback(
    async (id: number, payload: UpdateEventPayload) => {
      const trimmed = payload.name.trim()
      if (!trimmed) throw new Error('Event name is required')

      const updated = await eventsApi.update(id, {
        name: trimmed,
        scheduled_on: payload.scheduledOn ?? null,
        image_url: payload.imageUrl?.trim() ? payload.imageUrl.trim() : null,
      })

      setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)))
      return updated
    },
    []
  )

  const deleteEvent = useCallback(async (id: number) => {
    await eventsApi.delete(id)
    setEvents((prev) => prev.filter((event) => event.id !== id))
    setEventSongCounts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const addSongsToEvent = useCallback(async (payload: AddSongsToEventPayload) => {
    if (payload.items.length === 0) return

    await eventsApi.addSongsToEvent({
      eventId: payload.eventId,
      items: payload.items,
    })

    setEventSongCounts((prev) => ({
      ...prev,
      [payload.eventId]: (prev[payload.eventId] ?? 0) + payload.items.length,
    }))
  }, [])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  return { events, eventSongCounts, loading, error, loadEvents, createEvent, updateEvent, deleteEvent, addSongsToEvent }
}
