import { useCallback, useState } from 'react'
import { useSongForm } from '../forms/use-song-form'
import type { SongFormValues } from '../forms/song-form.schema'
import type { CreateSongPayload } from './use-songs'

type UseCreateSongModalParams = {
  createSong: (payload: CreateSongPayload) => Promise<unknown>
  onCreated?: () => void
  onError?: (error: unknown) => void
}

const initialValues: SongFormValues = { title: '', defaultKeyId: null, numbering: '' }

export function useCreateSongModal({ createSong, onCreated, onError }: UseCreateSongModalParams) {
  const form = useSongForm(initialValues)
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const open = useCallback(() => {
    form.reset(initialValues)
    setVisible(true)
  }, [form])

  const close = useCallback(() => {
    if (submitting) return
    setVisible(false)
    form.reset(initialValues)
  }, [form, submitting])

  const submit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()
    const payload: CreateSongPayload = {
      title: values.title,
      defaultKeyId: values.defaultKeyId,
      numbering: values.numbering,
    }

    try {
      setSubmitting(true)
      await createSong(payload)
      setVisible(false)
      form.reset(initialValues)
      onCreated?.()
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }, [createSong, form, onCreated, onError])

  return {
    form,
    visible,
    submitting,
    open,
    close,
    submit,
  }
}
