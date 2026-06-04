import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import ProductAttributeModel from '../_types/Product/ProductAttributeModel';


export default class ProductAttributeService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getProductAttributeList = async (): Promise<Result<ProductAttributeModel[]>> => {
    return Fetch.Get<Result<ProductAttributeModel[]>>(CONFIG.API_BASEPATH + `/Product/getProductAttributeList`, this.config);
  };

  getProductAttributeListForSelect = async (): Promise<Result<ProductAttributeModel[]>> => {
    return Fetch.Get<Result<ProductAttributeModel[]>>(CONFIG.API_BASEPATH + `/Product/getProductAttributesForSelect`, this.config);
  };

  getAllProductAttributes = async (): Promise<Result<ProductAttributeModel[]>> => {
    return Fetch.Get<Result<ProductAttributeModel[]>>(CONFIG.API_BASEPATH + `/Product/getAllProductAttributes`, this.config);
  };
  getProductAttributeById = async (productAttributeId : number): Promise<Result<ProductAttributeModel>> => {
    const params = new URLSearchParams({ productAttributeId: productAttributeId.toString() });
    return Fetch.Get<Result<ProductAttributeModel>>(CONFIG.API_BASEPATH + `/Product/getProductAttributeById?${params.toString()}`, this.config);
  };
  addProductAttribute = async (productAttribute: ProductAttributeModel): Promise<Result<ProductAttributeModel>> => {
    return Fetch.Post<Result<ProductAttributeModel>>(CONFIG.API_BASEPATH + '/Product/addProductAttribute', productAttribute, this.config);
  };
  updateProductAttribute = async (productAttribute: ProductAttributeModel): Promise<Result<ProductAttributeModel>> => {
    return Fetch.Post<Result<ProductAttributeModel>>(CONFIG.API_BASEPATH + '/Product/updateProductAttribute', productAttribute, this.config);

  };
  deleteProductAttribute = async (productAttributeId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ productAttributeId: productAttributeId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Product/deleteProductAttribute?${params.toString()}`, this.config);
  };
}
