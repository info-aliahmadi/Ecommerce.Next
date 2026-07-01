// ==============================|| OVERRIDES - SWITCH ||============================== //

import { Theme } from "@mui/material";

export default function Switch(theme: Theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: theme.palette.secondary.light,
        }
      }
    }
  };
}
