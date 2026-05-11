import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/colors'

export type BottomNavigationTab = 'home' | 'events' | 'songs' | 'keys'

type BottomNavigationItem = {
  key: BottomNavigationTab
  label: string
  icon: 'home-outline' | 'calendar-blank-outline' | 'music-note-outline' | 'piano'
  activeIcon: 'home' | 'calendar-blank' | 'music-note' | 'piano'
}

type NavigationItem = BottomNavigationItem

type BottomNavigationProps = {
  activeTab: BottomNavigationTab
  onTabPress?: (tab: BottomNavigationTab) => void
}

const navigationItems: NavigationItem[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'events', label: 'Events', icon: 'calendar-blank-outline', activeIcon: 'calendar-blank' },
  { key: 'songs', label: 'Songs', icon: 'music-note-outline', activeIcon: 'music-note' },
  { key: 'keys', label: 'Keys', icon: 'piano', activeIcon: 'piano' },
]

function NavigationIcon({ item, active }: { item: NavigationItem; active: boolean }) {
  const color = active ? colors.navIcon : colors.navIconInactive
  const size = 26

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
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: colors.navSurface,
    borderTopWidth: 1,
    borderTopColor: colors.navBorder,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navItem: { width: 72, height: 62, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 36, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  activeIconWrap: { backgroundColor: 'transparent' },
  navActiveLabel: { color: colors.navText, fontSize: 10, lineHeight: 12, fontWeight: '700' },
  navLabel: { color: colors.navTextInactive, fontSize: 10, lineHeight: 12, fontWeight: '600' },
})
