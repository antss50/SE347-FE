import { z } from 'zod';

export const ForgotPasswordRequestSchema = z.object({
  email: z.email('Invalid email format'),
});

export type ForgotPasswordRequestDto = z.infer<typeof ForgotPasswordRequestSchema>;

