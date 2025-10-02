import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  RegisterRequestDto, 
  RegisterRequestSchema,
} from './dto/register.dto';
import { 
  LoginRequestDto, 
  LoginRequestSchema,
} from './dto/login.dto';
import { 
  ForgotPasswordRequestDto, 
  ForgotPasswordRequestSchema 
} from './dto/forgot-password.dto';
import { 
  ResetPasswordRequestDto, 
  ResetPasswordRequestSchema 
} from './dto/reset-password.dto';
import { 
  VerifyEmailRequestDto, 
  VerifyEmailRequestSchema 
} from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterRequestDto) {
    console.log('Register request:', body);
    const validatedData = RegisterRequestSchema.parse(body);
    const result = await this.authService.register(validatedData);
    console.log('Register result:', result);
    return {
      message: 'Registration successful',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto) {
    const validatedData = LoginRequestSchema.parse(body);
    const result = await this.authService.login(validatedData);
    
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
    const validatedData = ForgotPasswordRequestSchema.parse(body);
    await this.authService.forgotPassword(validatedData);
    
    return {
      message: 'Password reset code has been sent to your email',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordRequestDto) {
    const validatedData = ResetPasswordRequestSchema.parse(body);
    await this.authService.resetPassword(validatedData);
    
    return {
      message: 'Password has been reset successfully',
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: VerifyEmailRequestDto) {
    const validatedData = VerifyEmailRequestSchema.parse(body);
    await this.authService.verifyEmail(validatedData);
    
    return {
      message: 'Email verified successfully',
    };
  }
}
