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
        .post(CONFIG.API_BASEPATH + '/Common/GetTaxCategoryList')
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
        .get(CONFIG.API_BASEPATH + `/Common/GetTaxCategoryItemList?taxCategoryId=${taxCategoryId}`)
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
        .get(CONFIG.API_BASEPATH + '/Common/getAllTaxCategorys')
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
        .get(CONFIG.API_BASEPATH + '/Common/getTaxCategoryById', { params: { taxCategoryId: taxCategoryId } })
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
        .post(CONFIG.API_BASEPATH + '/Common/addTaxCategory', taxCategory)
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
        .post(CONFIG.API_BASEPATH + '/Common/updateTaxCategory', taxCategory)
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
        .get(CONFIG.API_BASEPATH + '/Common/deleteTaxCategory', { params: { taxCategoryId: taxCategoryId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
