import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import SubscribeModel from '../_types/SubscribeModel';

export default class SubscribeService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  
  getSubscribeList = async (searchParams:  GridDataBound): Promise<Result<PaginatedList<SubscribeModel>>> => {
    return Fetch.Post<Result<PaginatedList<SubscribeModel>>>(CONFIG.API_BASEPATH + '/crm/GetSubscribeList', searchParams, this.config);
  };
  getAllSubscribes = async (): Promise<Result<SubscribeModel[]>> => {
    return Fetch.Get<Result<SubscribeModel[]>>(CONFIG.API_BASEPATH + `/crm/GetAllSubscribes`, this.config);
  };
  getSubscribeById = async (subscribeId : number): Promise<Result<SubscribeModel>> => {
    const params = new URLSearchParams({ subscribeId: subscribeId.toString() });
    return Fetch.Get<Result<SubscribeModel>>(CONFIG.API_BASEPATH + `/crm/getSubscribeById?${params.toString()}`, this.config);

  };
  addSubscribe = async (subscribe : SubscribeModel): Promise<Result<SubscribeModel>> => {
    return Fetch.Post<Result<SubscribeModel>>(CONFIG.API_BASEPATH + '/crm/addSubscribe', subscribe, this.config);
  };
  updateSubscribe = async (subscribe : SubscribeModel): Promise<Result<SubscribeModel>> => {
    return Fetch.Post<Result<SubscribeModel>>(CONFIG.API_BASEPATH + '/crm/updateSubscribe', subscribe, this.config);
  };
  deleteSubscribe = async (subscribeId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ subscribeId: subscribeId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/crm/deleteSubscribe?${params.toString()}`, this.config);
  };

  getSubscribeLabelForSelect = async (): Promise<Result<SubscribeModel[]>> => {
    return Fetch.Get<Result<SubscribeModel[]>>(CONFIG.API_BASEPATH + `/crm/GetSubscribeLabelListForSelect`, this.config);
  };
}
