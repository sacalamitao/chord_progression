import { z } from 'zod'

export const songFormSchema = z.object({
  title: z.string().trim().min(1, 'Song title is required').max(120, 'Song title is too long'),
  defaultKeyId: z.number().int().positive().nullable(),
})

export type SongFormValues = z.infer<typeof songFormSchema>

