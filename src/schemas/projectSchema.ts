
import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['alterations', 'samples', 'productions', 'other'] as const),
  status: z.enum(['not_started', 'in_progress', 'completed'] as const),
  dueDate: z.date(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
