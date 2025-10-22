/**
 * Appwrite Database Schema Configuration
 *
 * Este arquivo define as collections e atributos para o Appwrite Database.
 * Use o Appwrite Console ou CLI para criar estas collections.
 */

// Collection IDs - Use estes IDs ao criar no Appwrite Console
export const COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  USER_PREFERENCES: 'user_preferences',
  USER_SETTINGS: 'user_settings',
} as const;

// Database ID - Configure no Appwrite Console
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'horizon_ai_db';

/**
 * Schema Definition for Appwrite Collections
 *
 * Para criar no Appwrite Console ou via CLI:
 * appwrite databases createCollection --databaseId=horizon_ai_db --collectionId=users --name=Users
 */

// ============================================
// Collection: users
// ============================================
export const usersSchema = {
  collectionId: COLLECTIONS.USERS,
  name: 'Users',
  permissions: ['read("users")', 'write("users")', 'create("users")', 'update("users")', 'delete("users")'],
  attributes: [
    {
      key: 'email',
      type: 'string',
      size: 255,
      required: true,
      array: false,
    },
    {
      key: 'password_hash',
      type: 'string',
      size: 1000,
      required: true,
      array: false,
    },
    {
      key: 'is_email_verified',
      type: 'boolean',
      required: true,
      default: false,
    },
    {
      key: 'is_active',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'last_login_at',
      type: 'datetime',
      required: false,
    },
  ],
  indexes: [
    {
      key: 'email_idx',
      type: 'unique',
      attributes: ['email'],
    },
    {
      key: 'is_active_idx',
      type: 'key',
      attributes: ['is_active'],
    },
  ],
};

// ============================================
// Collection: user_profiles
// ============================================
export const userProfilesSchema = {
  collectionId: COLLECTIONS.USER_PROFILES,
  name: 'User Profiles',
  permissions: ['read("users")', 'write("users")', 'create("users")', 'update("users")', 'delete("users")'],
  attributes: [
    {
      key: 'user_id',
      type: 'string',
      size: 255,
      required: true,
      array: false,
    },
    {
      key: 'first_name',
      type: 'string',
      size: 100,
      required: false,
    },
    {
      key: 'last_name',
      type: 'string',
      size: 100,
      required: false,
    },
    {
      key: 'display_name',
      type: 'string',
      size: 200,
      required: false,
    },
    {
      key: 'avatar_url',
      type: 'string',
      size: 1000,
      required: false,
    },
    {
      key: 'phone_number',
      type: 'string',
      size: 20,
      required: false,
    },
    {
      key: 'date_of_birth',
      type: 'datetime',
      required: false,
    },
    {
      key: 'address',
      type: 'string',
      size: 10000, // JSON stringified
      required: false,
    },
    {
      key: 'bio',
      type: 'string',
      size: 2000,
      required: false,
    },
    {
      key: 'occupation',
      type: 'string',
      size: 100,
      required: false,
    },
    {
      key: 'company',
      type: 'string',
      size: 100,
      required: false,
    },
    {
      key: 'website',
      type: 'string',
      size: 255,
      required: false,
    },
    {
      key: 'social_links',
      type: 'string',
      size: 2000, // JSON stringified
      required: false,
    },
  ],
  indexes: [
    {
      key: 'user_id_idx',
      type: 'unique',
      attributes: ['user_id'],
    },
  ],
};

// ============================================
// Collection: user_preferences
// ============================================
export const userPreferencesSchema = {
  collectionId: COLLECTIONS.USER_PREFERENCES,
  name: 'User Preferences',
  permissions: ['read("users")', 'write("users")', 'create("users")', 'update("users")', 'delete("users")'],
  attributes: [
    {
      key: 'user_id',
      type: 'string',
      size: 255,
      required: true,
      array: false,
    },
    // Visual Preferences
    {
      key: 'theme',
      type: 'string',
      size: 20,
      required: true,
      default: 'system',
    },
    {
      key: 'language',
      type: 'string',
      size: 10,
      required: true,
      default: 'pt-BR',
    },
    {
      key: 'currency',
      type: 'string',
      size: 10,
      required: true,
      default: 'BRL',
    },
    // Dashboard Preferences
    {
      key: 'default_dashboard_view',
      type: 'string',
      size: 50,
      required: false,
      default: 'overview',
    },
    {
      key: 'dashboard_widgets',
      type: 'string',
      size: 10000, // JSON stringified
      required: false,
    },
    // Notification Preferences
    {
      key: 'email_notifications',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'push_notifications',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'sms_notifications',
      type: 'boolean',
      required: true,
      default: false,
    },
    {
      key: 'notification_frequency',
      type: 'string',
      size: 20,
      required: true,
      default: 'realtime',
    },
    // Financial Preferences
    {
      key: 'show_balances',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'auto_categorization_enabled',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'budget_alerts',
      type: 'boolean',
      required: true,
      default: true,
    },
    // Privacy Preferences
    {
      key: 'profile_visibility',
      type: 'string',
      size: 20,
      required: true,
      default: 'private',
    },
    {
      key: 'share_data_for_insights',
      type: 'boolean',
      required: true,
      default: false,
    },
  ],
  indexes: [
    {
      key: 'user_id_idx',
      type: 'unique',
      attributes: ['user_id'],
    },
  ],
};

// ============================================
// Collection: user_settings
// ============================================
export const userSettingsSchema = {
  collectionId: COLLECTIONS.USER_SETTINGS,
  name: 'User Settings',
  permissions: ['read("users")', 'write("users")', 'create("users")', 'update("users")', 'delete("users")'],
  attributes: [
    {
      key: 'user_id',
      type: 'string',
      size: 255,
      required: true,
      array: false,
    },
    // Security Settings
    {
      key: 'two_factor_enabled',
      type: 'boolean',
      required: true,
      default: false,
    },
    {
      key: 'two_factor_method',
      type: 'string',
      size: 20,
      required: false,
    },
    {
      key: 'session_timeout',
      type: 'integer',
      required: true,
      default: 30,
      min: 5,
      max: 1440,
    },
    {
      key: 'password_last_changed_at',
      type: 'datetime',
      required: false,
    },
    // Data & Sync Settings
    {
      key: 'auto_sync_enabled',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'sync_frequency',
      type: 'integer',
      required: true,
      default: 60,
      min: 1,
      max: 1440,
    },
    {
      key: 'cloud_backup_enabled',
      type: 'boolean',
      required: true,
      default: true,
    },
    // Integration Settings (JSON stringified)
    {
      key: 'connected_banks',
      type: 'string',
      size: 50000,
      required: false,
    },
    {
      key: 'connected_apps',
      type: 'string',
      size: 50000,
      required: false,
    },
    // Advanced Settings
    {
      key: 'beta_features',
      type: 'boolean',
      required: true,
      default: false,
    },
    {
      key: 'analytics_opt_in',
      type: 'boolean',
      required: true,
      default: true,
    },
    {
      key: 'custom_settings',
      type: 'string',
      size: 50000, // JSON stringified
      required: false,
    },
  ],
  indexes: [
    {
      key: 'user_id_idx',
      type: 'unique',
      attributes: ['user_id'],
    },
    {
      key: 'two_factor_enabled_idx',
      type: 'key',
      attributes: ['two_factor_enabled'],
    },
  ],
};

// ============================================
// Types for TypeScript
// ============================================

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  email: string;
  password_hash: string;
  is_email_verified: boolean;
  is_active: boolean;
  last_login_at?: string;
}

export interface UserProfile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  phone_number?: string;
  date_of_birth?: string;
  address?: string; // JSON string
  bio?: string;
  occupation?: string;
  company?: string;
  website?: string;
  social_links?: string; // JSON string
}

export interface UserPreferences {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  currency: 'BRL' | 'USD' | 'EUR';
  default_dashboard_view?: string;
  dashboard_widgets?: string; // JSON string
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'never';
  show_balances: boolean;
  auto_categorization_enabled: boolean;
  budget_alerts: boolean;
  profile_visibility: string;
  share_data_for_insights: boolean;
}

export interface UserSettings {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  user_id: string;
  two_factor_enabled: boolean;
  two_factor_method?: string;
  session_timeout: number;
  password_last_changed_at?: string;
  auto_sync_enabled: boolean;
  sync_frequency: number;
  cloud_backup_enabled: boolean;
  connected_banks?: string; // JSON string
  connected_apps?: string; // JSON string
  beta_features: boolean;
  analytics_opt_in: boolean;
  custom_settings?: string; // JSON string
}
