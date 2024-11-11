import { z } from 'zod';

const createQuestionZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'product is required',
      invalid_type_error: 'product should be type objectID or string',
    }),
    question: z.string({
      required_error: 'question is required',
      invalid_type_error: 'question should be type string',
    }),
    answer: z.string({
      required_error: 'answer is required',
      invalid_type_error: 'answer should be type string',
    }),
    isYes: z.boolean({
      required_error: 'isYes is required',
      invalid_type_error: 'isYes should be type boolean',
    }),
  }),
});

const updateQuestionZodSchema = z.object({
  body: z.object({
    product: z
      .string({ invalid_type_error: 'product should be type ref=>Product' })
      .optional(),
    question: z
      .string({ invalid_type_error: 'question should be type string' })
      .optional(),
    answer: z
      .string({ invalid_type_error: 'answer should be type string' })
      .optional(),
    isYes: z
      .boolean({ invalid_type_error: 'isYes should be type boolean' })
      .optional(),
  }),
});

export const QuestionValidation = {
  createQuestionZodSchema,
  updateQuestionZodSchema,
};
