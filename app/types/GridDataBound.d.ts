interface GridDataBound {
  pageIndex?: number;
  pageSize?: number;
  sorting?: string;
  globalFilter?: string;
  filters?: string;
  addFilter(id: string, value: string | number | boolean | null, operation: string = 'equals', type: string = 'string'): void;
}