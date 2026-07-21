import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = body;

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      return NextResponse.json(
        { succeeded: false, message: 'Valid phone number is required' },
        { status: 400 },
      );
    }

    if (!code || code.length < 4) {
      return NextResponse.json(
        { succeeded: false, message: 'Valid verification code is required' },
        { status: 400 },
      );
    }

    const service = new AuthenticationService();
    const result = await service.verifyOtpAndLogin({
      phoneNumber,
      code,
      rememberMe: true,
    });

    if (!result.succeeded) {
      return NextResponse.json(
        { succeeded: false, message: result.message || 'Invalid or expired code' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      succeeded: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      { succeeded: false, message: 'Verification failed' },
      { status: 500 },
    );
  }
}
