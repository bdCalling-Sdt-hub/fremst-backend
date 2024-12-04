import { z } from 'zod';

const createInspectionZodSchema = z.object({
  product: z.string({
    required_error: 'product is required',
    invalid_type_error: 'product should be type objectID or string',
  }),
  customer: z.string({
    required_error: 'customer is required',
    invalid_type_error: 'customer should be type objectID or string',
  }),
  sku: z.string({
    required_error: 'sku is required',
    invalid_type_error: 'sku should be type string',
  }),
  enStandard: z.string({
    required_error: 'enStandard is required',
    invalid_type_error: 'enStandard should be type string',
  }),
  serialNo: z.string({
    required_error: 'serialNo is required',
    invalid_type_error: 'serialNo should be type string',
  }),
  step: z.array(
    z.object({
      name: z.string({
        required_error: 'name is required',
        invalid_type_error: 'name should be type string',
      }),
      answers: z.array(
        z.object({
          question: z.string({
            required_error: 'question is required',
            invalid_type_error: 'question should be type objectID or string',
          }),
          comment: z.string({
            required_error: 'comment is required',
            invalid_type_error: 'comment should be type string',
          }),
          isYes: z.boolean({
            required_error: 'isYes is required',
            invalid_type_error: 'isYes should be type boolean',
          }),
        })
      ),
    })
  ),
  summery: z.string({
    required_error: 'summery is required',
    invalid_type_error: 'summery should be type string',
  }),
  isApproved: z.boolean({
    required_error: 'isApproved is required',
    invalid_type_error: 'isApproved should be type boolean',
  }),
  lastInspectionDate: z.string({
    required_error: 'lastInspectionDate is required',
    invalid_type_error: 'lastInspectionDate should be type string',
  }),
  nextInspectionDate: z.string({
    required_error: 'nextInspectionDate is required',
    invalid_type_error: 'nextInspectionDate should be type date',
  }),
  isActive: z
    .boolean({
      invalid_type_error: 'isActive should be type boolean',
    })
    .optional(),
});
const updateInspectionZodSchema = z.object({
  product: z
    .string({
      invalid_type_error: 'product should be type objectID or string',
    })
    .optional(),
  customer: z
    .string({
      invalid_type_error: 'customer should be type objectID or string',
    })
    .optional(),
  sku: z.string({ invalid_type_error: 'sku should be type string' }).optional(),
  enStandard: z
    .string({
      invalid_type_error: 'enStandard should be type string',
    })
    .optional(),
  serialNo: z
    .string({
      invalid_type_error: 'serialNo should be type string',
    })
    .optional(),
  step: z
    .array(
      z.object({
        name: z.string({ invalid_type_error: 'name should be type string' }),
        answers: z.array(
          z.object({
            question: z
              .string({
                invalid_type_error: 'question should be type string',
              })
              .optional(),
            comment: z
              .string({ invalid_type_error: 'comment should be type string' })
              .optional(),
            isYes: z
              .boolean({ invalid_type_error: 'isYes should be type boolean' })
              .optional(),
          })
        ),
      })
    )
    .optional(),
  summery: z
    .string({ invalid_type_error: 'summery should be type string' })
    .optional(),
  isApproved: z
    .boolean({ invalid_type_error: 'isApproved should be type boolean' })
    .optional(),
  lastInspectionDate: z
    .string({ invalid_type_error: 'lastInspectionDate should be type date' })
    .optional(),
  nextInspectionDate: z
    .string({
      invalid_type_error: 'nextInspectionDate should be type string',
    })
    .optional(),
  isActive: z
    .boolean({
      invalid_type_error: 'isActive should be type boolean',
    })
    .optional(),
});
export const InspectionValidation = {
  createInspectionZodSchema,
  updateInspectionZodSchema,
};
