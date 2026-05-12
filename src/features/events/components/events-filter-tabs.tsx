import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type EventsFilter = 'all' | 'today' | 'upcoming'

type EventsFilterOption = {
  value: EventsFilter
  label: string
}

type EventsFilterTabsProps = {
  selectedFilter: EventsFilter
  counts: {
    all: number
    upcoming: number
    past: number
  }
  onFilterChange: (filter: EventsFilter) => void
}

export function EventsFilterTabs({ selectedFilter, counts, onFilterChange }: EventsFilterTabsProps) {
  const filterOptions: EventsFilterOption[] = [
    { value: 'all', label: `All: ${counts.all}` },
    { value: 'today', label: `Upcoming: ${counts.upcoming}` },
    { value: 'upcoming', label: `Past: ${counts.past}` },
  ]

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
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  tab: { height: 24, borderRadius: 12, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24283C', borderWidth: 1, borderColor: '#2F334D' },
  activeTab: { backgroundColor: '#4F3ED9', borderColor: '#6F62E8' },
  tabText: { color: '#A9AEC3', fontFamily: 'Inter_700Bold', fontSize: 11, lineHeight: 14 },
  activeTabText: { color: '#ECEAFF' },
})
