import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import ProductTagModel from '../_types/Product/ProductTagModel';

export default class ProductTagService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getProductTagList = async (searchParams: GridDataBound): Promise<Result<ProductTagModel[]>> => {
    return Fetch.Post<Result<ProductTagModel[]>>(CONFIG.API_BASEPATH + '/Product/GetProductTagList', searchParams, this.config);
  };

  getProductTagListForSelect = async (): Promise<Result<ProductTagModel[]>> => {
    return Fetch.Get<Result<ProductTagModel[]>>(CONFIG.API_BASEPATH + `/Product/GetProductTagListForSelect`, this.config);
  };

  getProductTagItemList = async (productTagId : number): Promise<Result<ProductTagModel[]>> => {
    const params = new URLSearchParams({ productTagId: productTagId.toString() });
    return Fetch.Get<Result<ProductTagModel[]>>(CONFIG.API_BASEPATH + `/Product/GetProductTagItemList?${params.toString()}`, this.config);
  };

  getAllProductTags = async (): Promise<Result<ProductTagModel[]>> => {
    return Fetch.Get<Result<ProductTagModel[]>>(CONFIG.API_BASEPATH + `/Product/getAllProductTags`, this.config);
  };

  getProductTagById = async (productTagId : number): Promise<Result<ProductTagModel>> => {
    const params = new URLSearchParams({ productTagId: productTagId.toString() });
    return Fetch.Get<Result<ProductTagModel>>(CONFIG.API_BASEPATH + `/Product/getProductTagById?${params.toString()}`, this.config);
  };

  addProductTag = async (productTag: ProductTagModel): Promise<Result<ProductTagModel>> => {
    return Fetch.Post<Result<ProductTagModel>>(CONFIG.API_BASEPATH + '/Product/addProductTag', productTag, this.config);
  };
  updateProductTag = async (productTag: ProductTagModel): Promise<Result<ProductTagModel>> => {
    return Fetch.Post<Result<ProductTagModel>>(CONFIG.API_BASEPATH + '/Product/updateProductTag', productTag, this.config);

  };
  deleteProductTag = async (productTagId : number): Promise<Result<ProductTagModel>> => {
    const params = new URLSearchParams({ productTagId: productTagId.toString() });
    return Fetch.Get<Result<ProductTagModel>>(CONFIG.API_BASEPATH + `/Product/deleteProductTag?${params.toString()}`, this.config);
  };
}
