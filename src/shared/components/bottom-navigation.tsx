import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/colors'

export type BottomNavigationTab = 'keys' | 'songs' | 'events'

type BottomNavigationItem = {
  key: BottomNavigationTab
  label: string
}

type IoniconNavigationItem = BottomNavigationItem & {
  iconSet: 'ionicons'
  icon: 'musical-notes-outline'
  activeIcon: 'musical-notes'
}

type MaterialNavigationItem = BottomNavigationItem & {
  iconSet: 'material'
  icon: 'music-note-outline' | 'calendar-month-outline'
  activeIcon: 'music-note' | 'calendar-month'
}

type NavigationItem = IoniconNavigationItem | MaterialNavigationItem

type BottomNavigationProps = {
  activeTab: BottomNavigationTab
  onTabPress?: (tab: BottomNavigationTab) => void
}

const navigationItems: NavigationItem[] = [
  { key: 'keys', label: 'Keys', icon: 'musical-notes-outline', activeIcon: 'musical-notes', iconSet: 'ionicons' },
  { key: 'songs', label: 'Songs', icon: 'music-note-outline', activeIcon: 'music-note', iconSet: 'material' },
  { key: 'events', label: 'Events', icon: 'calendar-month-outline', activeIcon: 'calendar-month', iconSet: 'material' },
]

function NavigationIcon({ item, active }: { item: NavigationItem; active: boolean }) {
  const color = active ? colors.accent : colors.textMuted
  const size = active ? 24 : 23

  if (item.iconSet === 'ionicons') {
    return <Ionicons name={active ? item.activeIcon : item.icon} size={size} color={color} />
  }

  return <MaterialCommunityIcons name={active ? item.activeIcon : item.icon} size={size} color={color} />
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => {
        const active = item.key === activeTab

        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${item.label} tab`}
            style={styles.navItem}
            onPress={() => onTabPress?.(item.key)}
          >
            <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
              <NavigationIcon item={item} active={active} />
            </View>
            <Text style={active ? styles.navActiveLabel : styles.navLabel}>{item.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 28, paddingTop: 7, paddingBottom: 6 },
  navItem: { width: 78, height: 56, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 34, height: 30, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  activeIconWrap: { backgroundColor: colors.surfaceElevated },
  navActiveLabel: { color: colors.textPrimary, fontSize: 10, lineHeight: 12, fontWeight: '900' },
  navLabel: { color: colors.textMuted, fontSize: 10, lineHeight: 12, fontWeight: '700' },
})
