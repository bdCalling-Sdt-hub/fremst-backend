import { z } from 'zod';

const createOldInspectionZodSchema = z.object({
  customer: z.string({
    required_error: 'customer is required',
    invalid_type_error: 'customer should be type objectID or string',
  }),
  product: z.string({
    required_error: 'product is required',
    invalid_type_error: 'product should be type objectID or string',
  }),
  lastInspectionDate: z.string({
    required_error: 'inspectionDate is required',
    invalid_type_error: 'inspectionDate should be type string',
  }),
  pdfReport: z.string({
    required_error: 'pdfReport is required',
    invalid_type_error: 'pdfReport should be type string',
  }),
});

const updateOldInspectionZodSchema = z.object({
  customer: z
    .string({ invalid_type_error: 'customer should be type string' })
    .optional(),
  product: z
    .string({ invalid_type_error: 'product should be type string' })
    .optional(),
  inspectionDate: z
    .string({ invalid_type_error: 'inspectionDate should be type string' })
    .optional(),
  pdfReport: z
    .string({ invalid_type_error: 'pdfReport should be type string' })
    .optional(),
});

export const OldInspectionValidation = {
  createOldInspectionZodSchema,
  updateOldInspectionZodSchema,
};
