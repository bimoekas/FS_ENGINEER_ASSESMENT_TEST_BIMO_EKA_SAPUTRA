import { z } from 'zod'

export const TaskFormSchema = z.object({
  title: z.string().min(1, { message: 'Title required!' }),
})

export type TaskForm = z.infer<typeof TaskFormSchema>