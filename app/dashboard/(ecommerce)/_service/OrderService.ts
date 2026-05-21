import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import { GridDataBound } from '@root/app/types/GridDataBound';
import CONFIG from '@root/config';
import OrderModel from '../_types/Order/OrderModel';

import OrderItemModel, { SumOrderItemsModel } from '../_types/Order/OrderItemModel';

// Define tuple type for the response
type OrderItemsResponse = [OrderItemModel[], SumOrderItemsModel];

export default class OrderService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getOrderList = async (searchParams: GridDataBound): Promise<Result<PaginatedList<OrderModel>>> => {
    return Fetch.Post<Result<PaginatedList<OrderModel>>>(CONFIG.API_BASEPATH + '/Order/GetOrderList', searchParams, this.config);
  };

  getOrderItemList = async (orderId : number): Promise<Result<OrderItemsResponse>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderItemsResponse>>(CONFIG.API_BASEPATH + `/Order/GetOrderItemList?${params.toString()}`, this.config);
  };
  getAllOrders = async (): Promise<Result<OrderModel[]>> => {
    return Fetch.Get<Result<OrderModel[]>>(CONFIG.API_BASEPATH + `/Order/getAllOrders`, this.config);
  };
  getOrderById = async (orderId : number): Promise<Result<OrderModel>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderModel>>(CONFIG.API_BASEPATH + `/Order/getOrderById?${params.toString()}`, this.config);
  };

  getOrderPaymentById = async (orderId : number): Promise<Result<OrderModel>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderModel>>(CONFIG.API_BASEPATH + `/Order/getOrderPaymentById?${params.toString()}`, this.config);
  };

  addOrder = async (order: OrderModel): Promise<Result<OrderModel>> => {
    return Fetch.Post<Result<OrderModel>>(CONFIG.API_BASEPATH + '/Order/addOrder', order, this.config);
  };
  updateOrder = async (order: OrderModel): Promise<Result<OrderModel>> => {
    return Fetch.Post<Result<OrderModel>>(CONFIG.API_BASEPATH + '/Order/UpdateOrderState', order, this.config);
  };
  deleteOrder = async (orderId : number): Promise<Result<OrderModel>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderModel>>(CONFIG.API_BASEPATH + `/Order/deleteOrder?${params.toString()}`, this.config);
  };

  getAllOrderStatusForSelect = async (): Promise<Result<any[]>> => {
    return Fetch.Get<Result<any[]>>(CONFIG.API_BASEPATH + `/sale/GetAllOrderStatus`, this.config);
  };

  getAllShippingStatusForSelect = async (): Promise<Result<any[]>> => {
    return Fetch.Get<Result<any[]>>(CONFIG.API_BASEPATH + `/sale/GetAllShippingStatus`, this.config);
  };

  getAllShippingMethodForSelect = async (): Promise<Result<any[]>> => {
    return Fetch.Get<Result<any[]>>(CONFIG.API_BASEPATH + `/sale/GetAllShippingMethods`, this.config);
  };

  getAllPaymentStatusForSelect = async (): Promise<Result<any[]>> => {
    return Fetch.Get<Result<any[]>>(CONFIG.API_BASEPATH + `/sale/GetAllPaymentStatus`, this.config);
  };
}
