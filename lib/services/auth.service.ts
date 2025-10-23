import { getAppwriteAccount } from '@/lib/appwrite/client';
import { Account, AppwriteException, ID } from 'node-appwrite';

import { UserService } from './user.service';

/**
 * Authentication Service
 * Handles user authentication with Appwrite Auth
 */

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  user?: any;
  profile?: any;
  preferences?: any;
  settings?: any;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const { email, password, firstName, lastName } = data;

  try {
    const account = getAppwriteAccount();

    // Create user in Appwrite Auth
    const userId = ID.unique();
    const name = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];

    const user = await account.create(userId, email, password, name);

    console.log(`User created successfully in Appwrite Auth: ${user.$id}`);

    // Create user data in database with all references (profile, preferences, settings)
    let userData;
    try {
      const userService = new UserService();
      userData = await userService.initializeUserDataWithId(
        user.$id,
        {
          email: user.email,
          password_hash: 'managed_by_appwrite_auth',
          is_email_verified: user.emailVerification || false,
          is_active: true,
        },
        {
          first_name: firstName,
          last_name: lastName,
          display_name: name,
        },
      );

      console.log(`User data initialized successfully in database for user: ${user.$id}`);
    } catch (dbError) {
      console.error(`Failed to initialize user data in database:`, dbError);
      // Continue even if database initialization fails
      // The user is still created in Appwrite Auth
    }

    return {
      id: user.$id,
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      user: userData?.user,
      profile: userData?.profile,
      preferences: userData?.preferences,
      settings: userData?.settings,
    };
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.warn(`Sign up failed: ${error.message} - ${email}`);

      // Check for duplicate email
      if (error.code === 409 || (error.message.includes('user') && error.message.includes('already exists'))) {
        throw new Error('Email already in use');
      }

      throw new Error(error.message);
    }

    console.error(`Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  const { email, password } = data;

  console.log(`Sign in attempt for email: ${email}`);

  try {
    const account = getAppwriteAccount();

    // Create email session in Appwrite
    const session = await account.createEmailPasswordSession(email, password);

    // Get user details
    const user = await account.get();

    console.log(`User signed in successfully: ${user.$id}`);

    // Get complete user data from database
    const userService = new UserService();
    const userData = await userService.getCompleteUserData(user.$id);

    // Extract first name and last name from profile or user name
    const profileAny: any = userData.profile;
    const profileFirst: string | undefined = profileAny?.display_name || undefined;
    let firstName: string | undefined = undefined;
    let lastName: string | undefined = undefined;

    if (profileFirst) {
      const parts = profileFirst.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || undefined;
    } else if (user.name) {
      const parts = user.name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || undefined;
    }

    return {
      id: user.$id,
      email: user.email,
      firstName,
      lastName,
      user: userData.user,
      profile: userData.profile,
      preferences: userData.preferences,
      settings: userData.settings,
    };
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.warn(`Sign in failed: ${error.message} - ${email}`);

      // Invalid credentials
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }

      throw new Error(error.message);
    }

    console.error(`Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const account = getAppwriteAccount();
    await account.deleteSession('current');
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Validate user credentials
 */
export async function validateUser(
  email: string,
  password: string,
): Promise<{
  $id: string;
  email: string;
  name: string;
  prefs?: Record<string, any>;
}> {
  try {
    const account = getAppwriteAccount();

    // Try to create session to validate credentials
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
      prefs: user.prefs,
    };
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(userId: string) {
  try {
    // Validate user in Appwrite Auth
    const account = getAppwriteAccount();
    const authUser = await account.get();

    if (authUser.$id !== userId) {
      throw new Error('User ID mismatch');
    }

    // Get complete user data from database
    const userService = new UserService();
    const userData = await userService.getCompleteUserData(userId);

    if (!userData.user) {
      console.warn(`User ${userId} exists in Auth but not in database`);
      throw new Error('User data not found');
    }

    return {
      auth: {
        $id: authUser.$id,
        email: authUser.email,
        name: authUser.name,
        emailVerification: authUser.emailVerification,
      },
      user: userData.user,
      profile: userData.profile,
      preferences: userData.preferences,
      settings: userData.settings,
    };
  } catch (error) {
    console.error(`Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('User not found');
  }
}
