import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import CurrencyModel from '@dashboard/(ecommerce)/_types/Common/CurrencyModel';
import Result from '@root/app/types/Result';


export default class CurrencyService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getCurrencyList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<CurrencyModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetCurrencyList', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getAllCurrencies = async (): Promise<Result<CurrencyModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getAllCurrencies')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getCurrencyById = async (currencyId : number): Promise<Result<CurrencyModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getCurrencyById', { params: { currencyId: currencyId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addCurrency = async (currency: CurrencyModel): Promise<Result<CurrencyModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addCurrency', currency)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateCurrency = async (currency: CurrencyModel): Promise<Result<CurrencyModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateCurrency', currency)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteCurrency = async (currencyId : number): Promise<Result<CurrencyModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteCurrency', { params: { currencyId: currencyId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
