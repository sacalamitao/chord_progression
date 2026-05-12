import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { songFormSchema, type SongFormValues } from './song-form.schema'

export function useSongForm(initialValues?: Partial<SongFormValues>): UseFormReturn<SongFormValues, unknown, SongFormValues> {
  return useForm<SongFormValues, unknown, SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      title: '',
      defaultKeyId: null,
      numbering: '',
      ...initialValues,
    },
  })
}
