import { z } from 'zod';

const createProductZodSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name should be type string',
  }),

  type: z
    .string({
      invalid_type_error: 'type should be type string',
    })
    .optional(),

  image: z
    .string({
      invalid_type_error: 'image should be type string',
    })
    .optional(),
});

const updateProductZodSchema = z.object({
  image: z
    .string({ invalid_type_error: 'image should be type string' })
    .optional(),
  name: z
    .string({ invalid_type_error: 'name should be type string' })
    .optional(),
  type: z
    .boolean({ invalid_type_error: 'type should be type string' })
    .optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
