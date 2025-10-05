import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { LoginRequestDto, LoginResponseDto, UserDto } from './dto/login.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.dto';
import { VerifyEmailRequestDto } from './dto/verify-email.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });


    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);


    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        phoneNumber: data.phone_number,
        fullName: data.full_name || '',
        identityNumber: data.identity_number,
        userType: data.user_type || 'individual',
        taxId: data.tax_id,
      },
    });
    // TODO: Send verification email

    return {
      user_id: user.id,
      email: user.email,
      verification_required: true,
    };
  }

  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.isBanned) {
      throw new BadRequestException('Account is banned');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = 'token123';
    const refreshToken = 'tokenabc';

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      phone_number: user.phoneNumber || '',
      full_name: user.fullName,
      identity_number: user.identityNumber || '',
      user_type: user.userType,
      avatar_url: user.avatarUrl || '',
      is_verified: user.isVerified,
      rating_score: Number(user.ratingScore),
      total_ratings: user.totalRatings,
      created_at: user.createdAt.toISOString(),
    };

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
      user: userDto,
    };
  }

  async forgotPassword(data: ForgotPasswordRequestDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

  }

  async resetPassword(data: ResetPasswordRequestDto): Promise<void> {
    // TODO: Reset password
    console.log('Reset password for token:', data.token);
  }

  async verifyEmail(data: VerifyEmailRequestDto): Promise<void> {
    // TODO: Verify token and get user
    // For now, just mock the implementation
    
    // TODO: Update user email verification status
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { 
    //     isVerified: true,
    //     emailVerifiedAt: new Date(),
    //   },
    // });
    
    console.log('Verify email for token:', data.token);
  }
}
