import { z } from 'zod';

const countrySchema = z.enum(['Russia', 'Belarus', 'Kazakhstan', 'Armenia', 'Uzbekistan']);

const postalCodeByCountry: Record<z.infer<typeof countrySchema>, RegExp> = {
  Russia: /^\d{6}$/,
  Belarus: /^\d{6}$/,
  Kazakhstan: /^\d{7}$/,
  Armenia: /^\d{4}$/,
  Uzbekistan: /^\d{6}$/,
};

const streetRegex = /^[\p{L}\s]+\s\d+[a-zA-Zа-яА-ЯёЁ0-9\-\/]*$/u;

const addressSchema = z
  .object({
    street: z
      .string()
      .min(3, 'Street and house is required')
      .regex(streetRegex, 'Format must be: street name + house number (e.g., Main 12k4)'),

    city: z.string().min(2, 'City is required'),

    country: countrySchema,

    postalCode: z.string().min(4).max(7),
  })
  .superRefine((data, ctx) => {
    const pattern = postalCodeByCountry[data.country];
    if (!pattern.test(data.postalCode)) {
      ctx.addIssue({
        path: ['postalCode'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid postal code for selected country',
      });
    }
  });

export const registrationSchema = z
  .object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    birthDate: z
      .string()
      .min(1, 'Required')
      .refine(
        (dateStr) => {
          const birthDate = new Date(dateStr);
          const today = new Date();
          today.setFullYear(today.getFullYear() - 14);
          return birthDate <= today;
        },
        {
          message: 'You must be at least 14 years old',
        },
      ),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Required'),
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
