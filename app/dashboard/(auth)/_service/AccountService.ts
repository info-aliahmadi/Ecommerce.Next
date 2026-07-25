import CONFIG from '@root/config';
import { UserModel } from '../_types/User/UserModel';

import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import ChangePassword from '../_types/User/ChangePassword';
import AddPassword from '../_types/User/AddPassword';
import ForgotPassword from '../_types/User/ForgotPassword';
import ThemeType from '@root/app/types/enums/ThemeType';

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
  /* check whether user has password or not */
  hasPassword = async (): Promise<Result<boolean>> => {
    return Fetch.Get<Result<boolean>>(CONFIG.API_BASEPATH + '/auth/HasPassword', this.config);
  }
  /* for users doesn't have password and just login by phone-number*/
  addPassword = async (addPassword: AddPassword) => {
    return Fetch.Post<Result<UserModel>>(CONFIG.API_BASEPATH + '/auth/AddPassword', addPassword, this.config);
  }
  setDefaultTheme = async (defaultTheme: ThemeType) => {
    const params = new URLSearchParams({ defaultTheme: defaultTheme.toString() });
    return Fetch.Get<UserModel>(CONFIG.API_BASEPATH + `/auth/SetDefaultTheme?${params.toString()}`, this.config);
  };

  deleteCurrentUser = async (): Promise<Result<null>> => {
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + "/auth/DeleteCurrentUser", this.config);
  };
}
