import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';


import Fetch from '@root/utils/Fetch';

export default class PermissionService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getPermissionList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<Permission>>> => {
    return Fetch.Post<Result<PaginatedList<Permission>>>(CONFIG.API_BASEPATH + '/auth/GetPermissionList', searchParams, this.config);
  };

  getPermissionById = async (permissionId: number): Promise<Result<Permission>> => {
    const params = new URLSearchParams({ permissionId: permissionId.toString() });
    return Fetch.Get<Result<Permission>>(CONFIG.API_BASEPATH + `/auth/getPermissionById?${params.toString()}`, this.config);
  };

  getPermissionsByName = async (name: string): Promise<Result<Permission[]>> => {
    const params = new URLSearchParams({ name: name });
    return Fetch.Get<Result<Permission[]>>(CONFIG.API_BASEPATH + `/auth/GetPermissionsByName?${params.toString()}`, this.config);
  };

  addPermission = async (permission: Permission): Promise<Result<Permission>> => {
    return Fetch.Post<Result<Permission>>(CONFIG.API_BASEPATH + '/auth/addPermission', permission, this.config);
  };

  updatePermission = async (permission: Permission): Promise<Result<Permission>> => {
    return Fetch.Post<Result<Permission>>(CONFIG.API_BASEPATH + '/auth/updatePermission', permission, this.config);
  };

  deletePermission = async (permissionId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ permissionId: permissionId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/auth/deletePermission?${params.toString()}`, this.config);
  };
}
