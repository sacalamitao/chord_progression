import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import type { CreateEventFormValues, EventFormMode } from '../hooks/use-create-event-modal'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

type CreateEventModalProps = {
  visible: boolean
  mode: EventFormMode
  values: CreateEventFormValues
  datePickerVisible: boolean
  submitting: boolean
  validationError: string | null
  onChangeField: <Field extends keyof CreateEventFormValues>(field: Field, value: CreateEventFormValues[Field]) => void
  onOpenDatePicker: () => void
  onCloseDatePicker: () => void
  onSubmit: () => void
  onClose: () => void
}

function formatSelectedDate(value: Date | null) {
  if (!value) return 'Select event date'

  return value.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function CreateEventModal({ visible, mode, values, datePickerVisible, submitting, validationError, onChangeField, onOpenDatePicker, onCloseDatePicker, onSubmit, onClose }: CreateEventModalProps) {
  const pickerValue = values.scheduledOn ?? new Date()
  const isEditing = mode === 'edit'

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') onCloseDatePicker()
    if (event.type === 'dismissed') return
    if (selectedDate) onChangeField('scheduledOn', selectedDate)
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close create event modal" style={StyleSheet.absoluteFill} onPress={onClose} disabled={submitting} />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>{isEditing ? 'Update schedule' : 'New schedule'}</Text>
              <Text style={styles.title}>{isEditing ? 'Edit Event' : 'Add Event'}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.closeButton} onPress={onClose} disabled={submitting}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Event name</Text>
            <TextInput
              accessibilityLabel="Event name"
              autoCapitalize="words"
              editable={!submitting}
              onChangeText={(value) => onChangeField('name', value)}
              placeholder="Sunday Worship Night"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              style={styles.input}
              value={values.name}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Open event date picker" style={[styles.dateButton, submitting && styles.disabledButton]} onPress={onOpenDatePicker} disabled={submitting}>
              <View>
                <Text style={[styles.dateButtonText, !values.scheduledOn && styles.dateButtonPlaceholder]}>{formatSelectedDate(values.scheduledOn)}</Text>
                <Text style={styles.dateButtonHint}>Tap to choose a date</Text>
              </View>
              <Text style={styles.dateIcon}>
                <MaterialCommunityIcons name="calendar-month-outline" size={24} color={colors.textSecondary} />
              </Text>
            </Pressable>

            {datePickerVisible ? (
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode="date"
                onChange={onDateChange}
                value={pickerValue}
              />
            ) : null}

            <Text style={styles.helperText}>Optional. The selected date is saved to the backend schedule.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              accessibilityLabel="Event image URL"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
              keyboardType="url"
              onChangeText={(value) => onChangeField('imageUrl', value)}
              placeholder="https://example.com/event-banner.jpg"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              style={styles.input}
              value={values.imageUrl}
            />
            <Text style={styles.helperText}>Optional. Add a public image URL for Home hero card display.</Text>
          </View>

          {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}

          <View style={styles.actionsRow}>
            <Pressable accessibilityRole="button" style={[styles.secondaryButton, submitting && styles.disabledButton]} onPress={onClose} disabled={submitting}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.primaryButton, submitting && styles.disabledButton]} onPress={onSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color={colors.textPrimary} /> : <Text style={styles.primaryButtonText}>{isEditing ? 'Save' : 'Create'}</Text>}
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
  formGroup: { marginBottom: 16 },
  label: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 8 },
  input: { minHeight: 52, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  dateButton: { minHeight: 58, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  dateButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 16 },
  dateButtonPlaceholder: { color: colors.textMuted },
  dateButtonHint: { color: colors.textSecondary, fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 3 },
  dateIcon: { color: colors.textSecondary, fontSize: 18, fontWeight: '800' },
  helperText: { color: colors.textSecondary, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, marginTop: 8 },
  errorText: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 2, marginBottom: 14 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  secondaryButton: { flex: 1, minHeight: 52, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  primaryButton: { flex: 1, minHeight: 52, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  disabledButton: { opacity: 0.6 },
})
