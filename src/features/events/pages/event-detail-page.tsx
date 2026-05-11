import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import { EventSetlistItem, type EventSetlistItemViewModel } from '../components/event-setlist-item'
import { useEventSetlist } from '../hooks/use-event-setlist'

type EventDetailPageProps = {
  eventId: number
  eventName: string
  onBack: () => void
}

export function EventDetailPage({ eventId, eventName, onBack }: EventDetailPageProps) {
  const { songs, loading, error } = useEventSetlist(eventId)
  const setlistItems: EventSetlistItemViewModel[] = songs

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text accessibilityRole="button" onPress={onBack} style={styles.backButton}>←</Text>
        <Text style={styles.topBarTitle}>Event Setlist View</Text>
        <Text style={styles.shareButton}>↗</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eventTitle}>{eventName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>October 24, 2023</Text>
            <Text style={styles.metaText}>10:30 AM</Text>
            <Text style={styles.metaText}>3 Songs</Text>
            <Text style={styles.metaStatus}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Setlist Order</Text>
          <Text style={styles.sectionAction}>Reorder</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.setlistWrap}>
          {setlistItems.map((item) => (
            <EventSetlistItem key={item.id} item={item} />
          ))}
        </View>

        {!loading && !error && setlistItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No songs in this event yet.</Text>
          </View>
        ) : null}

        <View style={styles.addSongButton}>
          <Text style={styles.addSongText}>＋ Add Song from Library</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 52, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  backButton: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', width: 24 },
  topBarTitle: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  shareButton: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', width: 24, textAlign: 'right' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },
  heroCard: { borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  eventTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '900' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 8 },
  metaText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  metaStatus: { color: colors.accent, fontSize: 11, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 10 },
  sectionTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionAction: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  loadingWrap: { paddingVertical: 14 },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  setlistWrap: { gap: 10 },
  emptyWrap: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  emptyText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  addSongButton: { marginTop: 14, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  addSongText: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
})
