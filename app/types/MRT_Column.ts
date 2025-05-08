import { MRT_ColumnDef, MRT_RowData } from "material-react-table";

export default interface MRT_Column<TData extends MRT_RowData, TValue = unknown> extends MRT_ColumnDef<TData, TValue> {
    type: 'dateTime' | 'date' | 'string' | 'number' | 'boolean' | 'array' | 'object';
    operation?: string;
}