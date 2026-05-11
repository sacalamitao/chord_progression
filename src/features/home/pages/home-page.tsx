import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
import { useMemo } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'
import { useEvents } from '../../events/hooks/use-events'
import { useHomeHighlightEvent } from '../hooks/use-home-highlight-event'
import { useCreateEventModal } from '../../events/hooks/use-create-event-modal'
import { CreateEventModal } from '../../events/components/create-event-modal'
import { useSongs } from '../../songs/hooks/use-songs'
import { useCreateSongModal } from '../../songs/hooks/use-create-song-modal'
import { CreateSongModal } from '../../songs/components/create-song-modal'
import { useKeys } from '../../keys/hooks/use-keys'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEventSetlist } from '../../events/hooks/use-event-setlist'

function formatEventDate(value: string | null): string {
  if (!value) return 'Date TBA'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date TBA'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function HomePage() {
  const { events, createEvent, updateEvent } = useEvents()
  const { songs, createSong } = useSongs()
  const { keys } = useKeys()
  const highlightEvent = useHomeHighlightEvent(events)
  const { songs: highlightEventSongs } = useEventSetlist(highlightEvent?.id ?? null)
  const topSongs = songs.slice(0, 10)
  const topEvents = events.slice(0, 10)

  const keyById = useMemo(() => new Map(keys.map((key) => [key.id, key.name])), [keys])

  const recentActivity = useMemo(() => {
    const songItems = songs.map((song) => ({
      id: `song-${song.id}`,
      title: song.title,
      subtitle: `Song${song.default_key_id ? ` • Key of ${keyById.get(song.default_key_id) ?? 'Unknown'}` : ''}`,
      createdAt: song.created_at,
      imageUrl: null as string | null,
      icon: 'music-note-outline' as const,
    }))

    const eventItems = events.map((event) => ({
      id: `event-${event.id}`,
      title: event.name,
      subtitle: 'Event',
      createdAt: event.created_at,
      imageUrl: event.image_url,
      icon: 'calendar-blank-outline' as const,
    }))

    return [...songItems, ...eventItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [events, keyById, songs])

  const formatRelativeTime = (value: string) => {
    const now = Date.now()
    const time = new Date(value).getTime()
    if (Number.isNaN(time)) return '—'

    const diffHours = Math.max(1, Math.floor((now - time) / (1000 * 60 * 60)))
    if (diffHours < 24) return `${diffHours}H AGO`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}D AGO`
  }
  const createEventModal = useCreateEventModal({
    createEvent,
    updateEvent,
    onError: (err) => {
      console.error('Create event failed:', err)
      Alert.alert('Unable to create event', 'Please try again.')
    },
  })
  const createSongModal = useCreateSongModal({
    createSong,
    onError: (err) => {
      console.error('Create song failed:', err)
      Alert.alert('Unable to create song', 'Please try again.')
    },
  })

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Worship Progressions</Text>
        <MaterialCommunityIcons name="account-outline" size={22} color={colors.textPrimary} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Welcome back,</Text>
      <Text style={styles.description}>Your setlist is ready for Sunday.</Text>

      <ImageBackground
        source={{
          uri:
            highlightEvent?.imageUrl ??
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
        }}
        resizeMode="cover"
        style={styles.heroCard}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          <View style={styles.heroTopRow}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>UPCOMING EVENT</Text>
            </View>
            <View style={styles.badgeDark}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textPrimary} />
              <Text style={styles.badgeDarkText}>{highlightEvent?.timingLabel ?? 'Upcoming'}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{highlightEvent?.title ?? 'Sunday Morning\nCelebration'}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.metaText}>{formatEventDate(highlightEvent?.scheduledOn ?? null)}, 09:00 AM</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.metaText}>Main Sanctuary</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="music-note-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.metaText}>{highlightEventSongs.length} song{highlightEventSongs.length === 1 ? '' : 's'}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.quickActionsHeader}>
        <MaterialCommunityIcons name="lightning-bolt-outline" size={18} color={colors.textPrimary} />
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionsGrid}>
        <Pressable style={styles.quickActionCard} onPress={createSongModal.open}>
          <View style={styles.quickActionIconWrap}>
            <MaterialCommunityIcons name="music-note-outline" size={20} color="#8F6BFF" />
          </View>
          <Text style={styles.quickActionTitle}>Add Song</Text>
          <Text style={styles.quickActionSubtitle}>Numeric progressions</Text>
        </Pressable>

        <Pressable style={styles.quickActionCard} onPress={createEventModal.open}>
          <View style={styles.quickActionIconWrap}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#8F6BFF" />
          </View>
          <Text style={styles.quickActionTitle}>New Event</Text>
          <Text style={styles.quickActionSubtitle}>Schedule service</Text>
        </Pressable>
      </View>

      <View style={styles.carouselSection}>
        <View style={styles.carouselHeader}>
          <Text style={styles.carouselTitle}>Top Songs</Text>
          <Text style={styles.carouselCount}>{topSongs.length}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselTrack}>
          {topSongs.map((song) => (
            <View key={song.id} style={styles.carouselCard}>
              <Text style={styles.carouselCardTitle} numberOfLines={2}>{song.title}</Text>
              <Text style={styles.carouselCardSubtitle}>Song</Text>
            </View>
          ))}
          {topSongs.length === 0 ? (
            <View style={styles.carouselCardEmpty}>
              <Text style={styles.carouselEmptyText}>No songs yet</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.carouselSection}>
        <View style={styles.carouselHeader}>
          <Text style={styles.carouselTitle}>Top Events</Text>
          <Text style={styles.carouselCount}>{topEvents.length}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselTrack}>
          {topEvents.map((event) => (
            <ImageBackground
              key={event.id}
              source={{
                uri:
                  event.image_url ??
                  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
              }}
              resizeMode="cover"
              style={styles.carouselCard}
              imageStyle={styles.carouselCardImage}
            >
              <View style={styles.carouselCardOverlay}>
                <Text style={styles.carouselCardTitle} numberOfLines={2}>{event.name}</Text>
                <Text style={styles.carouselCardSubtitle}>{formatEventDate(event.scheduled_on)}</Text>
              </View>
            </ImageBackground>
          ))}
          {topEvents.length === 0 ? (
            <View style={styles.carouselCardEmpty}>
              <Text style={styles.carouselEmptyText}>No events yet</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <View style={styles.activityTitleWrap}>
            <MaterialCommunityIcons name="chart-line-variant" size={14} color={colors.textPrimary} />
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <Text style={styles.activityViewAll}>View All</Text>
        </View>

        <View style={styles.activityList}>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              {item.imageUrl ? (
                <ImageBackground source={{ uri: item.imageUrl }} style={styles.activityAvatar} imageStyle={styles.activityAvatarImage} />
              ) : (
                <View style={styles.activityAvatarPlaceholder}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#8F6BFF" />
                </View>
              )}

              <View style={styles.activityBody}>
                <Text style={styles.activityItemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.activityItemSubtitle} numberOfLines={1}>{item.subtitle}</Text>
              </View>

              <View style={styles.activityMetaWrap}>
                <Text style={styles.activityMetaText}>{formatRelativeTime(item.createdAt)}</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#7D8299" />
              </View>
            </View>
          ))}
        </View>
      </View>

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

      <CreateSongModal
        visible={createSongModal.visible}
        keys={keys}
        values={createSongModal.values}
        submitting={createSongModal.submitting}
        validationError={createSongModal.validationError}
        onChangeField={createSongModal.updateField}
        onSubmit={createSongModal.submit}
        onClose={createSongModal.close}
      />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 116,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.navBorder,
    marginHorizontal: -16,
    marginBottom: 26,
  },
  title: {
    color: '#F1F3FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#F7F8FD',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 56 / 2,
    lineHeight: 62 / 2,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  description: {
    color: '#AEB3C7',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
    marginBottom: 22,
  },
  heroCard: {
    minHeight: 210,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 78,
  },
  badgePrimary: {
    backgroundColor: '#8B5CF6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgePrimaryText: {
    color: '#1A132F',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  badgeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(24, 24, 24, 0.76)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeDarkText: {
    color: '#F1F3FC',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 46 / 2,
    lineHeight: 52 / 2,
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  metaRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#ECECF5',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 12,
  },
  quickActionsTitle: {
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 36 / 2,
    lineHeight: 40 / 2,
    letterSpacing: -0.3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: 14,
    backgroundColor: '#1B1D2E',
    borderWidth: 1,
    borderColor: '#252A43',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2C2A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    color: '#F2F3FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    lineHeight: 19,
  },
  quickActionSubtitle: {
    color: '#AEB3C7',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  carouselSection: {
    marginTop: 18,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  carouselTitle: {
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    lineHeight: 22,
  },
  carouselCount: {
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  carouselTrack: {
    gap: 10,
    paddingRight: 8,
  },
  carouselCard: {
    width: 160,
    minHeight: 86,
    borderRadius: 14,
    backgroundColor: '#1B1D2E',
    borderWidth: 1,
    borderColor: '#252A43',
    overflow: 'hidden',
  },
  carouselCardImage: {
    borderRadius: 14,
  },
  carouselCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  carouselCardTitle: {
    color: '#F2F3FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 18,
  },
  carouselCardSubtitle: {
    color: '#AEB3C7',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  carouselCardEmpty: {
    width: 160,
    minHeight: 86,
    borderRadius: 14,
    backgroundColor: '#1B1D2E',
    borderWidth: 1,
    borderColor: '#252A43',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselEmptyText: {
    color: '#AEB3C7',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  activitySection: {
    marginTop: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityTitle: {
    color: '#F2F3FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    lineHeight: 22,
  },
  activityViewAll: {
    color: '#7E68D7',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    lineHeight: 16,
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },
  activityAvatarImage: {
    borderRadius: 23,
  },
  activityAvatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2C2A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: {
    flex: 1,
    marginLeft: 12,
  },
  activityItemTitle: {
    color: '#F2F3FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    lineHeight: 21,
  },
  activityItemSubtitle: {
    color: '#AEB3C7',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 17,
  },
  activityMetaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityMetaText: {
    color: '#7D8299',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    lineHeight: 14,
  },
})
