import { z } from 'zod';

const createInspectionZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'product is required',
      invalid_type_error: 'product should be type objectID or string',
    }),
    customer: z.string({
      required_error: 'customer is required',
      invalid_type_error: 'customer should be type objectID or string',
    }),
    steps: z.array(
      z.string({
        required_error: 'steps is required',
        invalid_type_error: 'steps array item should have type string',
      })
    ),
  }),
});

const updateInspectionZodSchema = z.object({
  body: z.object({
    product: z
      .string({ invalid_type_error: 'product should be type string' })
      .optional(),
    customer: z
      .string({ invalid_type_error: 'customer should be type string' })
      .optional(),
    steps: z
      .array(
        z.string({
          invalid_type_error: 'steps array item should have type string',
        })
      )
      .optional(),
  }),
});

export const InspectionValidation = {
  createInspectionZodSchema,
  updateInspectionZodSchema,
};
