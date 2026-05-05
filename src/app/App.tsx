import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EventsPage } from '../features/events/pages/events-page'
import { KeysPage } from '../features/keys/pages/keys-page'
import { SongsPage } from '../features/songs/pages/songs-page'
import { BottomNavigation, type BottomNavigationTab } from '../shared/components/bottom-navigation'
import { colors } from '../shared/theme/colors'

export function RootApp() {
  const [activeTab, setActiveTab] = useState<BottomNavigationTab>('events')

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
      {activeTab === 'keys' ? <KeysPage /> : null}
      {activeTab === 'songs' ? <SongsPage /> : null}
      {activeTab === 'events' ? <EventsPage /> : null}

      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
})
