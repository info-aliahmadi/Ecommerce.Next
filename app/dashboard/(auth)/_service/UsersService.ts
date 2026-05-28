import CONFIG from '@root/config';

import { UserModel } from '../_types/User/UserModel';
import Fetch from '@root/utils/Fetch';
import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';

export default class UsersService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getUserList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<UserModel>>> => {
    return Fetch.Post<Result<PaginatedList<UserModel>>>(CONFIG.API_BASEPATH + '/auth/GetUserList', searchParams, this.config);
  };

  getUserListForSelect = async (input: string): Promise<Result<UserModel[]>> => {
    return Fetch.Post<Result<UserModel[]>>(CONFIG.API_BASEPATH + `/auth/GetUserListForSelect`,input, this.config);
  };

  getUserListForSelectByIds = async (userIds: number[]): Promise<Result<UserModel[]>> => {
    return Fetch.Post<Result<UserModel[]>>(CONFIG.API_BASEPATH + `/auth/GetUserListForSelectByIds`,userIds, this.config);
  };

  getUserById = async (userId: number): Promise<UserModel> => {
    const params = new URLSearchParams({ userId: userId.toString() });
    return Fetch.Get<UserModel>(CONFIG.API_BASEPATH + `/auth/getUserById?${params.toString()}`, this.config);
  };

  addUser = async (user: UserModel): Promise<UserModel> => {
    return Fetch.Post<UserModel>(CONFIG.API_BASEPATH + '/auth/addUser', user, this.config);
  };

  updateUser = async (user: UserModel): Promise<UserModel> => {
    return Fetch.Post<UserModel>(CONFIG.API_BASEPATH + '/auth/updateUser', user, this.config);
  };

  deleteUser = async (userId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ userId: userId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/deleteUser?${params.toString()}`, this.config);
  };
}
