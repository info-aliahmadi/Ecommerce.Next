// ==============================|| OVERRIDES - BUTTON ||============================== //

import { Theme } from "@mui/material";

export default function Button(theme : any) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: "0.5rem"
        },
        contained: {
          ...disabledStyle,
          '&.MuiButton-containedSecondary': {
            outline: `1px solid ${theme.palette.secondary.light}`,
            '&:hover': {
              outline: `1px solid ${theme.palette.secondary.light}`,
              backgroundColor: theme.palette.secondary.light
            }
          }
        },
        outlined: {
          ...disabledStyle,
          '&.MuiButton-outlinedSecondary': {
            color:theme.palette.mode === "dark" ? theme.palette.secondary.main : theme.palette.secondary.dark,
            backgroundColor: "secondary.main",
            outline: `1px solid ${theme.palette.secondary.dark}`,
            '&:hover': {
              outline: `1px solid ${"secondary.lighter"}`,
              backgroundColor: theme.palette.secondary.light
            }
          }
        },
        text: {
          '&.MuiButton-textSecondary': {
            color: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.light
            }
          }
        }
      }
    }
  };
}
