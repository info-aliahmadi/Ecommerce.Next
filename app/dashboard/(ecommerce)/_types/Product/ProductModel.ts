import AuthorModel from "@root/app/dashboard/(cms)/_types/Article/AuthorModel";
import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import DeliveryDateType from "@root/app/types/enums/DeliveryDateType";
import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";
import MeasureType from "@root/app/types/enums/MeasureType";
import FileImageModel from "@root/app/types/FileImageModel";
import ProductVariantModel from "./ProductVariantModel";
/**
 * Represents a product.
 */
export default interface ProductModel {
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
  createUser?: AuthorModel | undefined;

  /**
   * The ID of the user who last updated the product (undefinedable).
   */
  updateUserId?: number | undefined;

  /**
   * The user who last updated the product (undefinedable).
   */
  updateUser?: AuthorModel | undefined;


  /**
   * The ID of the preview image (undefinedable).
   */
  imagePreviewId?: number | undefined;

  /**
   * The preview image (undefinedable).
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
   * The ID of the tax category.
   */
  taxCategoryId: number | undefined;

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
   * The type of the currency.
   */
  currencyType: CurrencyTypes;

  /**
   * The type of the MeasureType.
   */
  measureType: MeasureType;

  /**
   * The start date and time the product is available (undefinedable, UTC).
   */
  availableStartDateTimeUtc: Date | undefined;

  /**
   * The end date and time the product is available (undefinedable, UTC).
   */
  availableEndDateTimeUtc: Date | undefined;

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
   * The start date and time the product is marked as new (undefinedable, UTC).
   */
  markAsNewStartDateTimeUtc: Date | undefined;

  /**
   * The end date and time the product is marked as new (undefinedable, UTC).
   */
  markAsNewEndDateTimeUtc: Date | undefined;

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
   * The date and time the product was last updated (undefinedable, UTC).
   */
  updatedOnUtc: Date | undefined;

  /**
   * The quantity of stock.
   */
  stockQuantity: number | undefined;
  /**
   * The minimum stock quantity (product-level setting).
   */
  minStockQuantity: number;

  /**
   * The product variants.
   */
  variants: ProductVariantModel[];

  /**
   * The IDs of the categories the product belongs to.
   */
  categoryIds: number[];

  /**
   * The names of the categories the product belongs to.
   */
  categoryNames: string[];

  /**
   * The IDs of the manufacturers the product belongs to.
   */
  manufacturerIds: number[];

  /**
   * The names of the manufacturers the product belongs to.
   */
  manufacturerNames: string[];
  /**
   * The IDs of the attributes the product has.
   */
  attributeIds: number[];

  /**
   * The names of the attributes the product has.
   */
  attributeNames: string[];
  /**
   * The images associated with the product.
   */
  images: FileImageModel[];

  /**
   * The IDs of the reviews associated with the product.
   */
  reviewIds: number[];

  /**
   * The IDs of related products.
   */
  relatedProductIds: number[];

  /**
   * The IDs of tags associated with the product.
   */
  tagIds: number[];
}
