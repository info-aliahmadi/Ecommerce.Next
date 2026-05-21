import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import CategoryModel from '@dashboard/(ecommerce)/_types/Product/CategoryModel';

export default class CategoryService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getCategoryList = async (): Promise<Result<CategoryModel[]>> => {
    return Fetch.Get<Result<CategoryModel[]>>(CONFIG.API_BASEPATH + `/Product/GetCategoryHierarchy`, this.config);
  };
  getCategoryListForSelect = async (): Promise<Result<CategoryModel[]>> => {
    return Fetch.Get<Result<CategoryModel[]>>(CONFIG.API_BASEPATH + `/Product/GetCategoryListForSelect`, this.config);
  };
  getCategoryById = async (categoryId : number): Promise<Result<CategoryModel>> => {
    const params = new URLSearchParams({ categoryId: categoryId.toString() });
    return Fetch.Get<Result<CategoryModel>>(CONFIG.API_BASEPATH + `/Product/getCategoryById?${params.toString()}`, this.config);
  };
  addCategory = async (category: CategoryModel): Promise<Result<CategoryModel>> => {
    return Fetch.Post<Result<CategoryModel>>(CONFIG.API_BASEPATH + '/Product/addCategory', category, this.config);
  };
  updateCategory = async (category: CategoryModel): Promise<Result<CategoryModel>> => {
    return Fetch.Post<Result<CategoryModel>>(CONFIG.API_BASEPATH + '/Product/updateCategory', category, this.config);
  };
  // create function to order categories
  updateOrderCategories = async (categories: CategoryModel[]): Promise<Result<CategoryModel[]>> => {
    return Fetch.Post<Result<CategoryModel[]>>(CONFIG.API_BASEPATH + '/Product/UpdateCategoryOrders', categories, this.config);
  };
  
  deleteCategory = async (categoryId : number): Promise<Result<CategoryModel>> => {
    const params = new URLSearchParams({ categoryId: categoryId.toString() });
    return Fetch.Get<Result<CategoryModel>>(CONFIG.API_BASEPATH + `/Product/deleteCategory?${params.toString()}`, this.config);
  };
}
