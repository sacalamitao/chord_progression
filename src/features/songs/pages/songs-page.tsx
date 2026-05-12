import { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CreateSongModal } from '../components/create-song-modal'
import { SongDetailsModal } from '../components/song-details-modal'
import { useCreateSongModal } from '../hooks/use-create-song-modal'
import { useSongs } from '../hooks/use-songs'
import { colors } from '../../../shared/theme/colors'
import { useKeys } from '../../keys/hooks/use-keys'

export function SongsPage() {
  const { songs, loading, error, createSong, updateSongDefaultKey, updateSongProgression } = useSongs()
  const { keys } = useKeys()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null)
  const [updatingProgression, setUpdatingProgression] = useState(false)

  const keyMap = useMemo(() => new Map(keys.map((item) => [item.id, item.name])), [keys])

  const filteredSongs = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) return songs

    return songs.filter((song) => song.title.toLowerCase().includes(normalized))
  }, [searchTerm, songs])

  const songsById = useMemo(() => new Map(songs.map((item) => [item.id, item])), [songs])
  const selectedSong = selectedSongId ? songsById.get(selectedSongId) ?? null : null

  const createSongModal = useCreateSongModal({
    createSong,
    onError: (err) => {
      console.error('Create song failed:', err)
      Alert.alert('Unable to create song', 'Please try again.')
    },
  })

  const formatDateLabel = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const onChangeSongDefaultKey = async (keyId: number | null) => {
    if (!selectedSong) return

    try {
      await updateSongDefaultKey({ songId: selectedSong.id, defaultKeyId: keyId })
    } catch (err) {
      Alert.alert('Unable to update default key', err instanceof Error ? err.message : 'Please try again.')
    }
  }

  const onSaveSongProgression = async (nextValue: string) => {
    if (!selectedSong) return

    try {
      setUpdatingProgression(true)
      await updateSongProgression({ songId: selectedSong.id, progression: nextValue })
    } catch (err) {
      Alert.alert('Unable to update progression', err instanceof Error ? err.message : 'Please try again.')
    } finally {
      setUpdatingProgression(false)
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Songs Library</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Filter songs">
              <MaterialCommunityIcons name="filter-variant" size={20} color="#D2D5E8" />
            </Pressable>
            <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Create song" onPress={createSongModal.open}>
              <MaterialCommunityIcons name="plus" size={20} color="#D2D5E8" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={18} color="#727A9D" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search by title or lyrics..."
            placeholderTextColor="#727A9D"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text style={styles.sectionLabel}>ALL SONGS ({filteredSongs.length})</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#8F6BFF" />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.list}>
          {filteredSongs.map((song) => {
            const keyName = song.default_key_id ? keyMap.get(song.default_key_id) ?? 'N/A' : 'N/A'

            return (
              <Pressable key={song.id} style={styles.songCard} accessibilityRole="button" accessibilityLabel={song.title} onPress={() => setSelectedSongId(song.id)}>
                <View style={styles.leadingIcon}>
                  <MaterialCommunityIcons name="music-note" size={18} color="#9B83FF" />
                </View>

                <View style={styles.cardBody}>
                  <Text numberOfLines={1} style={styles.songTitle}>
                    {song.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.keyPill}>
                      <Text style={styles.keyPillText}>Key: {keyName}</Text>
                    </View>
                    <Text style={styles.bpmText}># -- BPM</Text>
                  </View>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={20} color="#71789D" />
              </Pressable>
            )
          })}
        </View>

        {!loading && filteredSongs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No songs found</Text>
            <Text style={styles.emptyStateText}>Try searching by title.</Text>
          </View>
        ) : null}
      </ScrollView>

      <CreateSongModal
        visible={createSongModal.visible}
        keys={keys}
        form={createSongModal.form}
        submitting={createSongModal.submitting}
        enableProgressionFields
        onSubmit={createSongModal.submit}
        onClose={createSongModal.close}
      />

      <SongDetailsModal
        visible={Boolean(selectedSong)}
        title={selectedSong?.title ?? ''}
        keyLabel={selectedSong?.default_key_id ? keyMap.get(selectedSong.default_key_id) ?? 'N/A' : 'N/A'}
        keyOptions={keys.map((key) => ({ id: key.id, name: key.name }))}
        selectedKeyId={selectedSong?.default_key_id ?? null}
        onChangeDefaultKey={(keyId) => {
          void onChangeSongDefaultKey(keyId)
        }}
        progression={selectedSong?.progressions?.main?.trim() ? selectedSong.progressions.main : 'No progression saved'}
        progressionUpdating={updatingProgression}
        onSaveProgression={(nextValue) => {
          void onSaveSongProgression(nextValue)
        }}
        createdAtLabel={selectedSong ? formatDateLabel(selectedSong.created_at) : '—'}
        updatedAtLabel={selectedSong ? formatDateLabel(selectedSong.updated_at) : '—'}
        onClose={() => setSelectedSongId(null)}
      />

      <Pressable accessibilityRole="button" accessibilityLabel="Create song" style={styles.fab} onPress={createSongModal.open}>
        <MaterialCommunityIcons name="plus" size={28} color="#1B1434" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121322' },
  scroll: { flex: 1, backgroundColor: '#121322' },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { color: '#F7F8FF', fontFamily: 'Inter_800ExtraBold', fontSize: 30 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: '#31395C',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#161A2B',
  },
  searchInput: { flex: 1, color: '#F0F2FF', fontFamily: 'Inter_500Medium', fontSize: 14, paddingVertical: 0 },
  sectionLabel: { marginTop: 18, marginBottom: 10, color: '#A8AEC7', fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.5 },
  loadingWrap: { paddingVertical: 12 },
  errorText: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 10 },
  list: { gap: 10 },
  songCard: {
    minHeight: 78,
    borderRadius: 12,
    backgroundColor: '#1B1F33',
    borderWidth: 1,
    borderColor: '#232A45',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leadingIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2248',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 6 },
  songTitle: { color: '#F4F6FF', fontFamily: 'Inter_800ExtraBold', fontSize: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  keyPill: { borderRadius: 999, borderWidth: 1, borderColor: '#484E70', backgroundColor: '#2B2E45', paddingHorizontal: 7, paddingVertical: 2 },
  keyPillText: { color: '#9A9FC0', fontFamily: 'Inter_700Bold', fontSize: 10 },
  bpmText: { color: '#7E85A9', fontFamily: 'Inter_700Bold', fontSize: 10 },
  emptyState: { alignItems: 'center', borderRadius: 20, backgroundColor: '#1B1F33', marginTop: 14, paddingHorizontal: 20, paddingVertical: 24, borderWidth: 1, borderColor: '#232A45' },
  emptyStateTitle: { color: '#F4F6FF', fontFamily: 'Inter_800ExtraBold', fontSize: 17, marginBottom: 6 },
  emptyStateText: { color: '#A8AEC7', fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 96,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8F6BFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1633',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 20,
  },
})
