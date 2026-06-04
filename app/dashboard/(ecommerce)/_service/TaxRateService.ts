import Fetch from '@root/utils/Fetch';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import GridDataBound from '@root/app/types/GridDataBound';
import CountryModel from '../_types/Common/CountryModel';
import TaxRateModel from '../_types/Common/TaxRateModel';

export default class TaxRateService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }
  getTaxRateList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<TaxRateModel>>> => {
    return Fetch.Post<Result<PaginatedList<TaxRateModel>>>(CONFIG.API_BASEPATH + '/Common/GetTaxRateList', searchParams, this.config);
  };
  getTaxRateListForSelect = async (): Promise<Result<TaxRateModel[]>> => {
    return Fetch.Get<Result<TaxRateModel[]>>(CONFIG.API_BASEPATH + `/Common/GetTaxRateListForSelect`, this.config);
  };
  getTaxRateById = async (taxRateId : number): Promise<Result<TaxRateModel>> => {
    const params = new URLSearchParams({ taxRateId: taxRateId.toString() });
    return Fetch.Get<Result<TaxRateModel>>(CONFIG.API_BASEPATH + `/Common/getTaxRateById?${params.toString()}`, this.config);
  };
  addTaxRate = async (taxRate: TaxRateModel): Promise<Result<TaxRateModel>> => {
    return Fetch.Post<Result<TaxRateModel>>(CONFIG.API_BASEPATH + '/Common/addTaxRate', taxRate, this.config);
  };
  updateTaxRate = async (taxRate: TaxRateModel): Promise<Result<TaxRateModel>> => {
    return Fetch.Post<Result<TaxRateModel>>(CONFIG.API_BASEPATH + '/Common/updateTaxRate', taxRate, this.config);
  };
  deleteTaxRate = async (taxRateId : number): Promise<Result<null>> => {
    const params = new URLSearchParams({ taxRateId: taxRateId.toString() });
    return Fetch.Get<Result<null>>(CONFIG.API_BASEPATH + `/Common/deleteTaxRate?${params.toString()}`, this.config);
  };
  
  getCountryListForSelect = async (): Promise<Result<CountryModel[]>> => {
    return Fetch.Get<Result<CountryModel[]>>(CONFIG.API_BASEPATH + '/Common/GetCountryListForSelect', this.config);
  };
}
