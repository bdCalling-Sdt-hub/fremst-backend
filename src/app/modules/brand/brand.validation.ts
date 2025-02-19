import { z } from 'zod';

const createBrandZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
      invalid_type_error: 'name should be type string',
    }),
  }),
});

const updateBrandZodSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'name should be type string' })
      .optional(),
  }),
});

export const BrandValidation = {
  createBrandZodSchema,
  updateBrandZodSchema,
};
