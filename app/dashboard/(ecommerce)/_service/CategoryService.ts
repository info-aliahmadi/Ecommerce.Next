import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';
import CategoryModel from '@dashboard/(ecommerce)/_types/Product/CategoryModel';

export default class CategoryService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getCategoryList = async (): Promise<Result<CategoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetCategoryHierarchy')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getCategoryListForSelect = async (): Promise<Result<CategoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetCategoryListForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getCategoryById = async (categoryId : number): Promise<Result<CategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getCategoryById', { params: { categoryId: categoryId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addCategory = async (category: CategoryModel): Promise<Result<CategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addCategory', category)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateCategory = async (category: CategoryModel): Promise<Result<CategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateCategory', category)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteCategory = async (categoryId : number): Promise<Result<CategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteCategory', { params: { categoryId: categoryId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
