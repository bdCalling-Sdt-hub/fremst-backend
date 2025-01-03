import { z } from 'zod';
import { USER_ROLES } from '../../../enums/user';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN]).optional(),
    password: z.string({ required_error: 'Password is required' }).min(8),
    companyName: z.string().optional(),
    profile: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
