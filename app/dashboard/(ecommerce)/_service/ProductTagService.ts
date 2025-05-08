import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import ProductTagModel from '../_types/Product/ProductTagModel';

export default class ProductTagService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getProductTagList = async (): Promise<Result<ProductTagModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetProductTagList')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getProductTagListForSelect = async (): Promise<Result<ProductTagModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetProductTagListForSelect')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getProductTagItemList = async (productTagId : number): Promise<Result<ProductTagModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + `/sale/GetProductTagItemList?productTagId=${productTagId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getAllProductTags = async (): Promise<Result<ProductTagModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getAllProductTags')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getProductTagById = async (productTagId : number): Promise<Result<ProductTagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getProductTagById', { params: { productTagId: productTagId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  addProductTag = async (productTag: ProductTagModel): Promise<Result<ProductTagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addProductTag', productTag)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateProductTag = async (productTag: ProductTagModel): Promise<Result<ProductTagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/updateProductTag', productTag)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteProductTag = async (productTagId : number): Promise<Result<ProductTagModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteProductTag', { params: { productTagId: productTagId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
