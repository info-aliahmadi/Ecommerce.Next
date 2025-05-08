import axios from 'axios';
import { setDefaultHeader } from '@root/utils/axiosHeaders';
import CONFIG from '@root/config';
import Result from '@root/app/types/Result';
import OrderModel from '../_types/Order/OrderModel';

import OrderItemModel, { SumOrderItemsModel } from '../_types/Order/OrderItemModel';

// Define tuple type for the response
type OrderItemsResponse = [OrderItemModel[], SumOrderItemsModel];

export default class OrderService {
  constructor(jwt : string) {
    setDefaultHeader(jwt);
  }
  getOrderList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<OrderModel>>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/GetOrderList', searchParams)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getOrderItemList = async (orderId : number): Promise<Result<OrderItemsResponse>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + `/sale/GetOrderItemList?orderId=${orderId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getAllOrders = async (): Promise<Result<OrderModel[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getAllOrders')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getOrderById = async (orderId : number): Promise<Result<OrderModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getOrderById', { params: { orderId: orderId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getOrderPaymentById = async (orderId : number): Promise<Result<OrderModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/getOrderPaymentById', { params: { orderId: orderId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  addOrder = async (order: OrderModel): Promise<Result<OrderModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/addOrder', order)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateOrder = async (order: OrderModel): Promise<Result<OrderModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .post(CONFIG.API_BASEPATH + '/sale/UpdateOrderState', order)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  deleteOrder = async (orderId : number): Promise<Result<OrderModel>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/deleteOrder', { params: { orderId: orderId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllOrderStatusForSelect = async (): Promise<Result<any[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetAllOrderStatus')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllShippingStatusForSelect = async (): Promise<Result<any[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetAllShippingStatus')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllShippingMethodForSelect = async (): Promise<Result<any[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetAllShippingMethods')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAllPaymentStatusForSelect = async (): Promise<Result<any[]>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(CONFIG.API_BASEPATH + '/sale/GetAllPaymentStatus')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
