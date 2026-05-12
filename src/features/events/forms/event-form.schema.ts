import { z } from 'zod'

export const eventFormSchema = z.object({
  name: z.string().trim().min(1, 'Event name is required').max(100, 'Event name is too long'),
  scheduledOn: z.date().nullable(),
  imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
})

export type EventFormValues = z.infer<typeof eventFormSchema>

