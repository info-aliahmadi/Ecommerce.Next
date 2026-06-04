import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import StateProvinceModel from '@dashboard/(ecommerce)/_types/Common/StateProvinceModel';
import GridDataBound from '@root/app/types/GridDataBound';
import CountryModel from '../_types/Common/CountryModel';

export default class StateProvinceService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  getStateProvinceList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<StateProvinceModel>>> => {
    return Fetch.Post<Result<PaginatedList<StateProvinceModel>>>(CONFIG.API_BASEPATH + '/Common/GetStateProvinceList', searchParams, this.config);
  };
  getStateProvinceListForSelect = async (): Promise<Result<StateProvinceModel[]>> => {
    return Fetch.Get<Result<StateProvinceModel[]>>(CONFIG.API_BASEPATH + `/Common/GetStateProvinceListForSelect`, this.config);
  };
  getStateProvinceById = async (stateProvinceId : number): Promise<Result<StateProvinceModel>> => {
    const params = new URLSearchParams({ stateProvinceId: stateProvinceId.toString() });
    return Fetch.Get<Result<StateProvinceModel>>(CONFIG.API_BASEPATH + `/Common/getStateProvinceById?${params.toString()}`, this.config);
  };
  addStateProvince = async (stateProvince: StateProvinceModel): Promise<Result<StateProvinceModel>> => {
    return Fetch.Post<Result<StateProvinceModel>>(CONFIG.API_BASEPATH + '/Common/addStateProvince', stateProvince, this.config);
  };
  updateStateProvince = async (stateProvince: StateProvinceModel): Promise<Result<StateProvinceModel>> => {
    return Fetch.Post<Result<StateProvinceModel>>(CONFIG.API_BASEPATH + '/Common/updateStateProvince', stateProvince, this.config);
  };
  deleteStateProvince = async (stateProvinceId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ stateProvinceId: stateProvinceId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Common/deleteStateProvince?${params.toString()}`, this.config);
  };
  
  getCountryListForSelect = async (): Promise<Result<CountryModel[]>> => {
    return Fetch.Get<Result<CountryModel[]>>(CONFIG.API_BASEPATH + '/Common/GetCountryListForSelect', this.config);
  };
}
