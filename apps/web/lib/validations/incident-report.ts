import { z } from 'zod';

// Validation schema for incident report form
export const IncidentReportSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),

  location: z.object({
    latitude: z
      .number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
      .number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180'),
  }),

  category: z
    .enum(['kidnapping', 'suspicious', 'road-block', 'other']),

  contact: z
    .object({
      type: z.enum(['phone', 'email']).optional(),
      value: z.string().optional(),
    })
    .optional()
    .refine((val) => {
      if (!val || !val.value) return true;
      const phoneRegex = /^\+234[0-9]{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return phoneRegex.test(val.value) || emailRegex.test(val.value);
    }, 'Invalid phone or email format'),

  photos: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(5242880, 'Photo must not exceed 5MB'),
        type: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Only JPEG, PNG, GIF, WebP allowed'),
      })
    )
    .max(5, 'Maximum 5 photos allowed')
    .optional(),
});

export type IncidentReport = z.infer<typeof IncidentReportSchema>;

export function validateIncidentReport(data: unknown) {
  const result = IncidentReportSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten(),
    };
  }
  return { success: true, data: result.data };
}
