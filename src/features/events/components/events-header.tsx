import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'

type EventsHeaderProps = {
  onCalendarPress?: () => void
  onFilterPress?: () => void
}

export function EventsHeader({ onCalendarPress, onFilterPress }: EventsHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <View style={styles.actionsRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Open calendar" style={styles.iconButton} onPress={onCalendarPress}>
          <MaterialCommunityIcons name="calendar-month-outline" size={19} color={colors.textPrimary} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Open filters" style={styles.iconButton} onPress={onFilterPress}>
          <MaterialCommunityIcons name="tune-variant" size={19} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 24, lineHeight: 30 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
})
