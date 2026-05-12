import { useEffect, useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'

type SongDetailsModalProps = {
  visible: boolean
  title: string
  keyLabel: string
  keyOptions: Array<{ id: number; name: string }>
  selectedKeyId: number | null
  keyUpdating?: boolean
  onChangeDefaultKey: (keyId: number | null) => void
  progression: string
  progressionUpdating?: boolean
  onSaveProgression: (nextValue: string) => void
  createdAtLabel: string
  updatedAtLabel: string
  onClose: () => void
}

export function SongDetailsModal({
  visible,
  title,
  keyLabel,
  keyOptions,
  selectedKeyId,
  keyUpdating = false,
  onChangeDefaultKey,
  progression,
  progressionUpdating = false,
  onSaveProgression,
  createdAtLabel,
  updatedAtLabel,
  onClose,
}: SongDetailsModalProps) {
  const [editingProgression, setEditingProgression] = useState(false)
  const [progressionValue, setProgressionValue] = useState(progression)

  useEffect(() => {
    if (!editingProgression) setProgressionValue(progression)
  }, [editingProgression, progression])

  const progressionDirty = useMemo(() => progressionValue.trim() !== progression.trim(), [progression, progressionValue])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close song details" />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.headerBody}>
              <Text style={styles.eyebrow}>Song Details</Text>
              <Text style={styles.title}>{title}</Text>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close song details modal">
              <MaterialCommunityIcons name="close" size={20} color="#E9ECFF" />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Default Key</Text>
                <Text style={styles.metaValue}>{keyLabel}</Text>
                <View style={styles.keyChoicesWrap}>
                  {keyOptions.map((key) => {
                    const selected = selectedKeyId === key.id

                    return (
                      <Pressable
                        key={key.id}
                        style={[styles.keyChoiceChip, selected && styles.keyChoiceChipSelected]}
                        onPress={() => onChangeDefaultKey(key.id)}
                        disabled={keyUpdating}
                        accessibilityRole="button"
                        accessibilityState={{ selected, disabled: keyUpdating }}
                      >
                        <Text style={[styles.keyChoiceText, selected && styles.keyChoiceTextSelected]}>{key.name}</Text>
                      </Pressable>
                    )
                  })}
                  <Pressable
                    style={[styles.keyChoiceChip, selectedKeyId === null && styles.keyChoiceChipSelected]}
                    onPress={() => onChangeDefaultKey(null)}
                    disabled={keyUpdating}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedKeyId === null, disabled: keyUpdating }}
                  >
                    <Text style={[styles.keyChoiceText, selectedKeyId === null && styles.keyChoiceTextSelected]}>None</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Progression Source</Text>
                <Text style={styles.metaValue}>{progression === 'No progression saved' ? 'Not set' : 'Main'}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Nashville / Numbering</Text>
                <Pressable
                  style={styles.editIconButton}
                  onPress={() => setEditingProgression((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityLabel="Edit progression"
                >
                  <MaterialCommunityIcons name="pencil-outline" size={16} color="#DCE3FF" />
                </Pressable>
              </View>
              <View style={styles.progressionBox}>
                {editingProgression ? (
                  <TextInput
                    value={progressionValue}
                    onChangeText={setProgressionValue}
                    style={styles.progressionInput}
                    multiline
                    textAlignVertical="top"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                ) : (
                  <Text style={styles.progressionText}>{progression}</Text>
                )}
              </View>
              {editingProgression && progressionDirty ? (
                <Pressable
                  style={[styles.saveButton, progressionUpdating && styles.disabledButton]}
                  onPress={() => onSaveProgression(progressionValue)}
                  disabled={progressionUpdating}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Song Record</Text>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Created</Text>
                <Text style={styles.recordValue}>{createdAtLabel}</Text>
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Updated</Text>
                <Text style={styles.recordValue}>{updatedAtLabel}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    maxHeight: '86%',
    borderRadius: 22,
    backgroundColor: '#151A2D',
    borderWidth: 1,
    borderColor: '#2A304A',
    padding: 16,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  headerBody: { flex: 1 },
  eyebrow: { color: '#AAB1CE', fontFamily: 'Inter_700Bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  title: { color: '#F2F5FF', fontFamily: 'Inter_800ExtraBold', fontSize: 24 },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#202843', alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingBottom: 8 },
  metaGrid: { flexDirection: 'row', gap: 10 },
  metaItem: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#2F3654', backgroundColor: '#1D2340', paddingHorizontal: 12, paddingVertical: 10 },
  metaLabel: { color: '#94A0C2', fontFamily: 'Inter_700Bold', fontSize: 11, marginBottom: 4 },
  metaValue: { color: '#E8ECFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
  keyChoicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  keyChoiceChip: { borderRadius: 999, borderWidth: 1, borderColor: '#434D72', backgroundColor: '#252B45', paddingHorizontal: 8, paddingVertical: 4 },
  keyChoiceChipSelected: { borderColor: '#8F6BFF', backgroundColor: '#342A5A' },
  keyChoiceText: { color: '#B2BCDE', fontFamily: 'Inter_700Bold', fontSize: 11 },
  keyChoiceTextSelected: { color: '#ECE7FF' },
  section: { marginTop: 14 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { color: '#C9D0EC', fontFamily: 'Inter_700Bold', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },
  editIconButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(143,107,255,0.14)', borderWidth: 1, borderColor: 'rgba(143,107,255,0.45)', alignItems: 'center', justifyContent: 'center' },
  progressionBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2F3654',
    backgroundColor: '#11162B',
    minHeight: 96,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  progressionText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 22 },
  progressionInput: { minHeight: 90, color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 22, padding: 0 },
  saveButton: { alignSelf: 'flex-end', marginTop: 8, minHeight: 34, borderRadius: 999, backgroundColor: '#8F6BFF', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 12 },
  disabledButton: { opacity: 0.6 },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#242B45' },
  recordLabel: { color: '#9BA6C8', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  recordValue: { color: '#E8ECFF', fontFamily: 'Inter_700Bold', fontSize: 13 },
})
