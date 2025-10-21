import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<any> {
    const { accessToken, ...authResponse } = await this.authService.signUp(signUpDto);

    // Set JWT token in secure cookie
    this.setAuthCookie(res, accessToken);

    return res.json({
      message: 'User created successfully',
      user: authResponse,
    });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response): Promise<any> {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const { accessToken, ...authResponse } = await this.authService.signIn(signInDto);

    // Set JWT token in secure cookie
    this.setAuthCookie(res, accessToken);

    return res.json({
      message: 'Signed in successfully',
      user: authResponse,
    });
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Res() res: Response): Promise<any> {
    // Clear authentication cookie
    res.clearCookie('access_token', {
      httpOnly: this.configService.get<boolean>('COOKIE_HTTP_ONLY', true),
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: this.configService.get<any>('COOKIE_SAME_SITE', 'lax'),
    });

    return res.json({
      message: 'Signed out successfully',
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: any): Promise<AuthResponseDto> {
    const user = await this.authService.getCurrentUser(req.user.userId);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      accessToken: '', // Don't send token in response
    };
  }

  private setAuthCookie(res: Response, token: string): void {
    const cookieOptions = {
      httpOnly: this.configService.get<boolean>('COOKIE_HTTP_ONLY', true),
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
      sameSite: this.configService.get<any>('COOKIE_SAME_SITE', 'lax') as 'strict' | 'lax' | 'none',
      maxAge: this.configService.get<number>('COOKIE_MAX_AGE', 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    res.cookie('access_token', token, cookieOptions);
  }
}
