import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phoneNumber } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { code: 'INVALID_NAME', message: 'Name is required' },
        { status: 400 },
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { code: 'INVALID_EMAIL', message: 'Valid email is required' },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { code: 'INVALID_PASSWORD', message: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      return NextResponse.json(
        { code: 'INVALID_PHONE', message: 'Valid phone number is required' },
        { status: 400 },
      );
    }

    const registerModel: RegisterModel = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      phoneNumber: phoneNumber.trim(),
    };

    const service = new AuthenticationService();
    const result = await service.register(registerModel);

    if (!result.succeeded) {
      const code = (result as any).code === 'PHONE_EXISTS' ? 'PHONE_EXISTS' : 'REGISTER_FAILED';
      return NextResponse.json(
        { code, message: result.message || 'Registration failed' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    if (error?.code === 'PHONE_EXISTS') {
      return NextResponse.json(
        { code: 'PHONE_EXISTS', message: 'Phone number already registered' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { code: 'REGISTER_FAILED', message: 'Registration failed' },
      { status: 500 },
    );
  }
}
