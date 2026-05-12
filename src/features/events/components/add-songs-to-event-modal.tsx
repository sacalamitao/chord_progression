import { useMemo, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'
import type { EventSongSelectionOption } from '../api'

type AddSongsToEventModalProps = {
  visible: boolean
  options: EventSongSelectionOption[]
  selectedSet: Set<number>
  selectedCount: number
  loading: boolean
  submitting: boolean
  error: string | null
  onToggleSong: (songId: number) => void
  onSubmit: () => void
  onClose: () => void
}

export function AddSongsToEventModal({
  visible,
  options,
  selectedSet,
  selectedCount,
  loading,
  submitting,
  error,
  onToggleSong,
  onSubmit,
  onClose,
}: AddSongsToEventModalProps) {
  const [dropdownOpen, setDropdownOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) return options
    return options.filter((song) => song.title.toLowerCase().includes(normalized))
  }, [options, searchTerm])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close add songs modal" disabled={submitting} />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Add Songs to Event</Text>
            <Pressable style={styles.closeButton} onPress={onClose} disabled={submitting}>
              <MaterialCommunityIcons name="close" size={20} color="#EAEFFF" />
            </Pressable>
          </View>

          <Text style={styles.helperText}>Select one or multiple songs, then tap Add Selected.</Text>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#8F6BFF" />
            </View>
          ) : (
            <View>
              <Pressable style={styles.dropdownTrigger} onPress={() => setDropdownOpen((prev) => !prev)} accessibilityRole="button" accessibilityLabel="Toggle songs dropdown">
                <Text style={styles.dropdownTriggerText}>Select songs</Text>
                <View style={styles.dropdownMetaWrap}>
                  <Text style={styles.dropdownMetaText}>{selectedCount} selected</Text>
                  <MaterialCommunityIcons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#AAB3D4" />
                </View>
              </Pressable>

              {dropdownOpen ? (
                <View style={styles.dropdownContent}>
                  <View style={styles.searchWrap}>
                    <MaterialCommunityIcons name="magnify" size={16} color="#8993B7" />
                    <TextInput
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      placeholder="Search songs..."
                      placeholderTextColor="#8993B7"
                      style={styles.searchInput}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {filteredOptions.map((song) => {
                      const selected = selectedSet.has(song.id)

                      return (
                        <Pressable
                          key={song.id}
                          style={[styles.itemRow, selected && styles.itemRowSelected]}
                          onPress={() => onToggleSong(song.id)}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                        >
                          <View style={styles.itemBody}>
                            <Text style={styles.itemTitle}>{song.title}</Text>
                            <Text style={styles.itemSubtitle}>{song.default_key_id ? `Default key id: ${song.default_key_id}` : 'No default key'}</Text>
                          </View>

                          <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                            {selected ? <MaterialCommunityIcons name="check" size={16} color="#111427" /> : null}
                          </View>
                        </Pressable>
                      )
                    })}

                    {!loading && options.length === 0 ? <Text style={styles.emptyText}>No available songs to add.</Text> : null}
                    {!loading && options.length > 0 && filteredOptions.length === 0 ? <Text style={styles.emptyText}>No songs match your search.</Text> : null}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionsRow}>
            <Pressable style={[styles.secondaryButton, submitting && styles.disabledButton]} onPress={onClose} disabled={submitting}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, (submitting || selectedCount === 0 || loading) && styles.disabledButton]}
              onPress={onSubmit}
              disabled={submitting || selectedCount === 0 || loading}
            >
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Add Selected ({selectedCount})</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 16 },
  card: { maxHeight: '84%', borderRadius: 20, backgroundColor: '#151A2D', borderWidth: 1, borderColor: '#2A304A', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: '#EFF3FF', fontSize: 20, fontWeight: '900' },
  closeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E2440' },
  helperText: { color: '#9DA7C8', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  dropdownTrigger: { borderRadius: 12, borderWidth: 1, borderColor: '#3A4260', backgroundColor: '#1C223B', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownTriggerText: { color: '#EAF0FF', fontSize: 14, fontWeight: '800' },
  dropdownMetaWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dropdownMetaText: { color: '#9EA8CC', fontSize: 12, fontWeight: '700' },
  dropdownContent: { marginTop: 10 },
  searchWrap: { borderRadius: 10, borderWidth: 1, borderColor: '#39415E', backgroundColor: '#1B2138', minHeight: 40, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  searchInput: { flex: 1, color: '#EFF3FF', fontSize: 13, fontWeight: '600', paddingVertical: 0 },
  loadingWrap: { paddingVertical: 24 },
  list: { flexGrow: 0, maxHeight: 280, marginTop: 10 },
  listContent: { gap: 8, paddingBottom: 6 },
  itemRow: { borderRadius: 12, borderWidth: 1, borderColor: '#2F3654', backgroundColor: '#1B2240', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemRowSelected: { borderColor: '#8F6BFF', backgroundColor: '#252C4F' },
  itemBody: { flex: 1 },
  itemTitle: { color: '#EEF2FF', fontSize: 15, fontWeight: '800' },
  itemSubtitle: { color: '#9AA4C7', fontSize: 12, fontWeight: '600', marginTop: 2 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#55608C', backgroundColor: '#151A2D' },
  checkboxSelected: { borderColor: '#8F6BFF', backgroundColor: '#8F6BFF', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9DA7C8', textAlign: 'center', paddingVertical: 14, fontWeight: '600' },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '700', marginTop: 8 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: '#3B425F', backgroundColor: '#1A1F33', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#D9DFFF', fontSize: 14, fontWeight: '800' },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: '#8F6BFF', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  disabledButton: { opacity: 0.55 },
})
