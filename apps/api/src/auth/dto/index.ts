import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @IsOptional()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName?: string;

  @IsOptional()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName?: string;
}

export class SignInDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

export class AuthResponseDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  accessToken!: string;
  user?: any; // User document from database
  profile?: any; // User profile document
  preferences?: any; // User preferences document
  settings?: any; // User settings document
}

export class UserDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
