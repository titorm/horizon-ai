import { getSession } from '@/lib/auth/session';
import { UserService } from '@/lib/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/profile
 * Get current user's profile data
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();

    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.sub;

    // Get user profile data
    const userService = new UserService();
    const completeUserData = await userService.getCompleteUserData(userId);

    // Parse JSON fields for better response structure
    const profile = completeUserData.profile
      ? {
          ...completeUserData.profile,
          address: completeUserData.profile.address ? JSON.parse(completeUserData.profile.address) : undefined,
        }
      : null;

    const preferences = completeUserData.preferences
      ? {
          ...completeUserData.preferences,
          notifications: completeUserData.preferences.notifications
            ? JSON.parse(completeUserData.preferences.notifications)
            : undefined,
        }
      : null;

    const settings = completeUserData.settings
      ? {
          ...completeUserData.settings,
          privacy_settings: completeUserData.settings.privacy_settings
            ? JSON.parse(completeUserData.settings.privacy_settings)
            : undefined,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        user: completeUserData.user,
        profile,
        preferences,
        settings,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
      }

      return NextResponse.json({ message: error.message || 'Failed to get user profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Failed to get user profile' }, { status: 500 });
  }
}

/**
 * PATCH /api/users/profile
 * Update current user's profile, preferences, or settings
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();

    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.sub;

    // Parse request body
    const body = await request.json();

    // Validate that at least one update section is provided
    if (!body.profile && !body.preferences && !body.settings && !body.user) {
      return NextResponse.json(
        { message: 'At least one of profile, preferences, settings, or user must be provided' },
        { status: 400 },
      );
    }

    const userService = new UserService();
    const updates: any = {};

    // Update user basic info if provided
    if (body.user) {
      const allowedUserFields = ['name', 'is_active'];
      const userUpdates: any = {};

      for (const field of allowedUserFields) {
        if (body.user[field] !== undefined) {
          userUpdates[field] = body.user[field];
        }
      }

      if (Object.keys(userUpdates).length > 0) {
        updates.user = await userService.updateUser(userId, userUpdates);
      }
    }

    // Update profile if provided
    if (body.profile) {
      // Validate profile fields
      const allowedProfileFields = [
        'bio',
        'avatar_url',
        'phone',
        'address',
        'birthdate',
        'first_name',
        'last_name',
        'display_name',
        'occupation',
        'company',
        'website',
        'social_links',
      ];

      const profileUpdates: any = {};

      for (const field of allowedProfileFields) {
        if (body.profile[field] !== undefined) {
          profileUpdates[field] = body.profile[field];
        }
      }

      if (Object.keys(profileUpdates).length > 0) {
        updates.profile = await userService.updateProfile(userId, profileUpdates);
      }
    }

    // Update preferences if provided
    if (body.preferences) {
      // Validate preference fields
      const allowedPreferenceFields = [
        'theme',
        'language',
        'currency',
        'timezone',
        'email_notifications',
        'push_notifications',
        'sms_notifications',
        'notification_frequency',
        'show_balances',
        'auto_categorization_enabled',
        'budget_alerts',
        'profile_visibility',
        'share_data_for_insights',
        'dashboard_widgets',
      ];

      const preferenceUpdates: any = {};

      for (const field of allowedPreferenceFields) {
        if (body.preferences[field] !== undefined) {
          preferenceUpdates[field] = body.preferences[field];
        }
      }

      if (Object.keys(preferenceUpdates).length > 0) {
        updates.preferences = await userService.updatePreferences(userId, preferenceUpdates);
      }
    }

    // Update settings if provided
    if (body.settings) {
      // Validate settings fields
      const allowedSettingsFields = [
        'two_factor_enabled',
        'email_verified',
        'phone_verified',
        'marketing_emails',
        'session_timeout',
        'auto_sync_enabled',
        'sync_frequency',
        'cloud_backup_enabled',
        'connected_banks',
        'connected_apps',
        'beta_features',
        'analytics_opt_in',
        'custom_settings',
      ];

      const settingsUpdates: any = {};

      for (const field of allowedSettingsFields) {
        if (body.settings[field] !== undefined) {
          settingsUpdates[field] = body.settings[field];
        }
      }

      if (Object.keys(settingsUpdates).length > 0) {
        updates.settings = await userService.updateSettings(userId, settingsUpdates);
      }
    }

    // Return updated data
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updates,
    });
  } catch (error) {
    console.error('Update user profile error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
      }

      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      return NextResponse.json({ message: error.message || 'Failed to update user profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Failed to update user profile' }, { status: 500 });
  }
}
