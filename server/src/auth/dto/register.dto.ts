import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone_number: z.string().optional(),
  full_name: z.string().optional(),
  identity_number: z.string().optional(),
  user_type: z.enum(['individual', 'business']).optional(),
  tax_id: z.string().nullable().optional(),
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export class RegisterResponseDto {
  user_id: string;
  email: string;
  verification_required: boolean;
}

