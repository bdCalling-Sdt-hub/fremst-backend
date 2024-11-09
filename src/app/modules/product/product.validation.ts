import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    sku: z.string({
      required_error: 'sku is required',
      invalid_type_error: 'sku should be type string',
    }),
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
    serialNo: z.string({
      required_error: 'serialNo is required',
      invalid_type_error: 'serialNo should be type string',
    }),
    enStandard: z.string({
      required_error: 'enStandard is required',
      invalid_type_error: 'enStandard should be type string',
    }),
    inspectionInterval: z.number({
      required_error: 'inspectionInterval is required',
      invalid_type_error: 'inspectionInterval should be type number',
    }),
    latestInspectionDate: z.date({
      required_error: 'latestInspectionDate is required',
      invalid_type_error: 'latestInspectionDate should be type date',
    }),
    isActive: z.boolean({
      required_error: 'isActive is required',
      invalid_type_error: 'isActive should be type boolean',
    }),
    inspectionHistory: z.array(
      z.string({
        required_error: 'inspectionHistory is required',
        invalid_type_error:
          'inspectionHistory array item should have type string',
      })
    ),
    companyName: z.string({
      required_error: 'companyName is required',
      invalid_type_error: 'companyName should be type string',
    }),
    contactPerson: z.string({
      required_error: 'contactPerson is required',
      invalid_type_error: 'contactPerson should be type string',
    }),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    sku: z
      .string({ invalid_type_error: 'sku should be type string' })
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
    serialNo: z
      .string({ invalid_type_error: 'serialNo should be type string' })
      .optional(),
    enStandard: z
      .string({ invalid_type_error: 'enStandard should be type string' })
      .optional(),
    inspectionInterval: z
      .number({
        invalid_type_error: 'inspectionInterval should be type number',
      })
      .optional(),
    latestInspectionDate: z
      .date({ invalid_type_error: 'latestInspectionDate should be type date' })
      .optional(),
    isActive: z
      .boolean({ invalid_type_error: 'isActive should be type boolean' })
      .optional(),
    inspectionHistory: z
      .array(
        z.string({
          invalid_type_error:
            'inspectionHistory array item should have type string',
        })
      )
      .optional(),
    companyName: z
      .string({ invalid_type_error: 'companyName should be type string' })
      .optional(),
    contactPerson: z
      .string({ invalid_type_error: 'contactPerson should be type string' })
      .optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
