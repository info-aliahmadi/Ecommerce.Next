import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import ProductAttributeModel from '../_types/Product/ProductAttributeModel';


export default class ProductAttributeService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getProductAttributeList = async (): Promise<Result<ProductAttributeModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Product/getProductAttributeList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getProductAttributeListForSelect = async (): Promise<Result<ProductAttributeModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Product/getProductAttributesForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllProductAttributes = async (): Promise<Result<ProductAttributeModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Product/getAllProductAttributes')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getProductAttributeById = async (productAttributeId : number): Promise<Result<ProductAttributeModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Product/getProductAttributeById', { params: { productAttributeId: productAttributeId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addProductAttribute = async (productAttribute: ProductAttributeModel): Promise<Result<ProductAttributeModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Product/addProductAttribute', productAttribute)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateProductAttribute = async (productAttribute: ProductAttributeModel): Promise<Result<ProductAttributeModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/Product/updateProductAttribute', productAttribute)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteProductAttribute = async (productAttributeId : number): Promise<Result<ProductAttributeModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/Product/deleteProductAttribute', { params: { productAttributeId: productAttributeId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
