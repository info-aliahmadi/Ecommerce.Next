// ==============================|| OVERRIDES - ACCORDION ||============================== //

import { Theme } from "@mui/material";

export default function Accordion(theme: Theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.background.paper}`,
          '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          },
          '&:last-of-type': {
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
  };
}
