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
  }),
});
const updateInspectionZodSchema = z.object({
  body: z.object({
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
  }),
});
export const InspectionValidation = {
  createInspectionZodSchema,
  updateInspectionZodSchema,
};
