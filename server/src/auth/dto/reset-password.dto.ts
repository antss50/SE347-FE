import { z } from 'zod';

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ResetPasswordRequestDto = z.infer<typeof ResetPasswordRequestSchema>;

