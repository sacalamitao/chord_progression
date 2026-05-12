import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/colors'

type ConfirmationModalProps = {
  visible: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} disabled={loading} />

        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.actionsRow}>
            <Pressable style={[styles.secondaryButton, loading && styles.disabled]} onPress={onCancel} disabled={loading}>
              <Text style={styles.secondaryButtonText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryButton, destructive && styles.destructiveButton, loading && styles.disabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{confirmLabel}</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 18 },
  card: { borderRadius: 18, backgroundColor: '#151A2D', borderWidth: 1, borderColor: '#2A304A', paddingHorizontal: 16, paddingVertical: 16 },
  title: { color: '#F0F4FF', fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 8 },
  description: { color: '#AAB1CE', fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: '#3B425F', backgroundColor: '#1A1F33', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#D9DFFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
  primaryButton: { flex: 1, minHeight: 44, borderRadius: 12, backgroundColor: '#8F6BFF', alignItems: 'center', justifyContent: 'center' },
  destructiveButton: { backgroundColor: '#D84E62' },
  primaryButtonText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
  disabled: { opacity: 0.6 },
})

