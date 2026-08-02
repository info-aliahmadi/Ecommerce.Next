import AuthorModel from "@root/app/dashboard/(cms)/_types/Article/AuthorModel";
import FileUploadModel from "@root/app/dashboard/(filestorage)/_types/FileUploadModel";
import DeliveryDateType from "@root/app/types/enums/DeliveryDateType";
import CurrencyTypes from "@root/app/types/enums/CurrencyTypes";
import MeasureType from "@root/app/types/enums/MeasureType";
import CategoryDisplayModel from "./CategoryDisplayModel";
import ProductAttributeDisplayModel from "./ProductAttributeDisplayModel";
import ProductVariantDisplayModel from "./ProductVariantDisplayModel";
import InventoryDisplayModel, { getAvailableStock } from "./InventoryDisplayModel";
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
  imagePreview?: FileUploadModel;

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
  adminComment?: string;

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
  taxCategoryId: number | null;

  /**
   * The name of the tax category.
   */
  taxCategoryName: string;


  /**
   * Indicates whether allowed quantities are set.
   */
  allowedQuantities: boolean;

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
   * The sum of approved ratings.
   */
  approvedRatingSum: number;


  /**
   * The total number of approved reviews.
   */
  approvedTotalReviews: number;


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
  markAsNewStartDateTimeUtc?: Date;

  /**
   * The end date and time the product is marked as new (nullable, UTC).
   */
  markAsNewEndDateTimeUtc?: Date;

  /**
   * Indicates whether the product is not returnable.
   */
  notReturnable: boolean;


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
   * The date and time the product was created (in UTC).
   */
  createdOnUtc: Date;

  /**
   * The date and time the product was last updated (nullable, UTC).
   */
  updatedOnUtc: Date | null;


  /**
   * The type of the MeasureType.
   */
  measureType: MeasureType;
  /**
   * Indicates whether to display the stock quantity.
   */
  displayStockQuantity: boolean;

  /**
   * The quantity of stock.
   */
  stockQuantity: number;

  /**
   * The minimum stock quantity.
   */
  minStockQuantity: number;

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
   * The product variants.
   */
  variants: ProductVariantDisplayModel[];

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
export function getCheapestVariant(variants: ProductVariantDisplayModel[]) : ProductVariantDisplayModel {
  if (variants.length === 1) return variants[0];
  const inStock = variants?.filter(v => getAvailableStock(v.productInventory) > 0);
  if (!inStock || inStock.length === 0) return variants[0];
  return inStock.reduce((min, v) =>
    v.sellPrice < min.sellPrice ? v : min
  , inStock[0]);
}

export function getInStockVariants(variants: ProductVariantDisplayModel[]) {
  return variants?.filter(v => getAvailableStock(v.productInventory) > 0) ?? [];
}

export interface ProductPricing {
  cheapestVariant: ProductVariantDisplayModel;
  inStockVariants: ProductVariantDisplayModel[];
  hasMultipleVariants: boolean;
  minSellPrice: number;
  maxSellPrice: number;
  totalStock: number;
}

export function getProductPricing(variants: ProductVariantDisplayModel[]): ProductPricing {
  const inStockVariants = getInStockVariants(variants);
  const cheapestVariant = getCheapestVariant(variants);
  const sellPrices = inStockVariants.map(v => v.sellPrice).filter(p => p > 0);
  const totalStock = variants?.reduce((sum, v) => sum + getAvailableStock(v.productInventory), 0) ?? 0;

  return {
    cheapestVariant,
    inStockVariants,
    hasMultipleVariants: inStockVariants.length > 1,
    minSellPrice: sellPrices.length > 0 ? Math.min(...sellPrices) : 0,
    maxSellPrice: sellPrices.length > 0 ? Math.max(...sellPrices) : 0,
    totalStock,
  };
}