import { z } from 'zod';
export const CustomerValidation = {
  createCustomerZodSchema: z.object({
    body: z.object({
      companyName: z.string({
        required_error: 'companyName is required',
        invalid_type_error: 'companyName should be type string',
      }),
      companyPhone: z.string({
        required_error: 'companyPhone is required',
        invalid_type_error: 'companyPhone should be type string',
      }),
      contactPerson: z.string({
        required_error: 'contactPerson is required',
        invalid_type_error: 'contactPerson should be type string',
      }),
      email: z.string({
        required_error: 'email is required',
        invalid_type_error: 'email should be type string',
      }),
      phone: z.string({
        required_error: 'phone is required',
        invalid_type_error: 'phone should be type string',
      }),
      address: z.string({
        required_error: 'address is required',
        invalid_type_error: 'address should be type string',
      }),
    }),
  }),
  updateCustomerZodSchema: z.object({
    body: z.object({
      companyName: z
        .string({ invalid_type_error: 'companyName should be type string' })
        .optional(),
      companyPhone: z
        .string({ invalid_type_error: 'companyPhone should be type string' })
        .optional(),
      contactPerson: z
        .string({ invalid_type_error: 'contactPerson should be type string' })
        .optional(),
      email: z
        .string({ invalid_type_error: 'email should be type string' })
        .optional(),
      phone: z
        .string({ invalid_type_error: 'phone should be type string' })
        .optional(),
      address: z
        .string({ invalid_type_error: 'address should be type string' })
        .optional(),
    }),
  }),
};
