import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type KeyMappingCardViewModel = {
  id: number
  name: string
  degreeChords: Record<string, string>
}

type KeyMappingCardProps = {
  item: KeyMappingCardViewModel
}

const orderedDegrees = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export function KeyMappingCard({ item }: KeyMappingCardProps) {
  const definedDegrees = orderedDegrees.filter((degree) => Boolean(item.degreeChords[degree]))

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.name}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Open actions for ${item.name}`} hitSlop={8}>
          <Text style={styles.more}>⋮</Text>
        </Pressable>
      </View>

      <View style={styles.degreeGrid}>
        {orderedDegrees.map((degree) => (
          <View key={`${item.id}-${degree}`} style={styles.degreeChip}>
            <Text style={styles.degreeLabel}>{degree}</Text>
            <Text style={styles.chordText}>{item.degreeChords[degree] ?? '—'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.helperText}>{definedDegrees.length} Degrees Defined</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${item.name} mapping`}>
          <Text style={styles.actionText}>Edit Details ›</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  more: { color: colors.textMuted, fontSize: 18, fontWeight: '700' },
  degreeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  degreeChip: { width: '23%', minHeight: 54, borderRadius: 10, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingVertical: 7 },
  degreeLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  chordText: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', marginTop: 2 },
  footerRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  helperText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  actionText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
})

