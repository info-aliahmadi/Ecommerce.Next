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
import ProductInventoryStockModel from '../_types/Product/ProductInventoryStockModel';
import DiscountDisplayModel from '../_types/Order/DiscountDisplayModel';
import { DiscountType } from '@root/app/types/enums/DiscountType';
import GetDiscountRequest from '../_types/Order/GetDiscountRequest';

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

  async GetProductStockByIds(productVariableIds: number[]): Promise<Result<ProductInventoryStockModel[]>> {
    let productVariableIdsString = productVariableIds.join(',');
    const params = new URLSearchParams({ productVariableIds: productVariableIdsString });
    let result = await Fetch.Get<Result<ProductInventoryStockModel[]>>(CONFIG.API_BASEPATH + `/Product/GetProductStockByIds?${params.toString()}`, this.config);
    return result;
  }

  // ========================= ORDERS =========================

  getMyOrders = async (): Promise<Result<OrderModel[]>> => {
    return Fetch.Get<Result<OrderModel[]>>(CONFIG.API_BASEPATH + `/Order/GetMyOrders`, this.config);
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
    return Fetch.Post<Result<void>>(CONFIG.API_BASEPATH + `/Order/CancelMyOrder`, { orderId: orderId }, this.config);
  };

  // ========================= DISCOUNT =========================

  getDiscount = async (discountRequest: GetDiscountRequest): Promise<Result<DiscountDisplayModel>> => {
    return Fetch.Post<Result<DiscountDisplayModel>>(CONFIG.API_BASEPATH + `/Common/GetDiscount`, discountRequest, this.config);
  };

  calculateDiscount = (discount: DiscountDisplayModel, cartItems: CartItem[]): number => {
    if (!discount || !cartItems || cartItems.length === 0) return 0;
    debugger
    const eligibleItems = this.getEligibleCartItems(discount, cartItems);
    if (eligibleItems.length === 0) return 0;

    const eligibleSubtotal = eligibleItems.reduce((sum, item) => {
      return sum + (item.variant.sellPrice * item.quantity);
    }, 0);

    if (eligibleSubtotal <= 0) return 0;

    let discountAmount: number;

    if (discount.usePercentage) {
      discountAmount = eligibleSubtotal * (discount.discountPercentage / 100);
    } else {
      discountAmount = Math.min(discount.discountAmount, eligibleSubtotal);
    }

    if (discount.maximumDiscountAmount != null && discount.maximumDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, discount.maximumDiscountAmount);
    }

    return Math.round(discountAmount * 100) / 100;
  };

  private getEligibleCartItems = (discount: DiscountDisplayModel, cartItems: CartItem[]): CartItem[] => {
    switch (discount.discountTypeId) {
      case DiscountType.AssignedToOrderTotal:
        return cartItems;
      case DiscountType.AssignedToProducts:
        if (!discount.productIds || discount.productIds.length === 0) return [];
        return cartItems.filter(item => discount.productIds.includes(item.variant.productId));
      case DiscountType.AssignedToCategories:
        if (!discount.categoryIds || discount.categoryIds.length === 0) return [];
        return cartItems.filter(item =>
          item.categories.some(cat => discount.categoryIds.includes(cat.id))
        );
      case DiscountType.AssignedToManufacturers:
        return [];
      default:
        return [];
    }
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
