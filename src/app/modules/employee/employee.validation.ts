import { z } from 'zod';
        
  const createEmployeeZodSchema = z.object({
    body: z.object({
      name: z.string({ required_error:"name is required", invalid_type_error:"name should be type string" }),
      company: z.string({ required_error:"company is required", invalid_type_error:"company should be type objectID or string" })
    }),
  });
  
  const updateEmployeeZodSchema = z.object({
    body: z.object({
      name: z.string({ invalid_type_error:"name should be type string" }).optional(),
      company: z.string({ invalid_type_error:"company should be type string" }).optional()
    }),
  });
  
  export const EmployeeValidation = {
    createEmployeeZodSchema,
    updateEmployeeZodSchema
  };
