import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

type EventsSearchBarProps = {
  value: string
  onChangeText: (value: string) => void
  onClear: () => void
}

export function EventsSearchBar({ value, onChangeText, onClear }: EventsSearchBarProps) {
  const hasSearchTerm = value.trim().length > 0

  return (
    <View style={styles.container}>
      <View style={styles.searchInput}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search events"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={onChangeText}
          placeholder="Search events"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
        {hasSearchTerm ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear event search" hitSlop={8} onPress={onClear}>
            <Text style={styles.clearIcon}>×</Text>
          </Pressable>
        ) : null}
      </View>
      {/* <View style={styles.filterButton}>
        <Text style={styles.filterIcon}>☷</Text>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 25 },
  searchInput: { flex: 1, height: 56, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 18, elevation: 2 },
  searchIcon: { color: colors.textMuted, fontSize: 24, lineHeight: 25, marginRight: 11, transform: [{ rotate: '-8deg' }] },
  input: { flex: 1, color: colors.textPrimary, fontSize: 16, fontWeight: '700', paddingVertical: 0 },
  clearIcon: { color: colors.textMuted, fontSize: 24, lineHeight: 26, fontWeight: '500', marginLeft: 8 },
  filterButton: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 4 },
  filterIcon: { color: colors.textPrimary, fontSize: 21, lineHeight: 23, fontWeight: '800' },
})
