import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';

import ManufacturerModel from '../_types/Product/ManufacturerModel';

export default class ManufacturerService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getManufacturerList = async (): Promise<Result<ManufacturerModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/getManufacturerList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getManufacturerListForSelect = async (): Promise<Result<ManufacturerModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/getManufacturersForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllManufacturers = async (): Promise<Result<ManufacturerModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getAllManufacturers')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getManufacturerById = async (manufacturerId : number): Promise<Result<ManufacturerModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getManufacturerById', { params: { manufacturerId: manufacturerId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addManufacturer = async (manufacturer: ManufacturerModel): Promise<Result<ManufacturerModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addManufacturer', manufacturer)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateManufacturer = async (manufacturer: ManufacturerModel): Promise<Result<ManufacturerModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateManufacturer', manufacturer)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteManufacturer = async (manufacturerId : number): Promise<Result<ManufacturerModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteManufacturer', { params: { manufacturerId: manufacturerId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
