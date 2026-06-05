import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import ShippingMethodModel from '../_types/Common/ShippingMethodModel';

export default class ShippingMethodService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getShippingMethodList = async (): Promise<Result<ShippingMethodModel[]>> => {
    return Fetch.Get<Result<ShippingMethodModel[]>>(CONFIG.API_BASEPATH + `/Common/GetShippingMethodList`, this.config);
  };
  getShippingMethodListForSelect = async (): Promise<Result<ShippingMethodModel[]>> => {
    return Fetch.Get<Result<ShippingMethodModel[]>>(CONFIG.API_BASEPATH + `/Common/GetShippingMethodListForSelect`, this.config);
  };
  getShippingMethodById = async (shippingMethodId: number): Promise<Result<ShippingMethodModel>> => {
    const params = new URLSearchParams({ shippingMethodId: shippingMethodId.toString() });
    return Fetch.Get<Result<ShippingMethodModel>>(CONFIG.API_BASEPATH + `/Common/getShippingMethodById?${params.toString()}`, this.config);
  };
  addShippingMethod = async (shippingMethod: ShippingMethodModel): Promise<Result<ShippingMethodModel>> => {
    return Fetch.Post<Result<ShippingMethodModel>>(CONFIG.API_BASEPATH + '/Common/addShippingMethod', shippingMethod, this.config);
  };
  updateShippingMethod = async (shippingMethod: ShippingMethodModel): Promise<Result<ShippingMethodModel>> => {
    return Fetch.Post<Result<ShippingMethodModel>>(CONFIG.API_BASEPATH + '/Common/updateShippingMethod', shippingMethod, this.config);
  };
  deleteShippingMethod = async (shippingMethodId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ shippingMethodId: shippingMethodId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Common/deleteShippingMethod?${params.toString()}`, this.config);
  };
}
