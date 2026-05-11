import { useCallback, useState } from 'react'

type UseCreateSongModalParams = {
  createSong: (title: string, defaultKeyId: number | null) => Promise<unknown>
  onCreated?: () => void
  onError?: (error: unknown) => void
}

export type CreateSongFormValues = {
  title: string
  defaultKeyId: number | null
}

const initialValues: CreateSongFormValues = {
  title: '',
  defaultKeyId: null,
}

export function useCreateSongModal({ createSong, onCreated, onError }: UseCreateSongModalParams) {
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState<CreateSongFormValues>(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const open = useCallback(() => {
    setValues(initialValues)
    setValidationError(null)
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    if (submitting) return
    setVisible(false)
    setValues(initialValues)
    setValidationError(null)
  }, [submitting])

  const updateField = useCallback(
    <Field extends keyof CreateSongFormValues>(field: Field, value: CreateSongFormValues[Field]) => {
      setValues((currentValues) => ({ ...currentValues, [field]: value }))
      if (validationError) setValidationError(null)
    },
    [validationError]
  )

  const submit = useCallback(async () => {
    const trimmed = values.title.trim()

    if (!trimmed) {
      setValidationError('Song title is required.')
      return
    }

    try {
      setSubmitting(true)
      setValidationError(null)
      await createSong(trimmed, values.defaultKeyId)
      setVisible(false)
      setValues(initialValues)
      onCreated?.()
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }, [createSong, onCreated, onError, values.defaultKeyId, values.title])

  return {
    visible,
    values,
    submitting,
    validationError,
    open,
    close,
    updateField,
    submit,
  }
}
