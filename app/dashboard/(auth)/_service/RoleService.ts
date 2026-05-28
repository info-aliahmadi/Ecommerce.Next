import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';


import Fetch from '@root/utils/Fetch';

export default class RoleService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getRoleList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<RoleModel>>> => {
    return Fetch.Post<Result<PaginatedList<RoleModel>>>(CONFIG.API_BASEPATH + '/auth/GetRoleList', searchParams, this.config);
  };

  getAllRoles = async (): Promise<Result<RoleModel[]>> => {
    return Fetch.Get<Result<RoleModel[]>>(CONFIG.API_BASEPATH + `/auth/GetAllRoles`, this.config);
  };

  getRoleById = async (roleId: number): Promise<Result<RoleModel>> => {
    const params = new URLSearchParams({ roleId: roleId.toString() });
    return Fetch.Get<Result<RoleModel>>(CONFIG.API_BASEPATH + `/auth/getRoleById?${params.toString()}`, this.config);
  };

  addRole = async (role: RoleModel): Promise<Result<RoleModel>> => {
    return Fetch.Post<Result<RoleModel>>(CONFIG.API_BASEPATH + '/auth/addRole', role, this.config);
  };

  updateRole = async (role: RoleModel): Promise<Result<RoleModel>> => {
    return Fetch.Post<Result<RoleModel>>(CONFIG.API_BASEPATH + '/auth/updateRole', role, this.config);
  };

  deleteRole = async (roleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ roleId: roleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/deleteRole?${params.toString()}`, this.config);
  };
}
  