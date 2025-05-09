import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import DeliveryDateModel from '@dashboard/(ecommerce)/_types/Common/DeliveryDateModel';
import Result from '@root/app/types/Result';

export default class DeliveryDateService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getDeliveryDateList = async (): Promise<Result<DeliveryDateModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Common/GetDeliveryDateList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getDeliveryDateItemList = async (deliveryDateId : number): Promise<Result<DeliveryDateModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + `/Common/GetDeliveryDateItemList?deliveryDateId=${deliveryDateId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getAllDeliveryDates = async (): Promise<Result<DeliveryDateModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Common/getAllDeliveryDates')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getDeliveryDateById = async (deliveryDateId : number): Promise<Result<DeliveryDateModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Common/getDeliveryDateById', { params: { deliveryDateId: deliveryDateId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addDeliveryDate = async (deliveryDate: DeliveryDateModel): Promise<Result<DeliveryDateModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Common/addDeliveryDate', deliveryDate)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateDeliveryDate = async (deliveryDate: DeliveryDateModel): Promise<Result<DeliveryDateModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Common/updateDeliveryDate', deliveryDate)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteDeliveryDate = async (deliveryDateId : number): Promise<Result<DeliveryDateModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Common/deleteDeliveryDate', { params: { deliveryDateId: deliveryDateId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
