import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { songFormSchema, type SongFormValues } from './song-form.schema'

export function useSongForm(initialValues?: Partial<SongFormValues>) {
  return useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      title: '',
      defaultKeyId: null,
      ...initialValues,
    },
  })
}

