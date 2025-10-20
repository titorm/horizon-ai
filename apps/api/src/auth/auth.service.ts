import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@/entities/user.entity';
import { SupabaseService } from '@/supabase/supabase.service';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signUpDto;

    // Check if user already exists
    const { data: existingUsers } = await this.supabaseService.getUsersTable().select().eq('email', email).limit(1);

    if (existingUsers && existingUsers.length > 0) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();

    const { data: newUser, error } = await this.supabaseService
      .getUsersTable()
      .insert({
        id: userId,
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      } as any)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new ConflictException('Failed to create user');
    }

    const user = newUser as User;

    // Generate token
    const accessToken = this.generateAccessToken(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    // Find user
    const { data: users, error } = await this.supabaseService.getUsersTable().select().eq('email', email).limit(1);

    if (error || !users || users.length === 0) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = users[0] as User;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Generate token
    const accessToken = this.generateAccessToken(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const { data: users, error } = await this.supabaseService.getUsersTable().select().eq('email', email).limit(1);

    if (error || !users || users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0] as User;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 604800, // 7 days in seconds
    });
  }

  async getCurrentUser(userId: string): Promise<User> {
    const { data: users, error } = await this.supabaseService.getUsersTable().select().eq('id', userId).limit(1);

    if (error || !users || users.length === 0) {
      throw new UnauthorizedException('User not found');
    }

    return users[0] as User;
  }
}
