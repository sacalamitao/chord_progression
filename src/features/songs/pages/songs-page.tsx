import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { CreateSongModal } from '../components/create-song-modal'
import { useCreateSongModal } from '../hooks/use-create-song-modal'
import { useSongs } from '../hooks/use-songs'
import { colors } from '../../../shared/theme/colors'
import { useKeys } from '../../keys/hooks/use-keys'

export function SongsPage() {
  const { createSong } = useSongs()
  const { keys } = useKeys()
  const createSongModal = useCreateSongModal({
    createSong,
    onError: (err) => {
      console.error('Create song failed:', err)
      Alert.alert('Unable to create song', 'Please try again.')
    },
  })

  return (
    <View style={styles.screen}>
      <Pressable style={styles.addButton} onPress={createSongModal.open}>
        <Text style={styles.addButtonText}>Add Song</Text>
      </Pressable>

      <CreateSongModal
        visible={createSongModal.visible}
        keys={keys}
        values={createSongModal.values}
        submitting={createSongModal.submitting}
        validationError={createSongModal.validationError}
        onChangeField={createSongModal.updateField}
        onSubmit={createSongModal.submit}
        onClose={createSongModal.close}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24 },
  addButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
})
