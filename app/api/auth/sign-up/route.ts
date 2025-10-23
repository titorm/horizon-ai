import { generateJWT } from '@/lib/auth/jwt';
import { getCookieOptions } from '@/lib/auth/session';
import { signUp } from '@/lib/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/sign-up
 * Register a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json({ message: 'Email, password, and first name are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Validate first name
    if (firstName.trim().length === 0) {
      return NextResponse.json({ message: 'First name cannot be empty' }, { status: 400 });
    }

    // Register user
    const authResponse = await signUp({
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName?.trim(),
    });

    // Generate JWT token
    const token = await generateJWT({
      userId: authResponse.id,
      email: authResponse.email,
      name: authResponse.firstName
        ? `${authResponse.firstName}${authResponse.lastName ? ' ' + authResponse.lastName : ''}`
        : undefined,
    });

    // Create response with user data
    const response = NextResponse.json(
      {
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
      },
      { status: 201 },
    );

    // Set authentication cookie
    const cookieOptions = getCookieOptions();
    response.cookies.set('auth_token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Sign up error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Email already in use')) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
      }

      if (error.message.includes('password')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
