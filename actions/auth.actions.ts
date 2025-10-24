'use server';

/**
 * Authentication Server Actions for React 19.2
 * Uses Next.js 16 Async Request APIs
 */
import { generateJWT } from '@/lib/auth/jwt';
import { clearAuthCookies, setAuthCookie } from '@/lib/auth/session';
import { type SignInData, type SignUpData, signIn, signUp } from '@/lib/services/auth.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Action state types for useActionState
 */
export interface AuthActionState {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Login action - authenticates user and sets auth cookie
 * Can be used with useActionState hook
 */
export async function loginAction(prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    // Authenticate user
    const signInData: SignInData = { email, password };
    const authResponse = await signIn(signInData);

    // Generate JWT token
    const token = await generateJWT({
      userId: authResponse.id,
      email: authResponse.email,
      name: authResponse.firstName
        ? `${authResponse.firstName}${authResponse.lastName ? ' ' + authResponse.lastName : ''}`
        : undefined,
    });

    // Set authentication cookie
    await setAuthCookie(token);

    // Revalidate paths that depend on auth state
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: {
        id: authResponse.id,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
      },
    };
  } catch (error) {
    console.error('Login action error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

/**
 * Register action - creates new user account and sets auth cookie
 * Can be used with useActionState hook
 */
export async function registerAction(prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    // Validation
    if (!email || !password || !firstName) {
      return {
        success: false,
        error: 'Email, password, and first name are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    // Validate password strength
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    // Create user account
    const signUpData: SignUpData = {
      email,
      password,
      firstName,
      lastName: lastName || undefined,
    };

    const authResponse = await signUp(signUpData);

    // Generate JWT token
    const token = await generateJWT({
      userId: authResponse.id,
      email: authResponse.email,
      name: authResponse.firstName
        ? `${authResponse.firstName}${authResponse.lastName ? ' ' + authResponse.lastName : ''}`
        : undefined,
    });

    // Set authentication cookie
    await setAuthCookie(token);

    // Revalidate paths that depend on auth state
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: {
        id: authResponse.id,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
      },
    };
  } catch (error) {
    console.error('Register action error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

/**
 * Logout action - clears auth cookies and redirects to login
 * This action redirects, so it doesn't return a state
 */
export async function logoutAction(): Promise<void> {
  try {
    // Clear authentication cookies
    await clearAuthCookies();

    // Revalidate all paths
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Logout action error:', error);
  }

  // Redirect to login page
  redirect('/login');
}

/**
 * Simple login action that redirects on success
 * Use this when you don't need to handle state in the component
 */
export async function loginAndRedirectAction(formData: FormData): Promise<never> {
  const result = await loginAction(null, formData);

  if (result.success) {
    redirect('/overview');
  } else {
    // Re-throw error to be caught by error boundary
    throw new Error(result.error || 'Login failed');
  }
}

/**
 * Simple register action that redirects on success
 * Use this when you don't need to handle state in the component
 */
export async function registerAndRedirectAction(formData: FormData): Promise<never> {
  const result = await registerAction(null, formData);

  if (result.success) {
    redirect('/overview');
  } else {
    // Re-throw error to be caught by error boundary
    throw new Error(result.error || 'Registration failed');
  }
}
