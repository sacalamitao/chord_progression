import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
        <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          accessibilityLabel="Search events"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={onChangeText}
          placeholder="Search services or rehearsals..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
        {hasSearchTerm ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear event search" hitSlop={8} onPress={onClear}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} style={styles.clearIcon} />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  searchInput: { height: 40, borderRadius: 12, backgroundColor: '#15182A', borderWidth: 1, borderColor: '#272B42', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: colors.textPrimary, fontFamily: 'Inter_500Medium', fontSize: 13, paddingVertical: 0 },
  clearIcon: { marginLeft: 8 },
})
