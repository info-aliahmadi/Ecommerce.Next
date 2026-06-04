import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import TaxCategoryModel from '../_types/Common/TaxCategoryModel';

export default class TaxCategoryService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getTaxCategoryList = async (): Promise<Result<TaxCategoryModel[]>> => {
    return Fetch.Get<Result<TaxCategoryModel[]>>(CONFIG.API_BASEPATH + `/Common/GetTaxCategoryList`, this.config);
  };

  getTaxCategoryItemList = async (taxCategoryId : number): Promise<Result<TaxCategoryModel[]>> => {
    const params = new URLSearchParams({ taxCategoryId: taxCategoryId.toString() });
    return Fetch.Get<Result<TaxCategoryModel[]>>(CONFIG.API_BASEPATH + `/Common/GetTaxCategoryItemList?${params.toString()}`, this.config);
  };
  getAllTaxCategorys = async (): Promise<Result<TaxCategoryModel[]>> => {
    return Fetch.Get<Result<TaxCategoryModel[]>>(CONFIG.API_BASEPATH + `/Common/getAllTaxCategorys`, this.config);
  };
  getTaxCategoryById = async (taxCategoryId : number): Promise<Result<TaxCategoryModel>> => {
    const params = new URLSearchParams({ taxCategoryId: taxCategoryId.toString() });
    return Fetch.Get<Result<TaxCategoryModel>>(CONFIG.API_BASEPATH + `/Common/getTaxCategoryById?${params.toString()}`, this.config);
  };
  addTaxCategory = async (taxCategory: TaxCategoryModel): Promise<Result<TaxCategoryModel>> => {
    return Fetch.Post<Result<TaxCategoryModel>>(CONFIG.API_BASEPATH + '/Common/addTaxCategory', taxCategory, this.config);
  };
  updateTaxCategory = async (taxCategory: TaxCategoryModel): Promise<Result<TaxCategoryModel>> => {
    return Fetch.Post<Result<TaxCategoryModel>>(CONFIG.API_BASEPATH + '/Common/updateTaxCategory', taxCategory, this.config);
  };
  deleteTaxCategory = async (taxCategoryId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ taxCategoryId: taxCategoryId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Common/deleteTaxCategory?${params.toString()}`, this.config);
  };
}
