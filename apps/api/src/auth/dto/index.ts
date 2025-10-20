import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password!: string;

  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @MaxLength(100)
  lastName?: string;
}

export class SignInDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class AuthResponseDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  accessToken!: string;
}

export class UserDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
