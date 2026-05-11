export type EventRecord = {
  id: number
  name: string
  scheduled_on: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type KeyRecord = {
  id: number
  name: string
  degree_chords: Record<string, string>
  created_at: string
  updated_at: string
}

export type SongRecord = {
  id: number
  title: string
  default_key_id: number | null
  progressions: Record<string, string>
  created_at: string
  updated_at: string
}

export type EventSongRecord = {
  id: number
  event_id: number
  song_id: number
  key_id: number
  position: number
  created_at: string
  updated_at: string
}
