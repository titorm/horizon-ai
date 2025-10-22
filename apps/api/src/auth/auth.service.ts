import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { getAppwriteAccount, generateId } from '@/appwrite/appwrite.client';
import { AppwriteException, ID } from 'node-appwrite';

interface AppwriteUser {
  $id: string;
  email: string;
  name: string;
  prefs?: Record<string, any>;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signUpDto;

    this.logger.log(`Sign up attempt for email: ${email}`);

    try {
      const account = getAppwriteAccount();

      // Create user in Appwrite
      const userId = generateId();
      const name = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];

      const user = await account.create(userId, email, password, name);

      this.logger.log(`User created successfully: ${user.$id}`);

      // Note: Appwrite preferences are updated per session, not per user account
      // For now, we'll store firstName/lastName in the name field

      // Generate JWT token
      const accessToken = this.generateAccessToken({
        $id: user.$id,
        email: user.email,
        name: user.name,
        prefs: { firstName, lastName },
      });

      return {
        id: user.$id,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        accessToken,
      };
    } catch (error) {
      if (error instanceof AppwriteException) {
        this.logger.warn(`Sign up failed: ${error.message} - ${email}`);

        // Check for duplicate email
        if (error.code === 409 || (error.message.includes('user') && error.message.includes('already exists'))) {
          throw new ConflictException('Email already in use');
        }

        throw new ConflictException(error.message);
      }

      this.logger.error(`Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    this.logger.log(`Sign in attempt for email: ${email}`);

    try {
      const account = getAppwriteAccount();

      // Create email session in Appwrite
      const session = await account.createEmailPasswordSession(email, password);

      // Get user details
      const user = await account.get();

      this.logger.log(`User signed in successfully: ${user.$id}`);

      // Parse name into firstName/lastName
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || undefined;

      // Generate JWT token
      const accessToken = this.generateAccessToken({
        $id: user.$id,
        email: user.email,
        name: user.name,
        prefs: user.prefs || {},
      });

      return {
        id: user.$id,
        email: user.email,
        firstName,
        lastName,
        accessToken,
      };
    } catch (error) {
      if (error instanceof AppwriteException) {
        this.logger.warn(`Sign in failed: ${error.message} - ${email}`);

        // Invalid credentials
        if (error.code === 401) {
          throw new UnauthorizedException('Invalid email or password');
        }

        throw new UnauthorizedException(error.message);
      }

      this.logger.error(`Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<AppwriteUser> {
    try {
      const account = getAppwriteAccount();

      // Try to create session to validate credentials
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        prefs: user.prefs,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private generateAccessToken(user: AppwriteUser): string {
    const payload = {
      sub: user.$id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 604800, // 7 days in seconds
    });
  }

  async getCurrentUser(userId: string): Promise<AppwriteUser> {
    try {
      const account = getAppwriteAccount();
      const user = await account.get();

      if (user.$id !== userId) {
        throw new UnauthorizedException('User ID mismatch');
      }

      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        prefs: user.prefs,
      };
    } catch (error) {
      this.logger.error(`Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new UnauthorizedException('User not found');
    }
  }
}
