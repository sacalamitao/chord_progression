import { useCallback, useState } from 'react'
import { useEventForm } from '../forms/use-event-form'
import type { EventFormValues } from '../forms/event-form.schema'
import type { CreateEventPayload, UpdateEventPayload } from './use-events'

import type { Event } from '../types'

type UseCreateEventModalParams = {
  createEvent: (payload: CreateEventPayload) => Promise<unknown>
  updateEvent: (id: number, payload: UpdateEventPayload) => Promise<unknown>
  onCreated?: () => void
  onUpdated?: () => void
  onError?: (error: unknown) => void
}

export type EventFormMode = 'create' | 'edit'

const initialValues: EventFormValues = { name: '', scheduledOn: null, imageUrl: '' }

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
  const form = useEventForm(initialValues)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<EventFormMode>('create')
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const open = useCallback(() => {
    setMode('create')
    setEditingEventId(null)
    form.reset(initialValues)
    setVisible(true)
  }, [form])

  const openEdit = useCallback((event: Event) => {
    setMode('edit')
    setEditingEventId(event.id)
    form.reset({
      name: event.name,
      scheduledOn: fromDateOnlyString(event.scheduled_on),
      imageUrl: event.image_url ?? '',
    })
    setDatePickerVisible(false)
    setVisible(true)
  }, [form])

  const close = useCallback(() => {
    if (submitting) return

    setVisible(false)
    setDatePickerVisible(false)
    setMode('create')
    setEditingEventId(null)
    form.reset(initialValues)
  }, [form, submitting])

  const openDatePicker = useCallback(() => {
    if (submitting) return
    setDatePickerVisible(true)
  }, [submitting])

  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false)
  }, [])

  const submit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()
    const payload: CreateEventPayload = {
      name: values.name,
      scheduledOn: toDateOnlyString(values.scheduledOn),
      imageUrl: values.imageUrl,
    }

    try {
      setSubmitting(true)

      if (mode === 'edit') {
        if (!editingEventId) throw new Error('Event id is required')
        await updateEvent(editingEventId, payload)
      } else {
        await createEvent(payload)
      }

      setVisible(false)
      setDatePickerVisible(false)
      setMode('create')
      setEditingEventId(null)
      form.reset(initialValues)
      if (mode === 'edit') onUpdated?.()
      else onCreated?.()
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }, [createEvent, editingEventId, form, mode, onCreated, onError, onUpdated, updateEvent])

  return {
    form,
    visible,
    mode,
    datePickerVisible,
    submitting,
    open,
    openEdit,
    close,
    openDatePicker,
    closeDatePicker,
    submit,
  }
}
