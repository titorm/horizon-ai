import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  IsArray,
  IsDateString,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';

// ============================================
// User DTOs
// ============================================

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// ============================================
// Profile DTOs
// ============================================

export class AddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class SocialLinksDto {
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @IsUrl()
  @IsOptional()
  twitter?: string;

  @IsUrl()
  @IsOptional()
  facebook?: string;

  @IsUrl()
  @IsOptional()
  instagram?: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsObject()
  @IsOptional()
  address?: AddressDto;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsObject()
  @IsOptional()
  socialLinks?: SocialLinksDto;
}

// ============================================
// Preferences DTOs
// ============================================

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum Language {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
}

export enum Currency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export enum NotificationFrequency {
  REALTIME = 'realtime',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never',
}

export class UpdatePreferencesDto {
  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsString()
  @IsOptional()
  defaultDashboardView?: string;

  @IsObject()
  @IsOptional()
  dashboardWidgets?: {
    enabled: string[];
    order: string[];
    layout?: Record<string, any>;
  };

  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  smsNotifications?: boolean;

  @IsEnum(NotificationFrequency)
  @IsOptional()
  notificationFrequency?: NotificationFrequency;

  @IsBoolean()
  @IsOptional()
  showBalances?: boolean;

  @IsBoolean()
  @IsOptional()
  autoCategorizationEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  budgetAlerts?: boolean;

  @IsString()
  @IsOptional()
  profileVisibility?: string;

  @IsBoolean()
  @IsOptional()
  shareDataForInsights?: boolean;
}

// ============================================
// Settings DTOs
// ============================================

export class ConnectedBankDto {
  @IsString()
  bankId!: string;

  @IsString()
  bankName!: string;

  @IsString()
  connectedAt!: string;

  @IsString()
  @IsOptional()
  lastSyncAt?: string;

  @IsBoolean()
  isActive!: boolean;
}

export class ConnectedAppDto {
  @IsString()
  appId!: string;

  @IsString()
  appName!: string;

  @IsString()
  connectedAt!: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];

  @IsBoolean()
  isActive!: boolean;
}

export class UpdateSettingsDto {
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;

  @IsString()
  @IsOptional()
  twoFactorMethod?: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  sessionTimeout?: number;

  @IsBoolean()
  @IsOptional()
  autoSyncEnabled?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  syncFrequency?: number;

  @IsBoolean()
  @IsOptional()
  cloudBackupEnabled?: boolean;

  @IsArray()
  @IsOptional()
  connectedBanks?: ConnectedBankDto[];

  @IsArray()
  @IsOptional()
  connectedApps?: ConnectedAppDto[];

  @IsBoolean()
  @IsOptional()
  betaFeatures?: boolean;

  @IsBoolean()
  @IsOptional()
  analyticsOptIn?: boolean;

  @IsObject()
  @IsOptional()
  customSettings?: Record<string, any>;
}

// ============================================
// Transaction DTOs
// ============================================

export class CreateTransactionDto {
  @IsString()
  userId!: string;

  @IsInt()
  @Min(0)
  amount!: number;

  @IsEnum(['income', 'expense', 'transfer'])
  type!: 'income' | 'expense' | 'transfer';

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  merchant?: string;

  @IsString()
  currency!: string;

  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };

  @IsUrl()
  @IsOptional()
  receiptUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsObject()
  @IsOptional()
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export class CreateIntegrationTransactionDto {
  @IsString()
  userId!: string;

  @IsInt()
  @Min(0)
  amount!: number;

  @IsEnum(['income', 'expense', 'transfer'])
  type!: 'income' | 'expense' | 'transfer';

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  merchant?: string;

  @IsString()
  currency!: string;

  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';

  @IsString()
  integrationId!: string;

  @IsObject()
  @IsOptional()
  integrationData?: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };

  @IsUrl()
  @IsOptional()
  receiptUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsObject()
  @IsOptional()
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export class UpdateTransactionDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(['income', 'expense', 'transfer'])
  @IsOptional()
  type?: 'income' | 'expense' | 'transfer';

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  merchant?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };

  @IsUrl()
  @IsOptional()
  receiptUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsObject()
  @IsOptional()
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export class TransactionFilterDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(['income', 'expense', 'transfer'])
  @IsOptional()
  type?: 'income' | 'expense' | 'transfer';

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';

  @IsEnum(['manual', 'integration', 'import'])
  @IsOptional()
  source?: 'manual' | 'integration' | 'import';

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minAmount?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxAmount?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;
}
