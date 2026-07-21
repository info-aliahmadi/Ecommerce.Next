import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      return NextResponse.json(
        { succeeded: false, message: 'Valid phone number is required' },
        { status: 400 },
      );
    }

    const service = new AuthenticationService();
    const result = await service.loginByOtp({ phoneNumber });

    if (!result.succeeded) {
      return NextResponse.json(
        { succeeded: false, message: result.message || 'Failed to send OTP' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      succeeded: true,
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { succeeded: false, message: 'Failed to send OTP' },
      { status: 500 },
    );
  }
}
