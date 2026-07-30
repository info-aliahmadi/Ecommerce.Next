import AttributeType from "@root/app/types/enums/AttributeType";
import DateFilter from "@root/app/types/enums/DateFilter";
import ProductTags from "@root/app/types/enums/ProductTags";
import SortingType from "@root/app/types/enums/SortingType";

export default interface ProductFilterModel {
  pageIndex: number;
  pageSize: number;
  sorting?: SortingType;
  searchInput?: string;
  hasStockQuantity?: boolean;
  fromSellUnitPrice?: number;
  toSellUnitPrice?: number;
  hasDiscounts?: boolean;
  dateFilter?: DateFilter;
  categoryIds?: number[];
  manufacturerIds?: number[];
  attributeTypes?: AttributeType[];
  attributeKeys?: string[];
  productTagIds?: ProductTags[];
}
