import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export class UserDto {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  identity_number: string;
  user_type: 'individual' | 'business';
  avatar_url: string;
  is_verified: boolean;
  rating_score: number;
  total_ratings: number;
  created_at: string;
}

export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserDto;
}

