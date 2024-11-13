import { z } from 'zod';

const createAnswerZodSchema = z.object({
  body: z.object({
    question: z.string({
      required_error: 'question is required',
      invalid_type_error: 'question should be type objectID or string',
    }),
    comment: z
      .string({ invalid_type_error: 'comment should be type string' })
      .optional(),
    isYes: z.boolean({
      required_error: 'isYes is required',
      invalid_type_error: 'isYes should be type boolean',
    }),
  }),
});

const updateAnswerZodSchema = z.object({
  body: z.object({
    question: z
      .string({ invalid_type_error: 'question should be type ref=>Question' })
      .optional(),
    comment: z
      .string({ invalid_type_error: 'comment should be type string' })
      .optional(),
    isYes: z
      .boolean({ invalid_type_error: 'isYes should be type boolean' })
      .optional(),
  }),
});

export const AnswerValidation = {
  createAnswerZodSchema,
  updateAnswerZodSchema,
};
