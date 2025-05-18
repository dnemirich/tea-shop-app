import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().trim().email({ message: 'Please enter a valid email (example@gmail.com)' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    rememberMe: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const { password } = val;

    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one lowercase letter',
      });
    }

    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/\d/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one number',
      });
    }

    if (/^\s|\s$/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must not have leading or trailing whitespace',
      });
    }
  });

export type FormValueType = z.infer<typeof loginSchema>;
