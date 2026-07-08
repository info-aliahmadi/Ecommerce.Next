import AttributeType from "@root/app/types/enums/AttributeType";
import ProductTags from "@root/app/types/enums/ProductTags";
import SortingType from "@root/app/types/enums/SortingType";

export default interface ProductFilterModel {
  pageIndex: number;
  pageSize: number;
  sorting?: SortingType | null;
  searchInput?: string | null;
  topRate?: boolean | null;
  topSell?: boolean | null;
  hasStockQuantity?: boolean | null;
  fromSellUnitPrice?: number | null;
  toSellUnitPrice?: number | null;
  fromAvailableStartDateTimeUtc?: Date | null;
  toAvailableStartDateTimeUtc?: Date | null;
  hasDiscounts?: boolean | null;
  categoryIds?: number[];
  manufacturerIds?: number[];
  attributeTypes?: AttributeType[];
  productTagIds?: ProductTags[];
}
