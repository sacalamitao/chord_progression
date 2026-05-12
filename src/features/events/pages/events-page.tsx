import { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'
import { useKeys } from '../../keys/hooks/use-keys'
import { AddSongsToEventModal } from '../components/add-songs-to-event-modal'
import { CreateEventModal } from '../components/create-event-modal'
import { EventCard, type EventCardViewModel } from '../components/event-card'
import { EventDetailPage } from './event-detail-page'
import { EventSnapshotModal } from '../components/event-snapshot-modal'
import { EventsFilterTabs, type EventsFilter } from '../components/events-filter-tabs'
import { EventsHeader } from '../components/events-header'
import { EventsSearchBar } from '../components/events-search-bar'
import { useAddSongsToEventModal } from '../hooks/use-add-songs-to-event-modal'
import { useCreateEventModal } from '../hooks/use-create-event-modal'
import { useEvents } from '../hooks/use-events'
import type { Event } from '../types'

const fallbackEvents: EventCardViewModel[] = [
]

function isToday(value: string | null) {
  if (!value) return false

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const today = new Date()

  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()
}

function isUpcoming(value: string | null) {
  if (!value) return true

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return true

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date.getTime() >= today.getTime()
}

function toStartOfDay(value: Date) {
  const normalized = new Date(value)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

function parseEventDate(value: string | null) {
  if (!value) return null

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  return toStartOfDay(parsed)
}

function getEventBucket(value: string | null, today: Date): 'upcoming' | 'past' | 'undated' {
  const date = parseEventDate(value)
  if (!date) return 'undated'
  if (date < today) return 'past'
  return 'upcoming'
}

function formatDateLabel(value: string | null, index: number) {
  if (!value) return index === 0 ? 'Today' : 'Upcoming'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Upcoming'

  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
}

function toEventCardViewModel(item: Event, index: number, songsCount: number): EventCardViewModel {
  return {
    id: String(item.id),
    title: item.name,
    subtitle: 'Main Sanctuary',
    venue: 'Main Sanctuary',
    dateLabel: formatDateLabel(item.scheduled_on, index),
    timeLabel: '09:00 AM - 11:30 AM',
    songsCount,
    accentColor: '#2A1F57',
  }
}

export function EventsPage() {
  const { events, eventSongCounts, loading, error, createEvent, updateEvent, deleteEvent, addSongsToEvent } = useEvents()
  const { keys } = useKeys()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<EventsFilter>('all')
  const [snapshotEventId, setSnapshotEventId] = useState<string | null>(null)
  const [returnToSnapshotEventId, setReturnToSnapshotEventId] = useState<number | null>(null)
  const [activeEventDetailId, setActiveEventDetailId] = useState<number | null>(null)
  const createEventModal = useCreateEventModal({
    createEvent,
    updateEvent,
    onCreated: () => {
      setReturnToSnapshotEventId(null)
    },
    onUpdated: () => {
      setReturnToSnapshotEventId(null)
    },
    onError: (err) => {
      console.error('Create event failed:', err)
      Alert.alert('Unable to create event', 'Please try again.')
    },
  })

  const addSongsModal = useAddSongsToEventModal({
    onSubmitSongs: async ({ eventId, songIds }) => {
      if (keys.length === 0) {
        throw new Error('Create at least one key first before adding songs to an event.')
      }

      const optionById = new Map(addSongsModal.options.map((item) => [item.id, item]))
      const fallbackKeyId = keys[0].id

      const items = songIds.map((songId) => {
        const option = optionById.get(songId)
        return {
          songId,
          keyId: option?.default_key_id ?? fallbackKeyId,
        }
      })

      await addSongsToEvent({ eventId, items })
    },
    onClosed: (eventId) => {
      if (!eventId) return
      setSnapshotEventId(String(eventId))
      setReturnToSnapshotEventId(null)
    },
    onSubmitted: () => {
      setReturnToSnapshotEventId(null)
    },
  })

  const eventCards = useMemo(() => {
    if (events.length === 0) return fallbackEvents
    return events.map((event, index) => ({ ...toEventCardViewModel(event, index, eventSongCounts[event.id] ?? 0), manageable: true }))
  }, [eventSongCounts, events])

  const eventsById = useMemo(() => new Map(events.map((event) => [String(event.id), event])), [events])

  const searchedEventCards = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) return eventCards

    return eventCards.filter((item) => {
      return item.title.toLowerCase().includes(normalizedSearchTerm)
    })
  }, [eventCards, searchTerm])

  const filterCounts = useMemo(() => {
    const today = toStartOfDay(new Date())
    return searchedEventCards.reduce(
      (acc, item) => {
        const source = eventsById.get(item.id)
        const bucket = getEventBucket(source?.scheduled_on ?? null, today)

        acc.all += 1
        if (bucket === 'upcoming' || bucket === 'undated') acc.upcoming += 1
        if (bucket === 'past') acc.past += 1

        return acc
      },
      { all: 0, upcoming: 0, past: 0 }
    )
  }, [eventsById, searchedEventCards])

  const filteredEventCards = useMemo(() => {
    const today = toStartOfDay(new Date())

    if (selectedFilter === 'all') return searchedEventCards

    if (selectedFilter === 'today') {
      return searchedEventCards.filter((item) => {
        const source = eventsById.get(item.id)
        const bucket = getEventBucket(source?.scheduled_on ?? null, today)
        return bucket === 'upcoming' || bucket === 'undated'
      })
    }

    return searchedEventCards.filter((item) => {
      const source = eventsById.get(item.id)
      return getEventBucket(source?.scheduled_on ?? null, today) === 'past'
    })
  }, [eventsById, searchedEventCards, selectedFilter])

  const onEditEvent = (eventId: string) => {
    const event = eventsById.get(eventId)
    if (!event) return

    setReturnToSnapshotEventId(event.id)
    setSnapshotEventId(null)
    createEventModal.openEdit(event)
  }

  const onDeleteEvent = (eventId: string) => {
    const event = eventsById.get(eventId)
    if (!event) return

    setSnapshotEventId(null)
    setReturnToSnapshotEventId(null)
    Alert.alert('Delete event?', `This will permanently delete "${event.name}".`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteEvent(event.id).catch((err) => {
            console.error('Delete event failed:', err)
            Alert.alert('Unable to delete event', 'Please try again.')
          })
        },
      },
    ])
  }

  const snapshotEvent = snapshotEventId ? eventsById.get(snapshotEventId) ?? null : null
  const activeEventDetail = activeEventDetailId ? events.find((event) => event.id === activeEventDetailId) ?? null : null

  const handleCloseCreateEventModal = () => {
    const editingEventId = returnToSnapshotEventId
    const shouldReturnToSnapshot = createEventModal.mode === 'edit' && editingEventId !== null

    createEventModal.close()

    if (shouldReturnToSnapshot) {
      setSnapshotEventId(String(editingEventId))
      setReturnToSnapshotEventId(null)
    }
  }

  const groupedCards = useMemo(() => {
    const today = toStartOfDay(new Date())
    const next7End = new Date(today)
    next7End.setDate(next7End.getDate() + 7)

    const next: EventCardViewModel[] = []
    const later: EventCardViewModel[] = []
    const done: EventCardViewModel[] = []

    filteredEventCards.forEach((item) => {
      const source = eventsById.get(item.id)
      const date = parseEventDate(source?.scheduled_on ?? null)

      if (!date) {
        later.push(item)
        return
      }

      if (date < today) {
        done.push(item)
        return
      }

      if (date <= next7End) {
        next.push(item)
        return
      }

      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        later.push(item)
        return
      }

      later.push(item)
    })

    return [
      { key: 'next', title: 'NEXT 7 DAYS', items: next },
      { key: 'later', title: 'LATER THIS MONTH', items: later },
      { key: 'done', title: 'RECENTLY COMPLETED', items: done },
    ]
  }, [eventsById, filteredEventCards])

  if (activeEventDetail) {
    return (
      <EventDetailPage
        eventId={activeEventDetail.id}
        eventName={activeEventDetail.name}
        eventDate={activeEventDetail.scheduled_on}
        imageUrl={activeEventDetail.image_url}
        onBack={() => setActiveEventDetailId(null)}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EventsHeader />
        <EventsSearchBar value={searchTerm} onChangeText={setSearchTerm} onClear={() => setSearchTerm('')} />
        <EventsFilterTabs selectedFilter={selectedFilter} counts={filterCounts} onFilterChange={setSelectedFilter} />

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#111111" />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {groupedCards.map((group) => (
          <View key={group.key} style={styles.groupBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{group.title}</Text>
              <View style={styles.countPill}><Text style={styles.countPillText}>{group.items.length} Events</Text></View>
            </View>
            <View style={styles.eventsList}>
              {group.items.map((item) => (
                <EventCard
                  key={item.id}
                  event={item}
                  onPress={() => setSnapshotEventId(item.id)}
                />
              ))}
            </View>
          </View>
        ))}

        {!loading && filteredEventCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No events found</Text>
            <Text style={styles.emptyStateText}>Try searching by event name.</Text>
          </View>
        ) : null}
      </ScrollView>

      <CreateEventModal
        visible={createEventModal.visible}
        mode={createEventModal.mode}
        form={createEventModal.form}
        datePickerVisible={createEventModal.datePickerVisible}
        submitting={createEventModal.submitting}
        onOpenDatePicker={createEventModal.openDatePicker}
        onCloseDatePicker={createEventModal.closeDatePicker}
        onSubmit={createEventModal.submit}
        onClose={handleCloseCreateEventModal}
      />

      <EventSnapshotModal
        visible={Boolean(snapshotEvent)}
        title={snapshotEvent?.name ?? ''}
        venue="Main Sanctuary"
        dateLabel={snapshotEvent?.scheduled_on ? new Date(snapshotEvent.scheduled_on).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBA'}
        timeLabel="09:00 AM - 11:30 AM"
        imageUrl={snapshotEvent?.image_url ?? null}
        onClose={() => setSnapshotEventId(null)}
        onEnterEvent={() => {
          if (!snapshotEvent) return
          setSnapshotEventId(null)
          setReturnToSnapshotEventId(null)
          setActiveEventDetailId(snapshotEvent.id)
        }}
        onAddSong={() => {
          const eventId = snapshotEvent?.id ?? null
          if (!eventId) return

          setReturnToSnapshotEventId(eventId)
          setSnapshotEventId(null)
          void addSongsModal.open(eventId)
        }}
        onEdit={() => {
          if (!snapshotEventId) return
          onEditEvent(snapshotEventId)
        }}
        onDelete={() => {
          if (!snapshotEventId) return
          onDeleteEvent(snapshotEventId)
        }}
      />

      <AddSongsToEventModal
        visible={addSongsModal.visible}
        options={addSongsModal.options}
        selectedSet={addSongsModal.selectedSet}
        selectedCount={addSongsModal.selectedCount}
        loading={addSongsModal.loading}
        submitting={addSongsModal.submitting}
        error={addSongsModal.error}
        onToggleSong={addSongsModal.toggleSong}
        onSubmit={() => {
          void addSongsModal.submit().catch((err) => {
            console.error('Add songs to event failed:', err)
            Alert.alert('Unable to add songs', err instanceof Error ? err.message : 'Please try again.')
          })
        }}
        onClose={addSongsModal.close}
      />

      <Pressable accessibilityRole="button" accessibilityLabel="Create event" style={styles.fab} onPress={createEventModal.open}>
        <MaterialCommunityIcons name="plus" size={28} color="#1B1434" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 126 },
  groupBlock: { marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#A8AEC7', fontFamily: 'Inter_700Bold', fontSize: 12, lineHeight: 14 },
  countPill: { borderRadius: 999, backgroundColor: '#24283C', borderWidth: 1, borderColor: '#2E3450', paddingHorizontal: 8, paddingVertical: 3 },
  countPillText: { color: '#8991B3', fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  loadingWrap: { paddingVertical: 14 },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  eventsList: { gap: 10 },
  emptyState: { alignItems: 'center', borderRadius: 28, backgroundColor: colors.surface, marginTop: 14, paddingHorizontal: 20, paddingVertical: 28, borderWidth: 1, borderColor: colors.border },
  emptyStateTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900', marginBottom: 6 },
  emptyStateText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  fab: { position: 'absolute', right: 22, bottom: 96, width: 56, height: 56, borderRadius: 28, backgroundColor: '#8F6BFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1A1633', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10, zIndex: 20 },
})
