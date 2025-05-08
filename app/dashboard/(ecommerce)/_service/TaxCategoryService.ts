import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import TaxCategoryModel from '../_types/Common/TaxCategoryModel';

export default class TaxCategoryService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getTaxCategoryList = async (): Promise<Result<TaxCategoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetTaxCategoryList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getTaxCategoryItemList = async (taxCategoryId : number): Promise<Result<TaxCategoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + `/sale/GetTaxCategoryItemList?taxCategoryId=${taxCategoryId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getAllTaxCategorys = async (): Promise<Result<TaxCategoryModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getAllTaxCategorys')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getTaxCategoryById = async (taxCategoryId : number): Promise<Result<TaxCategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getTaxCategoryById', { params: { taxCategoryId: taxCategoryId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addTaxCategory = async (taxCategory: TaxCategoryModel): Promise<Result<TaxCategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addTaxCategory', taxCategory)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateTaxCategory = async (taxCategory: TaxCategoryModel): Promise<Result<TaxCategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateTaxCategory', taxCategory)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteTaxCategory = async (taxCategoryId : number): Promise<Result<TaxCategoryModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteTaxCategory', { params: { taxCategoryId: taxCategoryId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
