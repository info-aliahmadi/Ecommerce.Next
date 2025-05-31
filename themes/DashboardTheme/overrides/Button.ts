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
            color: theme.palette.secondary.contrastText,
            outline: `1px solid ${theme.palette.secondary.light}`,
            '&:hover': {
              outline: `1px solid ${theme.palette.secondary.light}`,
              backgroundColor: "#F9FAFB"
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
