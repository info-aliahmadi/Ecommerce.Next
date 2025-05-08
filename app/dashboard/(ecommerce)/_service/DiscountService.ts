import axios from 'axios';
import CONFIG from '@root/config';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import Result from '@root/app/types/Result';
import DiscountModel from '@dashboard/(ecommerce)/_types/Common/DiscountModel';

export default class DiscountService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getDiscountList = async (): Promise<Result<DiscountModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetDiscountHierarchy')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDiscountListForSelect = async (): Promise<Result<DiscountModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetDiscountListForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDiscountById = async (discountId : number): Promise<Result<DiscountModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getDiscountById', { params: { discountId: discountId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addDiscount = async (discount: DiscountModel): Promise<Result<DiscountModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addDiscount', discount)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateDiscount = async (discount: DiscountModel): Promise<Result<DiscountModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateDiscount', discount)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteDiscount = async (discountId : number): Promise<Result<DiscountModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteDiscount', { params: { discountId: discountId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
