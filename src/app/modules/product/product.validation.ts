import { z } from 'zod';

const createProductZodSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name should be type string',
  }),
  brand: z.string({
    required_error: 'brand is required',
    invalid_type_error: 'brand should be type string',
  }),
  type: z.string({
    required_error: 'type is required',
    invalid_type_error: 'type should be type string',
  }),

  inspectionInterval: z.string({
    required_error: 'inspectionInterval is required',
    invalid_type_error: 'inspectionInterval should be type string',
  }),
  latestInspectionDate: z
    .string({
      invalid_type_error: 'latestInspectionDate should be type string',
    })
    .optional(),
  isActive: z.boolean({
    required_error: 'isActive is required',
    invalid_type_error: 'isActive should be type boolean',
  }),

  companyName: z.string({
    required_error: 'companyName is required',
    invalid_type_error: 'companyName should be type string',
  }),
  image: z.string({
    required_error: 'image is required',
    invalid_type_error: 'image should be type string',
  }),
  contactPerson: z.string({
    required_error: 'contactPerson is required',
    invalid_type_error: 'contactPerson should be type string',
  }),
});

const updateProductZodSchema = z.object({
  image: z
    .string({ invalid_type_error: 'image should be type string' })
    .optional(),
  name: z
    .string({ invalid_type_error: 'name should be type string' })
    .optional(),
  brand: z
    .string({ invalid_type_error: 'brand should be type string' })
    .optional(),
  type: z
    .string({ invalid_type_error: 'type should be type string' })
    .optional(),

  inspectionInterval: z
    .string({
      invalid_type_error: 'inspectionInterval should be type string',
    })
    .optional(),
  latestInspectionDate: z
    .string({
      invalid_type_error: 'latestInspectionDate should be type string',
    })
    .optional(),
  isActive: z
    .boolean({ invalid_type_error: 'isActive should be type boolean' })
    .optional(),
  companyName: z
    .string({ invalid_type_error: 'companyName should be type string' })
    .optional(),
  contactPerson: z
    .string({ invalid_type_error: 'contactPerson should be type string' })
    .optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
