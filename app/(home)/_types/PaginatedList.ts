export default class PaginatedDisplayList<T> {
    pageIndex: number | undefined;
    pageSize: number | undefined;
    totalPages: number | undefined;
    totalItems: number | undefined;
    items: T[] | undefined;
  
  }