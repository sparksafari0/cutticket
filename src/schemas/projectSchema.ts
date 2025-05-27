
import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title cannot be more than 50 characters'),
  styleNumber: z.string().optional(),
  type: z.enum(['productions', 'samples', 'alterations', 'other']),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  referencePhotos: z.array(z.string()).optional(),
  pickedUp: z.boolean().default(false),
  fabricSelfImage: z.string().optional(),
  fabricSelfText: z.string().optional(),
  fabricCombo1Image: z.string().optional(),
  fabricCombo1Text: z.string().optional(),
  fabricCombo2Image: z.string().optional(),
  fabricCombo2Text: z.string().optional(),
  fabricLiningImage: z.string().optional(),
  fabricLiningText: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
