import ProductModel from "@root/app/dashboard/(ecommerce)/_types/Product/ProductModel";

export interface Sort {
  id: keyof ProductModel;
  desc: boolean;
}

export default interface ProductFilterModel {
  pageIndex: number;
  pageSize: number;
  sorting?: Sort | null;
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
}
