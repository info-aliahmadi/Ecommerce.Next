import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import ProductModel from '../_types/Product/ProductModel';


export default class ProductService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getProductList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<ProductModel>>> => {
    return Fetch.Post<Result<PaginatedList<ProductModel>>>(CONFIG.API_BASEPATH + '/Product/GetProductList', searchParams, this.config);
  };

  getProductItemList = async (productId: number): Promise<Result<ProductModel[]>> => {
    const params = new URLSearchParams({ productId: productId.toString() });
    return Fetch.Get<Result<ProductModel[]>>(CONFIG.API_BASEPATH + `/Product/GetProductItemList?${params.toString()}`, this.config);
  };
  getAllProducts = async (): Promise<Result<ProductModel[]>> => {
    return Fetch.Get<Result<ProductModel[]>>(CONFIG.API_BASEPATH + `/Product/getAllProducts`, this.config);
  };
  getProductById = async (productId: number): Promise<Result<ProductModel>> => {
    const params = new URLSearchParams({ productId: productId.toString() });
    return Fetch.Get<Result<ProductModel>>(CONFIG.API_BASEPATH + `/Product/getProductById?${params.toString()}`, this.config);
  };
  getProductsByIds = async (productIds: number[]): Promise<Result<ProductModel[]>> => {
    const params = new URLSearchParams({ productIds: productIds.join(',') });
    return Fetch.Get<Result<ProductModel[]>>(CONFIG.API_BASEPATH + `/Product/getProductsByIds?${params.toString()}`, this.config);
  };
  getProductsByInput = async (input: string): Promise<Result<ProductModel[]>> => {
    const params = new URLSearchParams({ input: input.toString() });
    return Fetch.Get<Result<ProductModel[]>>(CONFIG.API_BASEPATH + `/Product/getProductsByInput?${params.toString()}`, this.config);
  };
  addProduct = async (product: ProductModel): Promise<Result<ProductModel>> => {
    return Fetch.Post<Result<ProductModel>>(CONFIG.API_BASEPATH + '/Product/addProduct', product, this.config);
  };
  updateProduct = async (product: ProductModel): Promise<Result<ProductModel>> => {
    return Fetch.Post<Result<ProductModel>>(CONFIG.API_BASEPATH + '/Product/updateProduct', product, this.config);

  };
  deleteProduct = async (productId: number): Promise<Result<ProductModel>> => {
    const params = new URLSearchParams({ productId: productId.toString() });
    return Fetch.Get<Result<ProductModel>>(CONFIG.API_BASEPATH + `/Product/deleteProduct?${params.toString()}`, this.config);
  };
  removeProduct = async (productId: number): Promise<Result<ProductModel>> => {
    const params = new URLSearchParams({ productId: productId.toString() });
    return Fetch.Get<Result<ProductModel>>(CONFIG.API_BASEPATH + `/Product/removeProduct?${params.toString()}`, this.config);
  };
}
