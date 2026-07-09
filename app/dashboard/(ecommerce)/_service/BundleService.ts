import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import BundleModel from '../_types/Product/BundleModel';
import CONFIG from '@root/config';

export default class BundleService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getBundleList = async (): Promise<Result<BundleModel[]>> => {
    return Fetch.Get<Result<BundleModel[]>>(CONFIG.API_BASEPATH + `/Product/getBundleList`, this.config);
  };

  getAllBundles = async (): Promise<Result<BundleModel[]>> => {
    return Fetch.Get<Result<BundleModel[]>>(CONFIG.API_BASEPATH + `/Product/getAllBundles`, this.config);
  };

  getBundleById = async (bundleId: number): Promise<Result<BundleModel>> => {
    const params = new URLSearchParams({ bundleId: bundleId.toString() });
    return Fetch.Get<Result<BundleModel>>(CONFIG.API_BASEPATH + `/Product/getBundleById?${params.toString()}`, this.config);
  };

  addBundle = async (bundle: BundleModel): Promise<Result<BundleModel>> => {
    return Fetch.Post<Result<BundleModel>>(CONFIG.API_BASEPATH + '/Product/addBundle', bundle, this.config);
  };

  updateBundle = async (bundle: BundleModel): Promise<Result<BundleModel>> => {
    return Fetch.Post<Result<BundleModel>>(CONFIG.API_BASEPATH + '/Product/updateBundle', bundle, this.config);
  };

  deleteBundle = async (bundleId: number): Promise<Result<null>> => {
    const params = new URLSearchParams({ bundleId: bundleId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Product/DeleteBundle?${params.toString()}`, this.config);
  };
}
