import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type CreateKeyFormValues = {
  name: string
  degreeChords: Record<string, string>
}

type CreateKeyModalProps = {
  visible: boolean
  values: CreateKeyFormValues
  submitting: boolean
  validationError: string | null
  onChangeName: (value: string) => void
  onChangeDegreeChord: (degree: string, value: string) => void
  onSubmit: () => void
  onClose: () => void
}

const degrees = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export function CreateKeyModal({ visible, values, submitting, validationError, onChangeName, onChangeDegreeChord, onSubmit, onClose }: CreateKeyModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close create key modal" style={StyleSheet.absoluteFill} onPress={onClose} disabled={submitting} />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>New key mapping</Text>
              <Text style={styles.title}>Add Key</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.closeButton} onPress={onClose} disabled={submitting}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Key name</Text>
              <TextInput
                accessibilityLabel="Key name"
                editable={!submitting}
                onChangeText={onChangeName}
                placeholder="G Major"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={values.name}
              />
            </View>

            <View style={styles.grid}>
              {degrees.map((degree) => (
                <View key={degree} style={styles.degreeItem}>
                  <Text style={styles.degreeLabel}>Degree {degree}</Text>
                  <TextInput
                    accessibilityLabel={`Degree ${degree} chord`}
                    autoCapitalize="none"
                    editable={!submitting}
                    onChangeText={(value) => onChangeDegreeChord(degree, value)}
                    placeholder={degree}
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    value={values.degreeChords[degree] ?? ''}
                  />
                </View>
              ))}
            </View>

            {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}
          </ScrollView>

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
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' },
  card: { maxHeight: '88%', borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  eyebrow: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold', fontSize: 26, marginTop: 2 },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: colors.textPrimary, fontFamily: 'Inter_500Medium', fontSize: 26, lineHeight: 28 },
  formScroll: { maxHeight: 460 },
  formContent: { paddingBottom: 6 },
  formGroup: { marginBottom: 12 },
  label: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 13, marginBottom: 6 },
  input: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceElevated, color: colors.textPrimary, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  degreeItem: { width: '48%' },
  degreeLabel: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 11, marginBottom: 5 },
  errorText: { color: colors.danger, fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryButton: { flex: 1, minHeight: 46, borderRadius: 12, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  primaryButton: { flex: 1, minHeight: 46, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  disabledButton: { opacity: 0.6 },
})
