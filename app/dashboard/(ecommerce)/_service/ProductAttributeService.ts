import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import ProductAttributeModel from '../_types/Product/ProductAttributeModel';


export default class ProductAttributeService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getProductAttributeList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<ProductAttributeModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/getProductAttributeList', searchParams)
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
        .post(CONFIG.API_BASEPATH + '/sale/getProductAttributesForSelect')
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
        .get(CONFIG.API_BASEPATH + '/sale/getAllProductAttributes')
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
        .get(CONFIG.API_BASEPATH + '/sale/getProductAttributeById', { params: { productAttributeId: productAttributeId } })
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
        .post(CONFIG.API_BASEPATH + '/sale/addProductAttribute', productAttribute)
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
        .post(CONFIG.API_BASEPATH + '/sale/updateProductAttribute', productAttribute)
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
        .get(CONFIG.API_BASEPATH + '/sale/deleteProductAttribute', { params: { productAttributeId: productAttributeId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
