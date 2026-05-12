import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type SetlistSection = {
  label: string
  progression: string
}

export type EventSetlistItemViewModel = {
  id: string
  performanceKeyId: number
  title: string
  performanceKey: string
  keyShortcut: string
  sections: SetlistSection[]
}

type EventSetlistItemProps = {
  item: EventSetlistItemViewModel
  keyOptions: Array<{ id: number; name: string }>
  keyUpdating?: boolean
  onChangePerformanceKey?: (payload: { eventSongId: string; keyId: number }) => void
  onRemove?: (eventSongId: string) => void
}

export function EventSetlistItem({ item, keyOptions, keyUpdating = false, onChangePerformanceKey, onRemove }: EventSetlistItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${item.title} from event`} hitSlop={8} onPress={() => onRemove?.(item.id)}>
          <Text style={styles.deleteIcon}>⌫</Text>
        </Pressable>
      </View>

      <Text style={styles.metaLabel}>Performance Key</Text>
      <View style={styles.keyRow}>
        <View style={styles.keyOptionsWrap}>
          {keyOptions.map((option) => {
            const selected = option.id === item.performanceKeyId

            return (
              <Pressable
                key={`${item.id}-${option.id}`}
                style={[styles.keyChoiceChip, selected && styles.keyChoiceChipSelected]}
                onPress={() => onChangePerformanceKey?.({ eventSongId: item.id, keyId: option.id })}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: keyUpdating }}
                disabled={keyUpdating}
              >
                <Text style={[styles.keyChoiceText, selected && styles.keyChoiceTextSelected]}>{option.name}</Text>
              </Pressable>
            )
          })}
        </View>
        <View style={styles.shortcutChip}>
          <Text style={styles.shortcutText}>{item.keyShortcut}</Text>
        </View>
      </View>

      {item.sections.map((section) => (
        <View key={`${item.id}-${section.label}`} style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
          </View>
          <Text style={styles.progressionText}>{section.progression}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { flex: 1, color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold', fontSize: 17, lineHeight: 22, marginRight: 8 },
  deleteIcon: { color: colors.danger, fontFamily: 'Inter_700Bold', fontSize: 16 },
  metaLabel: { color: colors.textMuted, fontFamily: 'Inter_700Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7 },
  keyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  keyOptionsWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  keyChoiceChip: { minHeight: 34, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceElevated, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' },
  keyChoiceChipSelected: { borderColor: '#8F6BFF', backgroundColor: '#2E2A45' },
  keyChoiceText: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 12 },
  keyChoiceTextSelected: { color: '#ECE7FF' },
  shortcutChip: { minWidth: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  shortcutText: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 11 },
  sectionBlock: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sectionLabel: { color: colors.textMuted, fontFamily: 'Inter_700Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7 },
  progressionText: { color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold', fontSize: 24, letterSpacing: 0.5 },
})
