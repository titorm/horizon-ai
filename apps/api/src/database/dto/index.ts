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
