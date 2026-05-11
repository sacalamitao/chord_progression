import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type SetlistSection = {
  label: string
  progression: string
  numeric: string
}

export type EventSetlistItemViewModel = {
  id: string
  title: string
  performanceKey: string
  keyShortcut: string
  sections: SetlistSection[]
}

type EventSetlistItemProps = {
  item: EventSetlistItemViewModel
}

export function EventSetlistItem({ item }: EventSetlistItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${item.title} from event`} hitSlop={8}>
          <Text style={styles.deleteIcon}>⌫</Text>
        </Pressable>
      </View>

      <Text style={styles.metaLabel}>Performance Key</Text>
      <View style={styles.keyRow}>
        <View style={styles.keyChip}>
          <Text style={styles.keyChipText}>{item.performanceKey}</Text>
          <Text style={styles.keyChipArrow}>⌄</Text>
        </View>
        <View style={styles.shortcutChip}>
          <Text style={styles.shortcutText}>{item.keyShortcut}</Text>
        </View>
      </View>

      {item.sections.map((section) => (
        <View key={`${item.id}-${section.label}`} style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <View style={styles.numericChip}>
              <Text style={styles.numericChipText}>{section.numeric}</Text>
            </View>
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
  cardTitle: { flex: 1, color: colors.textPrimary, fontSize: 17, fontWeight: '800', lineHeight: 22, marginRight: 8 },
  deleteIcon: { color: colors.danger, fontSize: 16, fontWeight: '700' },
  metaLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  keyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  keyChip: { flex: 1, minHeight: 36, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceElevated, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  keyChipText: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  keyChipArrow: { color: colors.textSecondary, fontSize: 14 },
  shortcutChip: { minWidth: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  shortcutText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  sectionBlock: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sectionLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  numericChip: { borderRadius: 6, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 6, paddingVertical: 2 },
  numericChipText: { color: colors.textSecondary, fontSize: 9, fontWeight: '700' },
  progressionText: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
})

