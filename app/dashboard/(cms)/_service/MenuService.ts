import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import MenuModel from '../_types/Menu/MenuModel';

export default class MenuService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getMenuList = async (): Promise<Result<MenuModel[]>> => {
    return Fetch.Get<Result<MenuModel[]>>(CONFIG.API_BASEPATH + `/cms/GetMenusHierarchy`, this.config);
  };
  getMenuById = async (menuId : number): Promise<Result<MenuModel>> => {
    const params = new URLSearchParams({ menuId: menuId.toString() });
    return Fetch.Get<Result<MenuModel>>(CONFIG.API_BASEPATH + `/cms/getMenuById?${params.toString()}`, this.config);
  };
  addMenu = async (menu: MenuModel): Promise<Result<MenuModel>> => {
    return Fetch.Post<Result<MenuModel>>(CONFIG.API_BASEPATH + '/cms/addMenu', menu, this.config);
  };
  updateMenu = async (menu: MenuModel): Promise<Result<MenuModel>> => {
    return Fetch.Post<Result<MenuModel>>(CONFIG.API_BASEPATH + '/cms/updateMenu', menu, this.config);
  };
  updateMenuOrders = async (menuList: MenuModel[]): Promise<Result<MenuModel[]>> => {
    return Fetch.Post<Result<MenuModel[]>>(CONFIG.API_BASEPATH + '/cms/updateMenuOrders', menuList, this.config);
  };
  deleteMenu = async (menuId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ menuId: menuId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/cms/deleteMenu?${params.toString()}`, this.config);
  }
}
