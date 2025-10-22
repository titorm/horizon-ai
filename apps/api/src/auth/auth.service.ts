import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { getAppwriteAccount, generateId } from '../appwrite/appwrite.client';
import { AppwriteException } from 'node-appwrite';
import { AppwriteUserService } from '../database/services/appwrite-user.service';

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
    private appwriteUserService: AppwriteUserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signUpDto;

    this.logger.log(`Sign up attempt for email: ${email}`);

    try {
      const account = getAppwriteAccount();

      // Create user in Appwrite Auth
      const userId = generateId();
      const name = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];

      const user = await account.create(userId, email, password, name);

      this.logger.log(`User created successfully in Appwrite Auth: ${user.$id}`);

      // Create user data in database with all references (profile, preferences, settings)
      let userData;
      try {
        userData = await this.appwriteUserService.initializeUserDataWithId(
          user.$id, // Use the ID from Appwrite Auth
          {
            email: user.email,
            password_hash: 'managed_by_appwrite_auth', // Appwrite Auth manages passwords
            is_email_verified: user.emailVerification || false,
            is_active: true,
          },
          {
            first_name: firstName,
            last_name: lastName,
            display_name: name,
          },
        );

        this.logger.log(`User data initialized successfully in database for user: ${user.$id}`);
      } catch (dbError) {
        this.logger.error(`Failed to initialize user data in database: ${dbError}`);
        // Continue even if database initialization fails
        // The user is still created in Appwrite Auth
      }

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
        user: userData?.user,
        profile: userData?.profile,
        preferences: userData?.preferences,
        settings: userData?.settings,
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

      // Get complete user data from database
      const userData = await this.appwriteUserService.getCompleteUserData(user.$id);

      // Generate JWT token
      const accessToken = this.generateAccessToken({
        $id: user.$id,
        email: user.email,
        name: user.name,
        prefs: user.prefs || {},
      });

      // profile fields first_name/last_name were consolidated into `display_name` or `avatar`/address in schema
      // Extract from profile.display_name or fallback to parts of user.name
      const profileAny: any = userData.profile;
      const profileFirst: string | undefined = profileAny?.display_name || undefined;
      let pf: string | undefined = undefined;
      let pl: string | undefined = undefined;
      if (profileFirst) {
        const parts = profileFirst.split(' ');
        pf = parts[0];
        pl = parts.slice(1).join(' ') || undefined;
      } else if (user.name) {
        const parts = user.name.split(' ');
        pf = parts[0];
        pl = parts.slice(1).join(' ') || undefined;
      }

      return {
        id: user.$id,
        email: user.email,
        firstName: pf,
        lastName: pl,
        accessToken,
        user: userData.user,
        profile: userData.profile,
        preferences: userData.preferences,
        settings: userData.settings,
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

  async getCurrentUser(userId: string) {
    try {
      // Validate user in Appwrite Auth
      const account = getAppwriteAccount();
      const authUser = await account.get();

      if (authUser.$id !== userId) {
        throw new UnauthorizedException('User ID mismatch');
      }

      // Get complete user data from database (user, profile, preferences, settings)
      const userData = await this.appwriteUserService.getCompleteUserData(userId);

      if (!userData.user) {
        this.logger.warn(`User ${userId} exists in Auth but not in database`);
        throw new UnauthorizedException('User data not found');
      }

      return {
        auth: {
          $id: authUser.$id,
          email: authUser.email,
          name: authUser.name,
          emailVerification: authUser.emailVerification,
        },
        user: userData.user,
        profile: userData.profile,
        preferences: userData.preferences,
        settings: userData.settings,
      };
    } catch (error) {
      this.logger.error(`Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new UnauthorizedException('User not found');
    }
  }
}
