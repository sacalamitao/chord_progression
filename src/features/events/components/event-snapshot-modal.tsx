import { ImageBackground, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'

type EventSnapshotModalProps = {
  visible: boolean
  title: string
  venue: string
  dateLabel: string
  timeLabel: string
  imageUrl: string | null
  onClose: () => void
  onAddSong: () => void
  onEdit: () => void
  onDelete: () => void
}

const fallbackImage = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80'

export function EventSnapshotModal({ visible, title, venue, dateLabel, timeLabel, imageUrl, onClose, onAddSong, onEdit, onDelete }: EventSnapshotModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close event snapshot" />

        <View style={styles.card}>
          <ImageBackground source={{ uri: imageUrl ?? fallbackImage }} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </ImageBackground>

          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Delete event" style={styles.deleteIconButton} onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#F67676" />
              </Pressable>
            </View>

            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={15} color="#A4ABCA" />
              <Text style={styles.metaText}>{venue}</Text>
            </View>

            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="calendar-month-outline" size={15} color="#A4ABCA" />
              <Text style={styles.metaText}>{dateLabel}</Text>
            </View>

            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="clock-outline" size={15} color="#A4ABCA" />
              <Text style={styles.metaText}>{timeLabel}</Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton} onPress={onAddSong}>
                <Text style={styles.secondaryButtonText}>Add Song</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={onEdit}>
                <Text style={styles.primaryButtonText}>Edit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 18 },
  card: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#121627', borderWidth: 1, borderColor: '#2A304A' },
  hero: { height: 220, justifyContent: 'flex-start' },
  heroImage: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', padding: 14, alignItems: 'flex-end' },
  closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  title: { color: '#EEF1FF', fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 24, marginBottom: 10 },
  deleteIconButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(246,118,118,0.1)', borderWidth: 1, borderColor: 'rgba(246,118,118,0.35)' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8 },
  metaText: { color: '#A4ABCA', fontFamily: 'Inter_500Medium', fontSize: 13 },
  actionsRow: { marginTop: 18, flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: '#3B425F', backgroundColor: '#1A1F33', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#D9DFFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
  primaryButton: { flex: 1, minHeight: 46, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
})
