import type { EventRecord } from '../../core/types/database'

export type Event = EventRecord

export type CreateEventInput = {
  name: string
  scheduledOn?: string | null
  imageUrl?: string | null
}
