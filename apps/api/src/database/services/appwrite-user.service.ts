import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Databases, Query, ID } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS, User, UserProfile, UserPreferences, UserSettings } from '../appwrite-schema';

@Injectable()
export class AppwriteUserService {
  private databases: Databases;

  constructor(@Inject('APPWRITE') private readonly appwrite: any) {
    if (!appwrite || !appwrite.databases) {
      throw new Error('Appwrite not properly initialized');
    }
    this.databases = appwrite.databases;
  }

  // ============================================
  // Helper Methods for JSON Parsing
  // ============================================

  private parseJSON<T>(value: string | undefined, defaultValue: T): T {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }

  private stringifyJSON(value: any): string {
    return JSON.stringify(value);
  }

  // ============================================
  // User Operations
  // ============================================

  async createUser(data: {
    email: string;
    password_hash: string;
    is_email_verified?: boolean;
    is_active?: boolean;
  }): Promise<User> {
    const document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), {
      email: data.email,
      password_hash: data.password_hash,
      is_email_verified: data.is_email_verified ?? false,
      is_active: data.is_active ?? true,
    });

    return document as unknown as User;
  }

  async findUserById(userId: string): Promise<User | undefined> {
    try {
      const document = await this.databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
      return document as unknown as User;
    } catch (error: any) {
      if (error.code === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const response = await this.databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
        Query.equal('email', email),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return undefined;
      }

      return response.documents[0] as unknown as User;
    } catch (error) {
      return undefined;
    }
  }

  async updateUser(userId: string, data: Partial<Omit<User, '$id' | '$createdAt' | '$updatedAt'>>): Promise<User> {
    try {
      const document = await this.databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, userId, data);
      return document as unknown as User;
    } catch (error: any) {
      if (error.code === 404) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete related documents first
    await Promise.all([
      this.deleteProfile(userId).catch(() => {}),
      this.deletePreferences(userId).catch(() => {}),
      this.deleteSettings(userId).catch(() => {}),
    ]);

    // Delete user
    await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
  }

  // ============================================
  // User Profile Operations
  // ============================================

  async createProfile(data: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    phone_number?: string;
    date_of_birth?: Date | string;
    address?: any;
    bio?: string;
    occupation?: string;
    company?: string;
    website?: string;
    social_links?: any;
  }): Promise<UserProfile> {
    const document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_PROFILES, ID.unique(), {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      phone_number: data.phone_number,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString() : undefined,
      address: data.address ? this.stringifyJSON(data.address) : undefined,
      bio: data.bio,
      occupation: data.occupation,
      company: data.company,
      website: data.website,
      social_links: data.social_links ? this.stringifyJSON(data.social_links) : undefined,
    });

    return document as unknown as UserProfile;
  }

  async getProfile(userId: string): Promise<UserProfile | undefined> {
    try {
      const response = await this.databases.listDocuments(DATABASE_ID, COLLECTIONS.USER_PROFILES, [
        Query.equal('user_id', userId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return undefined;
      }

      return response.documents[0] as unknown as UserProfile;
    } catch (error) {
      return undefined;
    }
  }

  async updateProfile(
    userId: string,
    data: Partial<Omit<UserProfile, '$id' | '$createdAt' | '$updatedAt' | 'user_id'>>,
  ): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields
    if (data.address) {
      updateData.address = this.stringifyJSON(data.address);
    }
    if (data.social_links) {
      updateData.social_links = this.stringifyJSON(data.social_links);
    }

    const document = await this.databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USER_PROFILES,
      profile.$id,
      updateData,
    );

    return document as unknown as UserProfile;
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (profile) {
      await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_PROFILES, profile.$id);
    }
  }

  // ============================================
  // User Preferences Operations
  // ============================================

  async createPreferences(data: {
    user_id: string;
    theme?: 'light' | 'dark' | 'system';
    language?: 'pt-BR' | 'en-US' | 'es-ES';
    currency?: 'BRL' | 'USD' | 'EUR';
    [key: string]: any;
  }): Promise<UserPreferences> {
    const document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_PREFERENCES, ID.unique(), {
      user_id: data.user_id,
      theme: data.theme || 'system',
      language: data.language || 'pt-BR',
      currency: data.currency || 'BRL',
      default_dashboard_view: data.default_dashboard_view || 'overview',
      dashboard_widgets: data.dashboard_widgets ? this.stringifyJSON(data.dashboard_widgets) : undefined,
      email_notifications: data.email_notifications ?? true,
      push_notifications: data.push_notifications ?? true,
      sms_notifications: data.sms_notifications ?? false,
      notification_frequency: data.notification_frequency || 'realtime',
      show_balances: data.show_balances ?? true,
      auto_categorization_enabled: data.auto_categorization_enabled ?? true,
      budget_alerts: data.budget_alerts ?? true,
      profile_visibility: data.profile_visibility || 'private',
      share_data_for_insights: data.share_data_for_insights ?? false,
    });

    return document as unknown as UserPreferences;
  }

  async getPreferences(userId: string): Promise<UserPreferences | undefined> {
    try {
      const response = await this.databases.listDocuments(DATABASE_ID, COLLECTIONS.USER_PREFERENCES, [
        Query.equal('user_id', userId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return undefined;
      }

      return response.documents[0] as unknown as UserPreferences;
    } catch (error) {
      return undefined;
    }
  }

  async updatePreferences(
    userId: string,
    data: Partial<Omit<UserPreferences, '$id' | '$createdAt' | '$updatedAt' | 'user_id'>>,
  ): Promise<UserPreferences> {
    const preferences = await this.getPreferences(userId);
    if (!preferences) {
      throw new NotFoundException(`Preferences for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields
    if (data.dashboard_widgets) {
      updateData.dashboard_widgets = this.stringifyJSON(data.dashboard_widgets);
    }

    const document = await this.databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USER_PREFERENCES,
      preferences.$id,
      updateData,
    );

    return document as unknown as UserPreferences;
  }

  async deletePreferences(userId: string): Promise<void> {
    const preferences = await this.getPreferences(userId);
    if (preferences) {
      await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_PREFERENCES, preferences.$id);
    }
  }

  // ============================================
  // User Settings Operations
  // ============================================

  async createSettings(data: { user_id: string; [key: string]: any }): Promise<UserSettings> {
    const document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_SETTINGS, ID.unique(), {
      user_id: data.user_id,
      two_factor_enabled: data.two_factor_enabled ?? false,
      two_factor_method: data.two_factor_method,
      session_timeout: data.session_timeout || 30,
      password_last_changed_at: data.password_last_changed_at,
      auto_sync_enabled: data.auto_sync_enabled ?? true,
      sync_frequency: data.sync_frequency || 60,
      cloud_backup_enabled: data.cloud_backup_enabled ?? true,
      connected_banks: data.connected_banks ? this.stringifyJSON(data.connected_banks) : undefined,
      connected_apps: data.connected_apps ? this.stringifyJSON(data.connected_apps) : undefined,
      beta_features: data.beta_features ?? false,
      analytics_opt_in: data.analytics_opt_in ?? true,
      custom_settings: data.custom_settings ? this.stringifyJSON(data.custom_settings) : undefined,
    });

    return document as unknown as UserSettings;
  }

  async getSettings(userId: string): Promise<UserSettings | undefined> {
    try {
      const response = await this.databases.listDocuments(DATABASE_ID, COLLECTIONS.USER_SETTINGS, [
        Query.equal('user_id', userId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return undefined;
      }

      return response.documents[0] as unknown as UserSettings;
    } catch (error) {
      return undefined;
    }
  }

  async updateSettings(
    userId: string,
    data: Partial<Omit<UserSettings, '$id' | '$createdAt' | '$updatedAt' | 'user_id'>>,
  ): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    if (!settings) {
      throw new NotFoundException(`Settings for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields
    if (data.connected_banks) {
      updateData.connected_banks = this.stringifyJSON(data.connected_banks);
    }
    if (data.connected_apps) {
      updateData.connected_apps = this.stringifyJSON(data.connected_apps);
    }
    if (data.custom_settings) {
      updateData.custom_settings = this.stringifyJSON(data.custom_settings);
    }

    const document = await this.databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USER_SETTINGS,
      settings.$id,
      updateData,
    );

    return document as unknown as UserSettings;
  }

  async deleteSettings(userId: string): Promise<void> {
    const settings = await this.getSettings(userId);
    if (settings) {
      await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_SETTINGS, settings.$id);
    }
  }

  // ============================================
  // Complete User Data Operations
  // ============================================

  async getCompleteUserData(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const [profile, preferences, settings] = await Promise.all([
      this.getProfile(userId),
      this.getPreferences(userId),
      this.getSettings(userId),
    ]);

    return {
      user,
      profile: profile
        ? {
            ...profile,
            address: this.parseJSON(profile.address, {}),
            social_links: this.parseJSON(profile.social_links, {}),
          }
        : null,
      preferences: preferences
        ? {
            ...preferences,
            dashboard_widgets: this.parseJSON(preferences.dashboard_widgets, {
              enabled: [],
              order: [],
            }),
          }
        : null,
      settings: settings
        ? {
            ...settings,
            connected_banks: this.parseJSON(settings.connected_banks, []),
            connected_apps: this.parseJSON(settings.connected_apps, []),
            custom_settings: this.parseJSON(settings.custom_settings, {}),
          }
        : null,
    };
  }

  async initializeUserData(
    userData: {
      email: string;
      password_hash: string;
      is_email_verified?: boolean;
      is_active?: boolean;
    },
    profileData?: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      [key: string]: any;
    },
  ) {
    // Create user
    const user = await this.createUser(userData);

    // Create profile with default values
    const profile = await this.createProfile({
      user_id: user.$id,
      ...profileData,
    });

    // Create default preferences
    const preferences = await this.createPreferences({
      user_id: user.$id,
    });

    // Create default settings
    const settings = await this.createSettings({
      user_id: user.$id,
    });

    return {
      user,
      profile,
      preferences,
      settings,
    };
  }
}
