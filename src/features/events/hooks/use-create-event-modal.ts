import { useCallback, useState } from 'react'

import type { Event } from '../types'

type UseCreateEventModalParams = {
  createEvent: (name: string, scheduledOn?: string | null, imageUrl?: string | null) => Promise<unknown>
  updateEvent: (id: number, name: string, scheduledOn?: string | null, imageUrl?: string | null) => Promise<unknown>
  onCreated?: () => void
  onUpdated?: () => void
  onError?: (error: unknown) => void
}

export type EventFormMode = 'create' | 'edit'

export type CreateEventFormValues = {
  name: string
  scheduledOn: Date | null
  imageUrl: string
}

const initialValues: CreateEventFormValues = {
  name: '',
  scheduledOn: null,
  imageUrl: '',
}

function toDateOnlyString(value: Date | null) {
  if (!value) return null

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function fromDateOnlyString(value: string | null) {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

export function useCreateEventModal({ createEvent, updateEvent, onCreated, onUpdated, onError }: UseCreateEventModalParams) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<EventFormMode>('create')
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [values, setValues] = useState<CreateEventFormValues>(initialValues)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const open = useCallback(() => {
    setMode('create')
    setEditingEventId(null)
    setValues(initialValues)
    setVisible(true)
    setValidationError(null)
  }, [])

  const openEdit = useCallback((event: Event) => {
    setMode('edit')
    setEditingEventId(event.id)
    setValues({
      name: event.name,
      scheduledOn: fromDateOnlyString(event.scheduled_on),
      imageUrl: event.image_url ?? '',
    })
    setDatePickerVisible(false)
    setVisible(true)
    setValidationError(null)
  }, [])

  const close = useCallback(() => {
    if (submitting) return

    setVisible(false)
    setDatePickerVisible(false)
    setMode('create')
    setEditingEventId(null)
    setValues(initialValues)
    setValidationError(null)
  }, [submitting])

  const openDatePicker = useCallback(() => {
    if (submitting) return
    setDatePickerVisible(true)
  }, [submitting])

  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false)
  }, [])

  const updateField = useCallback(<Field extends keyof CreateEventFormValues>(field: Field, value: CreateEventFormValues[Field]) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    if (validationError) setValidationError(null)
  }, [validationError])

  const submit = useCallback(async () => {
    const trimmedName = values.name.trim()

    if (!trimmedName) {
      setValidationError('Event name is required.')
      return
    }

    try {
      setSubmitting(true)
      setValidationError(null)
      const scheduledOn = toDateOnlyString(values.scheduledOn)

      if (mode === 'edit') {
        if (!editingEventId) throw new Error('Event id is required')
        await updateEvent(editingEventId, trimmedName, scheduledOn, values.imageUrl)
      } else {
        await createEvent(trimmedName, scheduledOn, values.imageUrl)
      }

      setVisible(false)
      setDatePickerVisible(false)
      setMode('create')
      setEditingEventId(null)
      setValues(initialValues)
      if (mode === 'edit') onUpdated?.()
      else onCreated?.()
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }, [createEvent, editingEventId, mode, onCreated, onError, onUpdated, updateEvent, values.imageUrl, values.name, values.scheduledOn])

  return {
    visible,
    mode,
    values,
    datePickerVisible,
    submitting,
    validationError,
    open,
    openEdit,
    close,
    openDatePicker,
    closeDatePicker,
    updateField,
    submit,
  }
}
