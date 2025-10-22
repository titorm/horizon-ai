import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Databases, Query, ID, TablesDB } from 'node-appwrite';
import { getAppwriteTables } from '@/appwrite/appwrite.client';
import { DATABASE_ID, COLLECTIONS, User, UserProfile, UserPreferences, UserSettings } from '../appwrite-schema';

@Injectable()
export class AppwriteUserService {
  private databases: any;
  private tables: TablesDB | null = null;

  constructor(@Inject('APPWRITE') private readonly appwrite: any) {
    if (!appwrite || !appwrite.databases) {
      throw new Error('Appwrite not properly initialized');
    }
    this.databases = appwrite.databases;

    // Try to get native TablesDB for object-parameter API
    try {
      this.tables = getAppwriteTables();
    } catch (err) {
      this.tables = null;
    }
  }

  // ============================================
  // Helper Methods for JSON Parsing
  // ============================================

  private parseJSON(value: string | undefined, defaultValue: any): any {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as any;
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
    const id = ID.unique();
    const now = new Date().toISOString();

    const payload = {
      auth_user_id: id,
      email: data.email,
      password_hash: data.password_hash,
      name: data.email.split('@')[0],
      is_email_verified: data.is_email_verified ?? false,
      is_active: data.is_active ?? true,
      created_at: now,
      updated_at: now,
    };

    let document: any;
    if (this.tables) {
      document = await this.tables.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERS,
        rowId: id,
        data: payload,
      });
    } else {
      document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, id, payload);
    }

    return document as unknown as User;
  }

  async findUserById(userId: string): Promise<User | undefined> {
    try {
      let document: any;
      if (this.tables) {
        document = await this.tables.getRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USERS,
          rowId: userId,
        });
      } else {
        document = await this.databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
      }
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
      if (this.tables) {
        const response = await this.tables.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USERS,
          queries: [Query.equal('email', email), Query.limit(1)],
        });
        if (!response.rows || response.rows.length === 0) return undefined;
        return response.rows[0] as unknown as User;
      }

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
      let document: any;
      if (this.tables) {
        document = await this.tables.updateRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USERS,
          rowId: userId,
          data,
        });
      } else {
        document = await this.databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, userId, data);
      }
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
    if (this.tables) {
      await this.tables.deleteRow({ databaseId: DATABASE_ID, tableId: COLLECTIONS.USERS, rowId: userId });
    } else {
      await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
    }
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
    const now = new Date().toISOString();

    const payload = {
      user_id: data.user_id,
      bio: data.bio,
      avatar_url: data.avatar_url,
      phone: data.phone_number,
      address: data.address ? this.stringifyJSON(data.address) : undefined,
      birthdate: data.date_of_birth ? new Date(data.date_of_birth).toISOString() : undefined,
      created_at: now,
      updated_at: now,
    };

    let document: any;
    if (this.tables) {
      document = await this.tables.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_PROFILES,
        rowId: ID.unique(),
        data: payload,
      });
    } else {
      document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_PROFILES, ID.unique(), payload);
    }

    return document as unknown as UserProfile;
  }

  async getProfile(userId: string): Promise<UserProfile | undefined> {
    try {
      if (this.tables) {
        const response = await this.tables.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_PROFILES,
          queries: [Query.equal('user_id', userId), Query.limit(1)],
        });
        if (!response.rows || response.rows.length === 0) return undefined;
        return response.rows[0] as unknown as UserProfile;
      }

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

  async updateProfile(userId: string, data: any): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields and map legacy social_links into address JSON
    const existingAddress = this.parseJSON(profile.address, {});
    if (data.address) {
      // merge provided address object into existing
      const merged = { ...existingAddress, ...data.address };
      updateData.address = this.stringifyJSON(merged);
    }
    if (data.social_links) {
      existingAddress.social_links = data.social_links;
      updateData.address = this.stringifyJSON(existingAddress);
    }

    let document: any;
    if (this.tables) {
      document = await this.tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_PROFILES,
        rowId: profile.$id,
        data: updateData,
      });
    } else {
      document = await this.databases.updateDocument(DATABASE_ID, COLLECTIONS.USER_PROFILES, profile.$id, updateData);
    }

    return document as unknown as UserProfile;
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (profile) {
      if (this.tables) {
        await this.tables.deleteRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_PROFILES,
          rowId: profile.$id,
        });
      } else {
        await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_PROFILES, profile.$id);
      }
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
    const now = new Date().toISOString();

    // Older schema stored many boolean fields; migrations consolidate into a single
    // 'notifications' JSON column. Pack related fields into that JSON for compatibility.
    const notifications = {
      email_notifications: data.email_notifications ?? true,
      push_notifications: data.push_notifications ?? true,
      sms_notifications: data.sms_notifications ?? false,
      notification_frequency: data.notification_frequency || 'realtime',
    };

    const payload = {
      user_id: data.user_id,
      theme: data.theme || 'system',
      language: data.language || 'pt-BR',
      currency: data.currency || 'BRL',
      timezone: data.timezone || 'UTC',
      notifications: this.stringifyJSON(notifications),
      created_at: now,
      updated_at: now,
    };

    let document: any;
    if (this.tables) {
      document = await this.tables.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_PREFERENCES,
        rowId: ID.unique(),
        data: payload,
      });
    } else {
      document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_PREFERENCES, ID.unique(), payload);
    }

    return document as unknown as UserPreferences;
  }

  async getPreferences(userId: string): Promise<UserPreferences | undefined> {
    try {
      if (this.tables) {
        const response = await this.tables.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_PREFERENCES,
          queries: [Query.equal('user_id', userId), Query.limit(1)],
        });
        if (!response.rows || response.rows.length === 0) return undefined;
        return response.rows[0] as unknown as UserPreferences;
      }

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

  async updatePreferences(userId: string, data: any): Promise<UserPreferences> {
    const preferences = await this.getPreferences(userId);
    if (!preferences) {
      throw new NotFoundException(`Preferences for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields
    if (data.dashboard_widgets) {
      // preferences.notifications stores notification-related JSON; pack dashboard_widgets there for compatibility
      const existingNotifications = this.parseJSON(preferences.notifications, {});
      existingNotifications.dashboard_widgets = data.dashboard_widgets;
      updateData.notifications = this.stringifyJSON(existingNotifications);
    }

    let document: any;
    if (this.tables) {
      document = await this.tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_PREFERENCES,
        rowId: preferences.$id,
        data: updateData,
      });
    } else {
      document = await this.databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_PREFERENCES,
        preferences.$id,
        updateData,
      );
    }

    return document as unknown as UserPreferences;
  }

  async deletePreferences(userId: string): Promise<void> {
    const preferences = await this.getPreferences(userId);
    if (preferences) {
      if (this.tables) {
        await this.tables.deleteRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_PREFERENCES,
          rowId: preferences.$id,
        });
      } else {
        await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_PREFERENCES, preferences.$id);
      }
    }
  }

  // ============================================
  // User Settings Operations
  // ============================================

  async createSettings(data: { user_id: string; [key: string]: any }): Promise<UserSettings> {
    const now = new Date().toISOString();

    // Migrations for settings created a small set of required boolean flags and a
    // privacy_settings JSON column. Store relevant flags and pack additional settings
    // into the privacy_settings JSON when provided.
    const privacy = {
      session_timeout: data.session_timeout,
      auto_sync_enabled: data.auto_sync_enabled,
      sync_frequency: data.sync_frequency,
      cloud_backup_enabled: data.cloud_backup_enabled,
      connected_banks: data.connected_banks,
      connected_apps: data.connected_apps,
      beta_features: data.beta_features,
      analytics_opt_in: data.analytics_opt_in,
      custom_settings: data.custom_settings,
    };

    const payload = {
      user_id: data.user_id,
      two_factor_enabled: data.two_factor_enabled ?? false,
      email_verified: data.email_verified ?? false,
      phone_verified: data.phone_verified ?? false,
      marketing_emails: data.marketing_emails ?? false,
      privacy_settings: this.stringifyJSON(privacy),
      created_at: now,
      updated_at: now,
    };

    let document: any;
    if (this.tables) {
      document = await this.tables.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_SETTINGS,
        rowId: ID.unique(),
        data: payload,
      });
    } else {
      document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USER_SETTINGS, ID.unique(), payload);
    }

    return document as unknown as UserSettings;
  }

  async getSettings(userId: string): Promise<UserSettings | undefined> {
    try {
      if (this.tables) {
        const response = await this.tables.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_SETTINGS,
          queries: [Query.equal('user_id', userId), Query.limit(1)],
        });
        if (!response.rows || response.rows.length === 0) return undefined;
        return response.rows[0] as unknown as UserSettings;
      }

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

  async updateSettings(userId: string, data: any): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    if (!settings) {
      throw new NotFoundException(`Settings for user ${userId} not found`);
    }

    const updateData: any = { ...data };

    // Handle JSON fields: merge legacy connected_banks/connected_apps/custom_settings into privacy_settings JSON
    const existingPrivacy = this.parseJSON(settings.privacy_settings, {});
    let privacyUpdated = false;
    if (data.connected_banks) {
      existingPrivacy.connected_banks = data.connected_banks;
      privacyUpdated = true;
    }
    if (data.connected_apps) {
      existingPrivacy.connected_apps = data.connected_apps;
      privacyUpdated = true;
    }
    if (data.custom_settings) {
      existingPrivacy.custom_settings = data.custom_settings;
      privacyUpdated = true;
    }
    if (privacyUpdated) {
      updateData.privacy_settings = this.stringifyJSON(existingPrivacy);
    }

    let document: any;
    if (this.tables) {
      document = await this.tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USER_SETTINGS,
        rowId: settings.$id,
        data: updateData,
      });
    } else {
      document = await this.databases.updateDocument(DATABASE_ID, COLLECTIONS.USER_SETTINGS, settings.$id, updateData);
    }

    return document as unknown as UserSettings;
  }

  async deleteSettings(userId: string): Promise<void> {
    const settings = await this.getSettings(userId);
    if (settings) {
      if (this.tables) {
        await this.tables.deleteRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTIONS.USER_SETTINGS,
          rowId: settings.$id,
        });
      } else {
        await this.databases.deleteDocument(DATABASE_ID, COLLECTIONS.USER_SETTINGS, settings.$id);
      }
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
            // address is stored as JSON string
            address: this.parseJSON(profile.address, {}),
            // legacy social_links may have been merged into the address JSON
            social_links: this.parseJSON(profile.address, {}).social_links || {},
          }
        : null,
      preferences: preferences
        ? {
            ...preferences,
            // dashboard_widgets may have been stored inside the notifications JSON for compatibility
            dashboard_widgets: this.parseJSON(preferences.notifications, { enabled: [], order: [] })
              .dashboard_widgets || {
              enabled: [],
              order: [],
            },
          }
        : null,
      settings: settings
        ? {
            ...settings,
            // connected_banks/custom_apps/custom_settings migrated into privacy_settings JSON
            connected_banks: this.parseJSON(settings.privacy_settings, {}).connected_banks || [],
            connected_apps: this.parseJSON(settings.privacy_settings, {}).connected_apps || [],
            custom_settings: this.parseJSON(settings.privacy_settings, {}).custom_settings || {},
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

  /**
   * Initialize user data with existing user ID (e.g., from Appwrite Auth)
   * This creates the user document and all related documents with default values
   */
  async initializeUserDataWithId(
    userId: string,
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
    // Create user document with specific ID
    const now = new Date().toISOString();
    const payload = {
      auth_user_id: userId,
      email: userData.email,
      password_hash: userData.password_hash,
      name: userData.email.split('@')[0],
      is_email_verified: userData.is_email_verified ?? false,
      is_active: userData.is_active ?? true,
      created_at: now,
      updated_at: now,
    };

    let document: any;
    if (this.tables) {
      document = await this.tables.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERS,
        rowId: userId,
        data: payload,
      });
    } else {
      document = await this.databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, userId, payload);
    }

    const user = document as unknown as User;

    // Create profile with default values
    const profile = await this.createProfile({
      user_id: userId,
      ...profileData,
    });

    // Create default preferences
    const preferences = await this.createPreferences({
      user_id: userId,
    });

    // Create default settings
    const settings = await this.createSettings({
      user_id: userId,
    });

    return {
      user,
      profile,
      preferences,
      settings,
    };
  }
}
