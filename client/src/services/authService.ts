import { apiClient } from '../../../libs/axios';
import { RegisterResponse, LoginResponse, ApiResponse } from '../types/auth.types';
import { RegisterFormSchema, LoginSchema } from '../../../libs/validators/auth';
import axios from 'node_modules/axios/index.cjs';
// Đăng ký 
export const registerUser = (data: Omit<RegisterFormSchema, 'confirmPassword' | 'acceptTerms'>) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/register', data);

// Đăng nhập 
export const loginUser = (credentials: Pick<LoginSchema, 'email' | 'password'>) =>
    apiClient.post<ApiResponse<LoginResponse>>('/login', credentials);

// Quên mật khẩu [cite: 294]


// Gửi lại email xác thực


// 5. Xác thực email [cite: 316]
