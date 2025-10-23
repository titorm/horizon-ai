import { getSession } from '@/lib/auth/session';
import { getCurrentUser } from '@/lib/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/me
 * Get current authenticated user data
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from token
    const session = await getSession();

    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Get complete user data from database
    const userData = await getCurrentUser(session.user.sub);

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.auth.$id,
        email: userData.auth.email,
        name: userData.auth.name,
        emailVerification: userData.auth.emailVerification,
      },
      profile: userData.profile,
      preferences: userData.preferences,
      settings: userData.settings,
    });
  } catch (error) {
    console.error('Get current user error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      if (error.message.includes('Unauthorized') || error.message.includes('Invalid')) {
        return NextResponse.json({ message: 'Invalid or expired session' }, { status: 401 });
      }

      return NextResponse.json({ message: error.message || 'Failed to get user data' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Failed to get user data' }, { status: 500 });
  }
}
