import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import DiscountModel from '@dashboard/(ecommerce)/_types/Common/DiscountModel';

export default class DiscountService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getDiscountList = async (): Promise<Result<DiscountModel[]>> => {
    return Fetch.Get<Result<DiscountModel[]>>(CONFIG.API_BASEPATH + `/Common/GetDiscountHierarchy`, this.config);
  };
  getDiscountListForSelect = async (): Promise<Result<DiscountModel[]>> => {
    return Fetch.Get<Result<DiscountModel[]>>(CONFIG.API_BASEPATH + `/Common/GetDiscountListForSelect`, this.config);
  };
  getDiscountById = async (discountId : number): Promise<Result<DiscountModel>> => {
    const params = new URLSearchParams({ discountId: discountId.toString() });
    return Fetch.Get<Result<DiscountModel>>(CONFIG.API_BASEPATH + `/Common/getDiscountById?${params.toString()}`, this.config);
  };
  addDiscount = async (discount: DiscountModel): Promise<Result<DiscountModel>> => {
    return Fetch.Post<Result<DiscountModel>>(CONFIG.API_BASEPATH + '/Common/addDiscount', discount, this.config);
  };
  updateDiscount = async (discount: DiscountModel): Promise<Result<DiscountModel>> => {
    return Fetch.Post<Result<DiscountModel>>(CONFIG.API_BASEPATH + '/Common/updateDiscount', discount, this.config);
  };
  deleteDiscount = async (discountId : number): Promise<Result<DiscountModel>> => {
    const params = new URLSearchParams({ discountId: discountId.toString() });
    return Fetch.Get<Result<DiscountModel>>(CONFIG.API_BASEPATH + `/sale/deleteDiscount?${params.toString()}`, this.config);
  };
}
