import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';


import Fetch from '@root/utils/Fetch';

export default class PermissionRoleService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getPermissionList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<Permission>>> => {
    return Fetch.Post<Result<PaginatedList<Permission>>>(CONFIG.API_BASEPATH + '/auth/GetPermissionRoleList', searchParams, this.config);
  };

  addPermissionRole = async (permissionId: number, roleId: number): Promise<Result<Permission>> => {
    const params = new URLSearchParams({ roleId: roleId.toString(), permissionId: permissionId.toString() });
    return Fetch.Get<Result<Permission>>(CONFIG.API_BASEPATH + `/auth/AssignPermissionToRoleByRoleId?${params.toString()}`, this.config);
  };
  
  deletePermissionRole = async (permissionId: number, roleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ roleId: roleId.toString(), permissionId: permissionId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/DismissPermissionToRoleByRoleId?${params.toString()}`, this.config);
  };
}
