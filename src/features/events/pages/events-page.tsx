import { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import { CreateEventModal } from '../components/create-event-modal'
import { EventCard, type EventCardViewModel } from '../components/event-card'
import { EventsFilterTabs, type EventsFilter } from '../components/events-filter-tabs'
import { EventsHeader } from '../components/events-header'
import { EventsSearchBar } from '../components/events-search-bar'
import { EventDetailPage } from './event-detail-page'
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

function formatDateLabel(value: string | null, index: number) {
  if (!value) return index === 0 ? 'Today' : 'Upcoming'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Upcoming'

  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
}

function toEventCardViewModel(item: Event, index: number): EventCardViewModel {
  const accentColors = ['#FF8A5B', '#7C83FF', '#38BDF8', '#34D399']

  return {
    id: String(item.id),
    title: item.name,
    subtitle: 'Tap to review event details and schedule.',
    dateLabel: formatDateLabel(item.scheduled_on, index),
    timeLabel: '9:00 AM',
    accentColor: accentColors[index % accentColors.length],
  }
}

export function EventsPage() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<EventsFilter>('all')
  const [activeActionsEventId, setActiveActionsEventId] = useState<string | null>(null)
  const [openedEventId, setOpenedEventId] = useState<string | null>(null)
  const createEventModal = useCreateEventModal({
    createEvent,
    updateEvent,
    onError: (err) => {
      console.error('Create event failed:', err)
      Alert.alert('Unable to create event', 'Please try again.')
    },
  })

  const eventCards = useMemo(
    () => {
      if (events.length === 0) return fallbackEvents

      const filteredEvents = events.filter((event) => {
        if (selectedFilter === 'today') return isToday(event.scheduled_on)
        if (selectedFilter === 'upcoming') return isUpcoming(event.scheduled_on)
        return true
      })

      return filteredEvents.map((event, index) => ({ ...toEventCardViewModel(event, index), manageable: true }))
    },
    [events, selectedFilter]
  )

  const eventsById = useMemo(() => new Map(events.map((event) => [String(event.id), event])), [events])

  const filteredEventCards = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) return eventCards

    return eventCards.filter((item) => {
      const searchableText = `${item.title} ${item.subtitle} ${item.dateLabel} ${item.timeLabel}`.toLowerCase()
      return searchableText.includes(normalizedSearchTerm)
    })
  }, [eventCards, searchTerm])

  const onEditEvent = (eventId: string) => {
    const event = eventsById.get(eventId)
    if (!event) return

    setActiveActionsEventId(null)
    createEventModal.openEdit(event)
  }

  const onDeleteEvent = (eventId: string) => {
    const event = eventsById.get(eventId)
    if (!event) return

    setActiveActionsEventId(null)
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

  const capitalized = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1)

  const openedEvent = openedEventId ? eventsById.get(openedEventId) ?? null : null

  if (openedEvent) {
    return <EventDetailPage eventId={openedEvent.id} eventName={openedEvent.name} onBack={() => setOpenedEventId(null)} />
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EventsHeader onCreatePress={createEventModal.open} creating={createEventModal.submitting} />
        <EventsSearchBar value={searchTerm} onChangeText={setSearchTerm} onClear={() => setSearchTerm('')} />
        <EventsFilterTabs selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{capitalized(selectedFilter)}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#111111" />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.eventsList}>
          {filteredEventCards.map((item) => (
            <EventCard
              key={item.id}
              event={item}
              onPress={() => setOpenedEventId(item.id)}
              actionsVisible={activeActionsEventId === item.id}
              onToggleActions={() => setActiveActionsEventId((currentId) => (currentId === item.id ? null : item.id))}
              onCloseActions={() => setActiveActionsEventId(null)}
              onEdit={() => onEditEvent(item.id)}
              onDelete={() => onDeleteEvent(item.id)}
            />
          ))}
        </View>

        {!loading && filteredEventCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No events found</Text>
            <Text style={styles.emptyStateText}>Try searching by event name, date, or time.</Text>
          </View>
        ) : null}
      </ScrollView>

      <CreateEventModal
        visible={createEventModal.visible}
        mode={createEventModal.mode}
        values={createEventModal.values}
        datePickerVisible={createEventModal.datePickerVisible}
        submitting={createEventModal.submitting}
        validationError={createEventModal.validationError}
        onChangeField={createEventModal.updateField}
        onOpenDatePicker={createEventModal.openDatePicker}
        onCloseDatePicker={createEventModal.closeDatePicker}
        onSubmit={createEventModal.submit}
        onClose={createEventModal.close}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 116 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 15 },
  sectionTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '900', letterSpacing: -0.6, lineHeight: 29 },
  sectionAction: { color: colors.textSecondary, fontSize: 13, fontWeight: '800', lineHeight: 16 },
  loadingWrap: { paddingVertical: 14 },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  eventsList: { gap: 18 },
  emptyState: { alignItems: 'center', borderRadius: 28, backgroundColor: colors.surface, marginTop: 14, paddingHorizontal: 20, paddingVertical: 28, borderWidth: 1, borderColor: colors.border },
  emptyStateTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900', marginBottom: 6 },
  emptyStateText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', textAlign: 'center' },
})
