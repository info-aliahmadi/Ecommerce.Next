import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';
import ForgotPassword from '@root/app/dashboard/(auth)/_types/User/ForgotPassword';

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

    const service = new AuthenticationService();

    let forgotModel: ForgotPassword = {
      email: email.trim()
    }
    const result = await service.forgotPassword(forgotModel);

    return NextResponse.json(result);

  } catch (error) {
    if (error === 'PHONE_EXISTS') {
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
