import FilterOperation from './enums/FilterOperation';
import FilterType from './enums/FilterType';

interface GridDataBound {
    pageIndex?: number;
    pageSize?: number;
    sorting?: string;
    globalFilter?: string;
    filters?: string;
    addFilter(id: string, value: string | number | Date | boolean | null | undefined, operation: FilterOperation = FilterOperation.Equals, type: FilterType = FilterType.String): void;
}