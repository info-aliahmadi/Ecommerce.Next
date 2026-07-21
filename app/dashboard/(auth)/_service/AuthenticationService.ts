import CONFIG from '@root/config';
import { User } from 'next-auth';

import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';

export default class AuthenticationService {
  config: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'fa',
    },
  }

  login = async (loginModel: LoginModel): Promise<Result<User>> => {

    return Fetch.Post<Result<User>>(CONFIG.LOGIN_API_PATH, loginModel, this.config);
  };
  loginByOtp = async (addPhoneNumberModel: AddPhoneNumberModel): Promise<AccountResult> => {
    return Fetch.Post<AccountResult>(CONFIG.API_BASEPATH + '/Auth/SendOtpCode', addPhoneNumberModel, this.config);
  };
  verifyOtpAndLogin = async (verifyPhoneNumberModel: VerifyPhoneNumberModel): Promise<Result<User>> => {
    return Fetch.Post<Result<User>>(CONFIG.API_BASEPATH + '/Auth/VerifyOtpAndLogin', verifyPhoneNumberModel, this.config);
  };

  refreshToken = async (jwt: string): Promise<string> => {
    this.config = Fetch.SetDefaultHeader(jwt);
    return Fetch.Get<string>(CONFIG.REFRESH_TOKEN_API_PATH, this.config);
  };

  register = async (registerModel: RegisterModel): Promise<Result<User>> => {

    return Fetch.Post<Result<User>>(CONFIG.API_BASEPATH + '/Auth/Register', registerModel, this.config);
  };
}
