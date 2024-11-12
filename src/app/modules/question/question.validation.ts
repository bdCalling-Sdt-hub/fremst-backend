import { z } from 'zod';

const createQuestionZodSchema = z.object({
  body: z.object({
    category: z.string({
      required_error: 'questionCategory is required',
      invalid_type_error: 'questionCategory should be type objectID or string',
    }),
    product: z.string({
      required_error: 'product is required',
      invalid_type_error: 'product should be type objectID or string',
    }),
    question: z.string({
      required_error: 'question is required',
      invalid_type_error: 'question should be type string',
    }),
    isComment: z.boolean({
      required_error: 'isComment is required',
      invalid_type_error: 'isComment should be type boolean',
    }),
  }),
});

const updateQuestionZodSchema = z.object({
  body: z.object({
    category: z
      .string({ invalid_type_error: 'questionCategory should be type string' })
      .optional(),
    product: z
      .string({ invalid_type_error: 'product should be type string' })
      .optional(),
    question: z
      .string({ invalid_type_error: 'question should be type string' })
      .optional(),
    isComment: z
      .boolean({
        invalid_type_error: 'isComment should be type boolean',
      })
      .optional(),
  }),
});

export const QuestionValidation = {
  createQuestionZodSchema,
  updateQuestionZodSchema,
};
