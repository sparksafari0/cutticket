
import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title cannot be more than 50 characters'),
  type: z.enum(['productions', 'samples', 'alterations', 'other']),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  referencePhotos: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
