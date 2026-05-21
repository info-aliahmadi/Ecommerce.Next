import CONFIG from '@root/config';
import { UserModel } from '../_types/User/UserModel';

import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';

export default class AccountService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getCurrentUser = async (): Promise<UserModel> => {
    return Fetch.Get<UserModel>(CONFIG.API_BASEPATH + `/auth/getCurrentUser`, this.config);
  };

  refreshToken = async (): Promise<string> => {
    return Fetch.Get<string>(CONFIG.REFRESH_TOKEN_API_PATH, this.config);
  };

  updateCurrentUser = async (user: UserModel): Promise<Result<UserModel>> => {
    return Fetch.Post<Result<UserModel>>(CONFIG.API_BASEPATH + '/auth/updateCurrentUser', user, this.config);
  };
  changePassword = async (password: ChangePassword) => {
    return Fetch.Post<Result<UserModel>>(CONFIG.API_BASEPATH + '/auth/changePassword', password, this.config);
  }

  setDefaultTheme = async (defaultTheme: 'light' | 'dark') => {
    const params = new URLSearchParams({ defaultTheme: defaultTheme });
    return Fetch.Get<UserModel>(CONFIG.API_BASEPATH + `/auth/SetDefaultTheme?${params.toString()}`, this.config);
  };

}
