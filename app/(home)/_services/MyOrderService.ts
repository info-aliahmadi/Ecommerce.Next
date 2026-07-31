import Fetch from '@root/utils/Fetch';
import Result from '@root/app/types/Result';
import CONFIG from '@root/config';
import AddressModel from '@root/app/dashboard/(ecommerce)/_types/Common/AddressModel';
import OrderModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderModel';
import OrderItemModel from '@root/app/dashboard/(ecommerce)/_types/Order/OrderItemModel';
import PaymentModel, { PaymentViewModel } from '@root/app/(home)/_types/Order/PaymentModel';
import AddToCartRequest from '@root/app/(home)/_types/Order/AddToCartRequest';
import AddToWishlistRequest from '@root/app/(home)/_types/Order/AddToWishlistRequest';
import RemoveFromCartRequest from '@root/app/(home)/_types/Order/RemoveFromCartRequest';
import RemoveFromWishlistRequest from '@root/app/(home)/_types/Order/RemoveFromWishlistRequest';
import UpdateQuantityRequest from '@root/app/(home)/_types/Order/UpdateQuantityRequest';
import CreateOrderRequest from '@root/app/(home)/_types/Order/CreateOrderRequest';
import ProcessPaymentRequest from '@root/app/(home)/_types/Order/ProcessPaymentRequest';
import CartItem from '../_types/Order/CartItem';

export default class MyOrderService {
  config?: RequestInit;
  constructor(jwt: string) {
    if (jwt) this.config = Fetch.SetDefaultHeader(jwt);
  }

  getUserAddresses = async (): Promise<Result<AddressModel[]>> => {
    return Fetch.Get<Result<AddressModel[]>>(CONFIG.API_BASEPATH + `/Common/GetUserAddresses`, this.config);
  };

  // ========================= SHOPPING CART & WISHLIST =========================

  getMyCartItems = async (): Promise<Result<CartItem[]>> => {
    return Fetch.Get<Result<CartItem[]>>(CONFIG.API_BASEPATH + `/Order/GetMyCartItems`, this.config);
  };

  getMyWishlistItems = async (): Promise<Result<CartItem[]>> => {
    return Fetch.Get<Result<CartItem[]>>(CONFIG.API_BASEPATH + `/Order/GetMyWishlistItems`, this.config);
  };

  getAllMyShoppingItems = async (): Promise<Result<CartItem[]>> => {
    return Fetch.Get<Result<CartItem[]>>(CONFIG.API_BASEPATH + `/Order/GetAllMyShoppingItems`, this.config);
  };

  addToCart = async (request: AddToCartRequest): Promise<Result<CartItem>> => {
    return Fetch.Post<Result<CartItem>>(CONFIG.API_BASEPATH + `/Order/AddToCart`, request, this.config);
  };

  addToWishlist = async (request: AddToWishlistRequest): Promise<Result<CartItem>> => {
    return Fetch.Post<Result<CartItem>>(CONFIG.API_BASEPATH + `/Order/AddToWishlist`, request, this.config);
  };

  removeFromCart = async (request: RemoveFromCartRequest): Promise<Result<void>> => {
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/RemoveFromCart`, request, this.config);
  };

  removeFromWishlist = async (request: RemoveFromWishlistRequest): Promise<Result<void>> => {
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/RemoveFromWishlist`, request, this.config);
  };

  clearCart = async (): Promise<Result<void>> => {
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/ClearCart`, {}, this.config);
  };

  clearWishlist = async (): Promise<Result<void>> => {
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/ClearWishlist`, {}, this.config);
  };

  updateCartItemQuantity = async (request: UpdateQuantityRequest): Promise<Result<CartItem>> => {
    return Fetch.Post<Result<CartItem>>(CONFIG.API_BASEPATH + `/Order/UpdateCartItemQuantity`, request, this.config);
  };

  // ========================= ORDERS =========================

  getMyOrders = async (): Promise<Result<PaginatedList<OrderModel>>> => {
    return Fetch.Get<Result<PaginatedList<OrderModel>>>(CONFIG.API_BASEPATH + `/Order/GetMyOrders`, this.config);
  };

  getMyOrderById = async (orderId: number): Promise<Result<OrderModel>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderModel>>(CONFIG.API_BASEPATH + `/Order/GetMyOrderById?${params.toString()}`, this.config);
  };

  getMyOrderItems = async (orderId: number): Promise<Result<OrderItemModel[]>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Get<Result<OrderItemModel[]>>(CONFIG.API_BASEPATH + `/Order/GetMyOrderItems?${params.toString()}`, this.config);
  };

  createOrder = async (request: CreateOrderRequest): Promise<Result<OrderModel>> => {
    return Fetch.Post<Result<OrderModel>>(CONFIG.API_BASEPATH + `/Order/CreateOrder`, request, this.config);
  };

  cancelMyOrder = async (orderId: number): Promise<Result<void>> => {
    const params = new URLSearchParams({ orderId: orderId.toString() });
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/CancelMyOrder?${params.toString()}`, {}, this.config);
  };

  // ========================= PAYMENTS =========================

  getMyPayments = async (): Promise<Result<PaginatedList<PaymentModel>>> => {
    return Fetch.Get<Result<PaginatedList<PaymentModel>>>(CONFIG.API_BASEPATH + `/Order/GetMyPayments`, this.config);
  };

  getMyPaymentById = async (paymentId: number): Promise<Result<PaymentViewModel>> => {
    const params = new URLSearchParams({ paymentId: paymentId.toString() });
    return Fetch.Get<Result<PaymentViewModel>>(CONFIG.API_BASEPATH + `/Order/GetMyPaymentById?${params.toString()}`, this.config);
  };

  processPayment = async (request: ProcessPaymentRequest): Promise<Result<PaymentModel>> => {
    return Fetch.Post<Result<PaymentModel>>(CONFIG.API_BASEPATH + `/Order/ProcessPayment`, request, this.config);
  };
}
