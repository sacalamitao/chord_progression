import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type EventsFilter = 'all' | 'today' | 'upcoming'

type EventsFilterOption = {
  value: EventsFilter
  label: string
}

type EventsFilterTabsProps = {
  selectedFilter: EventsFilter
  onFilterChange: (filter: EventsFilter) => void
}

const filterOptions: EventsFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
]

export function EventsFilterTabs({ selectedFilter, onFilterChange }: EventsFilterTabsProps) {
  return (
    <View style={styles.container}>
      {filterOptions.map((option) => {
        const active = option.value === selectedFilter

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Show ${option.label.toLowerCase()} events`}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => onFilterChange(option.value)}
          >
            <Text style={[styles.tabText, active && styles.activeTabText]}>{option.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { height: 58, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18, padding: 7, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 18, elevation: 2 },
  tab: { flex: 1, height: 44, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  activeTab: { backgroundColor: colors.surfaceElevated, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.2, shadowRadius: 13, elevation: 3 },
  tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: '800' },
  activeTabText: { color: colors.textPrimary },
})
