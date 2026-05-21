import React from 'react';
import { TablePagination, useTheme } from '@mui/material';
import { MRT_RowData } from 'material-react-table';
import GridDataBound from '@root/app/types/GridDataBound';
import Result from '@root/app/types/Result';

interface MobileGridProps {
  dataApi?: ((filters: GridDataBound) => Promise<Result<PaginatedList<MRT_RowData>>>) | undefined;
  data?: PaginatedList<MRT_RowData>;
  dataSet?: any[];
  columns: any[];
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  dataApi,
  data,
  dataSet,
  columns,
  pagination,
  setPagination,
}) => {
  const theme = useTheme(); // Get the theme for styling
  // 1. Handle data slicing
  let rows = [];
  let totalRowCount = 0;

  if (dataApi) {
    // Server-side
    rows = data?.items ?? [];
    totalRowCount = data?.totalItems ?? 0; // Adjust based on your API
  } else {
    // Client-side
    const allData = dataSet || [];
    totalRowCount = allData.length;
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    rows = allData.slice(start, end);
  }

  return (
    <div style={{ padding: 8 }}>
      {rows.map((row: any, index: number) => (
        <div
          key={index}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            background: theme.palette.background.paper,
          }}
        >
          {columns.map((col: any) => {
            const value = row[col.accessorKey];

            // Mock MRT Context for the Cell
            const mockMrtContext = {
              cell: { getValue: () => value },
              row: { original: row, index: index },
              column: col,
              renderedCellValue : value
            };

            return (
              <div
                key={col.accessorKey}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  borderBottom: '1px dashed #eee'
                }}
              >
                <strong>{col.header}</strong>
                <span>
                  {col.Cell ? col.Cell(mockMrtContext as any) : value}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      <TablePagination
        component="div"
        count={totalRowCount}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        onPageChange={(event, newPage) => {
          setPagination((prev) => ({ ...prev, pageIndex: newPage }));
        }}
        onRowsPerPageChange={(event) => {
          setPagination({
            pageIndex: 0,
            pageSize: parseInt(event.target.value, 10),
          });
        }}
      />
    </div>
  );
};
