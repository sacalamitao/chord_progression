import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

type EventsHeaderProps = {
  onCreatePress: () => void
  creating?: boolean
}

export function EventsHeader({ onCreatePress, creating = false }: EventsHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>Schedule</Text>
        <Text style={styles.title}>Events</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Create event" style={[styles.createButton, creating && styles.createButtonDisabled]} onPress={onCreatePress} disabled={creating}>
        <Text style={styles.createButtonText}>＋</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 },
  eyebrow: { color: colors.textSecondary, fontSize: 15, fontWeight: '700', lineHeight: 19, marginBottom: 2 },
  title: { color: colors.textPrimary, fontSize: 40, fontWeight: '900', letterSpacing: -1.4, lineHeight: 45 },
  createButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.22, shadowRadius: 16, elevation: 4 },
  createButtonDisabled: { opacity: 0.55 },
  createButtonText: { color: colors.textPrimary, fontSize: 31, lineHeight: 33, fontWeight: '300', marginTop: -2 },
})
