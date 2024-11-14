import { z } from 'zod';

const createStepZodSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name should be type string',
  }),
  stepImage: z.string({
    required_error: 'stepImage is required',
    invalid_type_error: 'stepImage should be type string',
  }),
  product: z.string({
    required_error: 'product is required',
    invalid_type_error: 'product should be type objectID or string',
  }),
});

const updateStepZodSchema = z.object({
  name: z
    .string({ invalid_type_error: 'name should be type string' })
    .optional(),
  stepImage: z
    .string({
      invalid_type_error: 'stepImage should be type string',
    })
    .optional(),
  product: z
    .string({ invalid_type_error: 'product should be type ref=>Product' })
    .optional(),
});

export const StepValidation = {
  createStepZodSchema,
  updateStepZodSchema,
};
