import CONFIG from '@root/config';
import { User } from 'next-auth';

import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import ForgotPassword from '../_types/User/ForgotPassword';

export default class AuthenticationService {
  config: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  }

  login = async (loginModel: LoginModel): Promise<Result<User>> => {
    return Fetch.Post<Result<User>>(CONFIG.API_BASEPATH_INTERNAL + "/Auth/Login", loginModel, this.config);
  };
  loginByOtp = async (addPhoneNumberModel: AddPhoneNumberModel): Promise<AccountResult> => {
    return Fetch.Post<AccountResult>(CONFIG.API_BASEPATH_INTERNAL + '/Auth/SendOtpCode', addPhoneNumberModel, this.config);
  };
  verifyOtpAndLogin = async (verifyPhoneNumberModel: VerifyPhoneNumberModel): Promise<Result<User>> => {
    return Fetch.Post<Result<User>>(CONFIG.API_BASEPATH_INTERNAL + '/Auth/VerifyOtpAndLogin', verifyPhoneNumberModel, this.config);
  };

  refreshToken = async (jwt: string): Promise<string> => {
    this.config = Fetch.SetDefaultHeader(jwt);
    return Fetch.Get<string>(CONFIG.API_BASEPATH_INTERNAL + '/Auth/RefreshToken', this.config);
  };

  register = async (registerModel: RegisterModel): Promise<AccountResult> => {
    return Fetch.Post<AccountResult>(CONFIG.API_BASEPATH_INTERNAL + '/Auth/Register', registerModel, this.config);
  };

  /* for users doesn't have password and just login by phone-number*/
  forgotPassword = async (forgotPassword: ForgotPassword): Promise<Result<boolean>> => {
    return Fetch.Post<Result<boolean>>(CONFIG.API_BASEPATH_INTERNAL + '/Auth/forgotPassword', forgotPassword, this.config);
  }

}
