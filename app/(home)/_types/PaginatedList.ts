export default class PaginatedDisplayList<T> {
    pageIndex: number | undefined;
    pageSize: number | undefined;
    totalPages: number | undefined;
    totalItems: number | undefined;
    maxRange: number | undefined;
    items: T[] | undefined;
  
  }