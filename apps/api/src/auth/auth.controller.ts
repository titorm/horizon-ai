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
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<any> {
    try {
      const { accessToken, ...authResponse } = await this.authService.signUp(signUpDto);

      // Set JWT token in secure cookie
      this.setAuthCookie(res, accessToken);

      return res.json({
        message: 'User created successfully',
        user: authResponse,
      });
    } catch (error) {
      this.logger.error(
        `Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response): Promise<any> {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const { accessToken, ...authResponse } = await this.authService.signIn(signInDto);

      // Set JWT token in secure cookie
      this.setAuthCookie(res, accessToken);

      return res.json({
        message: 'Signed in successfully',
        user: authResponse,
      });
    } catch (error) {
      this.logger.error(`Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
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
    try {
      const user = await this.authService.getCurrentUser(req.user.userId);

      // Parse name into firstName/lastName
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || undefined;

      return {
        id: user.$id,
        email: user.email,
        firstName,
        lastName,
        accessToken: '', // Don't send token in response
      };
    } catch (error) {
      this.logger.error(`Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
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
