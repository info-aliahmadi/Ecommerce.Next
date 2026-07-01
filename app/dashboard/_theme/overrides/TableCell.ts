// ==============================|| OVERRIDES - TABLE CELL ||============================== //

import { Theme } from "@mui/material";

export default function TableCell(theme: Theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: 12,
          borderColor: "#e5e7eb"
        },
        head: {
          fontWeight: 600,
          paddingTop: 10,
          paddingBottom: 10
        }
      }
    }
  };
}
