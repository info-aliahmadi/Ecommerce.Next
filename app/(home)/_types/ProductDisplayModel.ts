import AuthorModel from "@root/app/dashboard/(cms)/_types/Article/AuthorModel";
import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import DeliveryDateType from "@root/app/types/enums/DeliveryDateType";
import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";
import MeasureType from "@root/app/types/enums/MeasureType";
import InventoryDisplayModel from "./InventoryDisplayModel";
import CategoryDisplayModel from "./CategoryDisplayModel";
import ProductAttributeDisplayModel from "./ProductAttributeDisplayModel";
/**
 * Represents a product.
 */
export default interface ProductDisplayModel {
  /**
   * The ID of the product.
   */
  id: number;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * The name of the product.
   */
  sku: string;

  /**
   * The ID of the user who created the product.
   */
  createUserId: number;

  /**
   * The user who created the product.
   */
  createUser?: AuthorModel | null;

  /**
   * The ID of the user who last updated the product (nullable).
   */
  updateUserId?: number | null;

  /**
   * The user who last updated the product (nullable).
   */
  updateUser?: AuthorModel | null;


  /**
   * The ID of the associated picture (nullable).
   */
  imagePreviewId?: number | null;
  /**
   * The ID of the associated picture (nullable).
   */
  imagePreview?: FileUploadModel | undefined;

  /**
   * Meta keywords for SEO.
   */
  metaKeywords: string;

  /**
   * Meta title for SEO.
   */
  metaTitle: string;

  /**
   * Meta description for SEO.
   */
  metaDescription: string;

  /**
   * Short description of the product.
   */
  shortDescription: string;

  /**
   * Full description of the product.
   */
  fullDescription: string;

  /**
   * Administrative comments about the product.
   */
  adminComment: string;

  /**
   * The ID of the delivery date.
   */
  deliveryDateType: DeliveryDateType;

  /**
   * The name of the delivery date.
   */
  deliveryDateName: string;

  /**
   * The ID of the tax category.
   */
  taxCategoryId: number| null ;

  /**
   * The name of the tax category.
   */
  taxCategoryName: string;


  /**
   * Indicates whether to notify the admin for quantity below the minimum.
   */
  notifyAdminForQuantityBelow: boolean;

  /**
   * The minimum order quantity.
   */
  orderMinimumQuantity: number;

  /**
   * The maximum order quantity.
   */
  orderMaximumQuantity: number;

  /**
   * The price of the product.
   */
  sellUnitPrice: number;


  /**
   * The old price of the product.
   */
  oldSellUnitPrice: number;

  /**
   * The type of the currency.
   */
  currencyType: CurrencyTypes;

  /**
   * The type of the MeasureType.
   */
  measureType: MeasureType;

  /**
   * The weight of the product.
   */
  weight: number;

  /**
   * The length of the product.
   */
  length: number;

  /**
   * The width of the product.
   */
  width: number;

  /**
   * The height of the product.
   */
  height: number;

  /**
   * The start date and time the product is available (nullable, UTC).
   */
  availableStartDateTimeUtc: Date | null;

  /**
   * The end date and time the product is available (nullable, UTC).
   */
  availableEndDateTimeUtc: Date | null;

  /**
   * The display order of the product.
   */
  displayOrder: number;

  /**
   * The sum of approved ratings.
   */
  approvedRatingSum: number;

  /**
   * The sum of not approved ratings.
   */
  notApprovedRatingSum: number;

  /**
   * The total number of approved reviews.
   */
  approvedTotalReviews: number;

  /**
   * The total number of not approved reviews.
   */
  notApprovedTotalReviews: number;

  /**
   * Indicates whether discounts have been applied.
   */
  hasDiscountsApplied: boolean;

  /**
   * Indicates whether the product is marked as new.
   */
  markAsNew: boolean;

  /**
   * The start date and time the product is marked as new (nullable, UTC).
   */
  markAsNewStartDateTimeUtc: Date | null;

  /**
   * The end date and time the product is marked as new (nullable, UTC).
   */
  markAsNewEndDateTimeUtc: Date | null;

  /**
   * Indicates whether the product is not returnable.
   */
  notReturnable: boolean;

  /**
   * Indicates whether allowed quantities are set.
   */
  allowedQuantities: boolean;

  /**
   * Indicates whether the product is tax exempt.
   */
  isTaxExempt: boolean;

  /**
   * Indicates whether the product is shown on the homepage.
   */
  showOnHomepage: boolean;

  /**
   * Indicates whether the product is free shipping.
   */
  isFreeShipping: boolean;

  /**
   * Indicates whether customer reviews are allowed.
   */
  allowCustomerReviews: boolean;

  /**
   * Indicates whether to display the stock quantity.
   */
  displayStockQuantity: boolean;

  /**
   * Indicates whether the buy button is disabled.
   */
  disableBuyButton: boolean;

  /**
   * Indicates whether the wishlist button is disabled.
   */
  disableWishlistButton: boolean;

  /**
   * Indicates whether the product is available for pre-order.
   */
  availableForPreOrder: boolean;

  /**
   * Indicates whether to call for price.
   */
  callForPrice: boolean;

  /**
   * Indicates whether the product is published.
   */
  published: boolean;

  /**
   * Indicates whether the product is deleted.
   */
  deleted: boolean;

  /**
   * The date and time the product was created (in UTC).
   */
  createdOnUtc: Date;

  /**
   * The date and time the product was last updated (nullable, UTC).
   */
  updatedOnUtc: Date | null;

  /**
   * The stock type.
   */
  stockType: StockType;

  /**
   * The quantity of stock.
   */
  stockQuantity: number;

  /**
   * The minimum stock quantity.
   */
  minStockQuantity: number;
  /**
   * The product inventories.
   */
  inventories: InventoryDisplayModel[];
  
  /**
   * The IDs of the categories the product belongs to.
   */
  categories: CategoryDisplayModel[];


  /**
   * The names of the manufacturers the product belongs to.
   */
  manufacturerNames: string[];

  /**
   * The IDs of the attributes the product has.
   */
  attributes: ProductAttributeDisplayModel[];

  /**
   * The paths to the images associated with the product.
   */
  imagePaths: string[];
  
  /**
   * The IDs of the reviews associated with the product.
   */
  reviewIds: number[];

  /**
   * The IDs of related products.
   */
  relatedProductIds: number[];

  /**
   * The product tags.
   */
  productTags: string[];
}

export enum StockType {
  Total = 0,
  PerAttribute = 1
}