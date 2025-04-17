import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_complete: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Task = z.infer<typeof TaskSchema>
