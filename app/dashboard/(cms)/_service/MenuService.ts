import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';

export default class MenuService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getMenuList = async (): Promise<Result<MenuModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/GetMenusHierarchy')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getMenuById = async (menuId : number): Promise<Result<MenuModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/getMenuById', { params: { menuId: menuId } })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addMenu = async (menu: MenuModel): Promise<Result<MenuModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/addMenu', menu)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateMenu = async (menu: MenuModel): Promise<Result<MenuModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateMenu', menu)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateMenuOrders = async (menuList: MenuModel[]): Promise<Result<MenuModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/cms/updateMenuOrders', menuList)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteMenu = async (menuId : number): Promise<Result<null>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/cms/deleteMenu', { params: { menuId: menuId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
