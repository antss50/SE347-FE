import apiClient from '@auction-hub/axios';

import { RegisterResponse, LoginResponse, ApiResponse } from '../types/auth.types';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RegisterFormSchema, LoginSchema } from '../../../libs/validators/auth';
// Đăng ký 
export const registerUser = (data: Omit<RegisterFormSchema, 'confirmPassword' | 'acceptTerms'>) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);

// Đăng nhập 
export const loginUser = (credentials: Pick<LoginSchema, 'email' | 'password'>) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
