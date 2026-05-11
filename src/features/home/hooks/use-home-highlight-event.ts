import { useMemo } from 'react'
import type { Event } from '../../events/types'

export type HomeHighlightEvent = {
  id: number
  title: string
  scheduledOn: string | null
  imageUrl: string | null
  timingLabel: string
}

function toStartOfToday(): Date {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function toDate(input: string | null): Date | null {
  if (!input) return null
  const value = new Date(input)
  if (Number.isNaN(value.getTime())) return null
  value.setHours(0, 0, 0, 0)
  return value
}

function buildTimingLabel(eventDate: Date | null, today: Date): string {
  if (!eventDate) return 'Upcoming'

  const dayMs = 1000 * 60 * 60 * 24
  const diffDays = Math.round((eventDate.getTime() - today.getTime()) / dayMs)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'In 1 day'
  if (diffDays > 1) return `In ${diffDays} days`
  if (diffDays === -1) return '1 day ago'

  return `${Math.abs(diffDays)} days ago`
}

function pickHighlightEvent(events: Event[]): Event | null {
  if (events.length === 0) return null

  const today = toStartOfToday()
  const candidates = events
    .map((event) => ({ event, date: toDate(event.scheduled_on) }))
    .filter((entry) => entry.date !== null) as { event: Event; date: Date }[]

  if (candidates.length === 0) return events[0] ?? null

  const upcoming = candidates.filter(({ date }) => date.getTime() >= today.getTime())

  if (upcoming.length > 0) {
    upcoming.sort((a, b) => a.date.getTime() - b.date.getTime())
    return upcoming[0].event
  }

  candidates.sort((a, b) => b.date.getTime() - a.date.getTime())
  return candidates[0].event
}

export function useHomeHighlightEvent(events: Event[]): HomeHighlightEvent | null {
  return useMemo(() => {
    const picked = pickHighlightEvent(events)
    if (!picked) return null

    const today = toStartOfToday()
    const eventDate = toDate(picked.scheduled_on)

    return {
      id: picked.id,
      title: picked.name,
      scheduledOn: picked.scheduled_on,
      imageUrl: picked.image_url,
      timingLabel: buildTimingLabel(eventDate, today),
    }
  }, [events])
}
