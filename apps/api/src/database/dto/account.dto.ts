import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, IsObject, Min, Max } from 'class-validator';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  OTHER = 'other',
}

export enum AccountStatus {
  CONNECTED = 'Connected',
  SYNC_ERROR = 'Sync Error',
  DISCONNECTED = 'Disconnected',
  MANUAL = 'Manual',
}

export class CreateAccountDto {
  @IsString()
  name!: string;

  @IsEnum(AccountType)
  account_type!: AccountType;

  @IsNumber()
  @IsOptional()
  initial_balance?: number;

  @IsBoolean()
  @IsOptional()
  is_manual?: boolean;

  // Optional fields for integrated accounts (stored in data JSON)
  @IsOptional()
  @IsString()
  bank_id?: string;

  @IsOptional()
  @IsString()
  last_digits?: string;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsString()
  integration_id?: string;

  @IsOptional()
  @IsObject()
  integration_data?: any;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  account_type?: AccountType;

  @IsOptional()
  @IsString()
  bank_id?: string;

  @IsOptional()
  @IsString()
  last_digits?: string;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}

export enum CreditCardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  ELO = 'elo',
  AMEX = 'amex',
  OTHER = 'other',
}

export class CreateCreditCardDto {
  @IsString()
  account_id!: string;

  @IsString()
  name!: string;

  @IsString()
  last_digits!: string;

  @IsNumber()
  @Min(0)
  credit_limit!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  used_limit?: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  closing_day!: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  due_day!: number;

  // Optional fields for data JSON
  @IsOptional()
  @IsEnum(CreditCardBrand)
  brand?: CreditCardBrand;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateCreditCardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  credit_limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  used_limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  closing_day?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  due_day?: number;

  @IsOptional()
  @IsEnum(CreditCardBrand)
  brand?: CreditCardBrand;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
