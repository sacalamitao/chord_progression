import { useState } from 'react'
import { ActivityIndicator, Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'
import { EventSetlistItem, type EventSetlistItemViewModel } from '../components/event-setlist-item'
import { useEventSetlist } from '../hooks/use-event-setlist'
import { ConfirmationModal } from '../../../shared/components/confirmation-modal'
import { useKeys } from '../../keys/hooks/use-keys'

type EventDetailPageProps = {
  eventId: number
  eventName: string
  eventDate: string | null
  imageUrl: string | null
  onBack: () => void
}

const fallbackImage = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80'

function formatEventDate(value: string | null) {
  if (!value) return 'Date TBA'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Date TBA'
  return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function EventDetailPage({ eventId, eventName, eventDate, imageUrl, onBack }: EventDetailPageProps) {
  const { songs, loading, error, removeFromSetlist, updateSetlistSongKey } = useEventSetlist(eventId)
  const { keys } = useKeys()
  const [pendingRemoveSongId, setPendingRemoveSongId] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [updatingKeyEventSongId, setUpdatingKeyEventSongId] = useState<string | null>(null)
  const setlistItems: EventSetlistItemViewModel[] = songs
  const songsCountLabel = `${setlistItems.length} song${setlistItems.length === 1 ? '' : 's'}`

  const pendingSong = pendingRemoveSongId ? setlistItems.find((item) => item.id === pendingRemoveSongId) ?? null : null

  const confirmRemoveSong = async () => {
    if (!pendingRemoveSongId) return

    const eventSongId = Number(pendingRemoveSongId)
    if (Number.isNaN(eventSongId)) {
      setPendingRemoveSongId(null)
      return
    }

    try {
      setRemoving(true)
      await removeFromSetlist(eventSongId)
      setPendingRemoveSongId(null)
    } catch (err) {
      Alert.alert('Unable to remove song', err instanceof Error ? err.message : 'Please try again.')
    } finally {
      setRemoving(false)
    }
  }

  const onChangePerformanceKey = async (payload: { eventSongId: string; keyId: number }) => {
    const eventSongId = Number(payload.eventSongId)
    if (Number.isNaN(eventSongId)) return

    const selectedKey = keys.find((key) => key.id === payload.keyId)
    if (!selectedKey) return

    try {
      setUpdatingKeyEventSongId(payload.eventSongId)
      await updateSetlistSongKey({
        eventSongId,
        keyId: selectedKey.id,
        keyName: selectedKey.name,
        degreeChords: selectedKey.degree_chords ?? {},
      })
    } catch (err) {
      Alert.alert('Unable to update key', err instanceof Error ? err.message : 'Please try again.')
    } finally {
      setUpdatingKeyEventSongId(null)
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#EEF2FF" />
        </Pressable>
        <Text style={styles.topBarTitle}>Event Show</Text>
        <View style={styles.shareButton} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: imageUrl ?? fallbackImage }} style={styles.heroCard} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>EVENT OVERVIEW</Text>
            </View>
            <Text style={styles.eventTitle}>{eventName}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#F0F3FF" />
                <Text style={styles.metaText}>{formatEventDate(eventDate)}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="music-note-outline" size={14} color="#F0F3FF" />
                <Text style={styles.metaText}>{songsCountLabel}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Setlist Songs</Text>
          <View style={styles.sectionPill}><Text style={styles.sectionPillText}>{songsCountLabel}</Text></View>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.setlistWrap}>
          {setlistItems.map((item) => (
            <EventSetlistItem
              key={item.id}
              item={item}
              keyOptions={keys.map((key) => ({ id: key.id, name: key.name }))}
              keyUpdating={updatingKeyEventSongId === item.id}
              onChangePerformanceKey={(payload) => {
                void onChangePerformanceKey(payload)
              }}
              onRemove={setPendingRemoveSongId}
            />
          ))}
        </View>

        {!loading && !error && setlistItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No songs yet</Text>
            <Text style={styles.emptyText}>Add songs from the event snapshot to build this setlist.</Text>
          </View>
        ) : null}
      </ScrollView>

      <ConfirmationModal
        visible={Boolean(pendingSong)}
        title="Remove song from event?"
        description={pendingSong ? `This will remove "${pendingSong.title}" from this event setlist.` : ''}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        loading={removing}
        onConfirm={() => {
          void confirmRemoveSong()
        }}
        onCancel={() => {
          if (removing) return
          setPendingRemoveSongId(null)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 54, borderBottomWidth: 1, borderBottomColor: '#2A2F48', backgroundColor: '#151A2D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  backButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E2440' },
  topBarTitle: { color: '#D3DAF4', fontFamily: 'Inter_700Bold', fontSize: 13 },
  shareButton: { width: 30, height: 30 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 28 },
  heroCard: { borderRadius: 18, overflow: 'hidden', minHeight: 172 },
  heroImage: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'flex-end' },
  heroBadge: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: 'rgba(143,107,255,0.25)', borderWidth: 1, borderColor: 'rgba(143,107,255,0.55)', paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  heroBadgeText: { color: '#E8DEFF', fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 0.6 },
  eventTitle: { color: '#F7F9FF', fontFamily: 'Inter_800ExtraBold', fontSize: 26 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#F0F3FF', fontFamily: 'Inter_700Bold', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 10 },
  sectionTitle: { color: '#AAB1CE', fontFamily: 'Inter_700Bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionPill: { borderRadius: 999, borderWidth: 1, borderColor: '#313A5A', backgroundColor: '#1B2240', paddingHorizontal: 8, paddingVertical: 3 },
  sectionPillText: { color: '#C3CCED', fontFamily: 'Inter_700Bold', fontSize: 10 },
  loadingWrap: { paddingVertical: 14 },
  errorText: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 10 },
  setlistWrap: { gap: 10 },
  emptyWrap: { borderRadius: 14, borderWidth: 1, borderColor: '#2D3450', backgroundColor: '#1A2036', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 14 },
  emptyTitle: { color: '#EEF2FF', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 4 },
  emptyText: { color: '#AAB1CE', fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
})
