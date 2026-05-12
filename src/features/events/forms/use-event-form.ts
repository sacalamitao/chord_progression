import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { eventFormSchema, type EventFormValues } from './event-form.schema'

export function useEventForm(initialValues?: Partial<EventFormValues>) {
  return useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      scheduledOn: null,
      imageUrl: '',
      ...initialValues,
    },
  })
}

