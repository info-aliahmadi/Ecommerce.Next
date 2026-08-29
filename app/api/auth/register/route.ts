import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';
import ResultStatusEnum from '@root/app/types/enums/ResultStatusEnum';
import Result from '@root/app/types/Result';
import { User } from 'next-auth';

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
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        message: 'Failed to send OTP',
        status: ResultStatusEnum.ExceptionThrowed
      } as Result<User>,
    );
  }
}
