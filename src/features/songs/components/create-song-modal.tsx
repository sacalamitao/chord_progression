import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import type { Key } from '../../keys/types'
import type { UseFormReturn } from 'react-hook-form'
import type { SongFormValues } from '../forms/song-form.schema'

type CreateSongModalProps = {
  visible: boolean
  keys: Key[]
  form: UseFormReturn<SongFormValues>
  submitting: boolean
  onSubmit: () => void
  onClose: () => void
}

export function CreateSongModal({ visible, keys, form, submitting, onSubmit, onClose }: CreateSongModalProps) {
  const values = form.watch()
  const titleError = form.formState.errors.title?.message

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close create song modal" style={StyleSheet.absoluteFill} onPress={onClose} disabled={submitting} />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>New Song</Text>
              <Text style={styles.title}>Add Song</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.closeButton} onPress={onClose} disabled={submitting}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Song title</Text>
            <TextInput
              accessibilityLabel="Song title"
              autoCapitalize="words"
              editable={!submitting}
              onChangeText={(value) => form.setValue('title', value, { shouldDirty: true, shouldValidate: true })}
              placeholder="Goodness of God"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              style={styles.input}
              value={values.title}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
            <Text style={styles.helperText}>Add a title now. Progressions and key mapping can be added later.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Default key</Text>
            <View style={styles.keyChoicesWrap}>
              {keys.map((key) => {
                const selected = values.defaultKeyId === key.id

                return (
                  <Pressable
                    key={key.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[styles.keyChoiceChip, selected && styles.keyChoiceChipSelected]}
                    onPress={() => form.setValue('defaultKeyId', key.id, { shouldDirty: true, shouldValidate: true })}
                    disabled={submitting}
                  >
                    <Text style={[styles.keyChoiceText, selected && styles.keyChoiceTextSelected]}>{key.name}</Text>
                  </Pressable>
                )
              })}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: values.defaultKeyId === null }}
                style={[styles.keyChoiceChip, values.defaultKeyId === null && styles.keyChoiceChipSelected]}
                onPress={() => form.setValue('defaultKeyId', null, { shouldDirty: true, shouldValidate: true })}
                disabled={submitting}
              >
                <Text style={[styles.keyChoiceText, values.defaultKeyId === null && styles.keyChoiceTextSelected]}>None</Text>
              </Pressable>
            </View>
            <Text style={styles.helperText}>Optional. Select a key from existing key mappings.</Text>
          </View>
          <View style={styles.actionsRow}>
            <Pressable accessibilityRole="button" style={[styles.secondaryButton, submitting && styles.disabledButton]} onPress={onClose} disabled={submitting}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.primaryButton, submitting && styles.disabledButton]} onPress={onSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color={colors.textPrimary} /> : <Text style={styles.primaryButtonText}>Create</Text>}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' },
  card: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: colors.surface, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 34, shadowColor: colors.shadow, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.28, shadowRadius: 24, elevation: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  eyebrow: { color: colors.textSecondary, fontSize: 13, fontWeight: '800', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold', fontSize: 28, letterSpacing: -0.8 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: colors.textPrimary, fontSize: 28, lineHeight: 30, fontWeight: '300' },
  formGroup: { marginBottom: 18 },
  label: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 8 },
  input: { minHeight: 52, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  keyChoicesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyChoiceChip: {
    minHeight: 36,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyChoiceChipSelected: {
    backgroundColor: '#2E2A45',
    borderColor: '#8F6BFF',
  },
  keyChoiceText: {
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    lineHeight: 17,
  },
  keyChoiceTextSelected: {
    color: '#ECE7FF',
  },
  helperText: { color: colors.textSecondary, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, marginTop: 8 },
  errorText: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 2, marginBottom: 14 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  secondaryButton: { flex: 1, minHeight: 52, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  primaryButton: { flex: 1, minHeight: 52, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  disabledButton: { opacity: 0.6 },
})
