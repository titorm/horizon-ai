import { clearAuthCookies, getAuthToken } from '@/lib/auth/session';
import { signOut } from '@/lib/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/sign-out
 * Sign out the current user and clear authentication cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getAuthToken();

    if (token) {
      // Sign out from Appwrite (delete session)
      try {
        await signOut();
      } catch (error) {
        // Continue even if Appwrite sign out fails
        // The user might already be signed out on Appwrite
        console.warn('Appwrite sign out warning:', error);
      }
    }

    // Clear authentication cookies
    await clearAuthCookies();

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    // Ensure cookies are deleted in response
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    console.error('Sign out error:', error);

    // Even if there's an error, clear cookies and return success
    // This ensures the user can always sign out from the client side
    await clearAuthCookies();

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');

    return response;
  }
}
