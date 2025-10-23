import { generateJWT } from '@/lib/auth/jwt';
import { getCookieOptions } from '@/lib/auth/session';
import { signIn } from '@/lib/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/sign-in
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Authenticate user
    const authResponse = await signIn({ email, password });

    // Generate JWT token
    const token = await generateJWT({
      userId: authResponse.id,
      email: authResponse.email,
      name: authResponse.firstName
        ? `${authResponse.firstName}${authResponse.lastName ? ' ' + authResponse.lastName : ''}`
        : undefined,
    });

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: authResponse.id,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
      },
      profile: authResponse.profile,
      preferences: authResponse.preferences,
      settings: authResponse.settings,
    });

    // Set authentication cookie
    const cookieOptions = getCookieOptions();
    response.cookies.set('auth_token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Sign in error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }

      return NextResponse.json({ message: error.message || 'Authentication failed' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 });
  }
}
