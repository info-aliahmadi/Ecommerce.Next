import { NextRequest, NextResponse } from 'next/server';
import AuthenticationService from '@root/app/dashboard/(auth)/_service/AuthenticationService';
import Result from '@root/app/types/Result';
import ResultStatusEnum from '@root/app/types/enums/ResultStatusEnum';

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

    let addPhoneNumberModel: AddPhoneNumberModel = { phoneNumber: phoneNumber };

    const result = await service.loginByOtp(addPhoneNumberModel);

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        message: 'Failed to send OTP',
        status: ResultStatusEnum.ExceptionThrowed
      } as Result<AccountResult>,
    );
  }
}
