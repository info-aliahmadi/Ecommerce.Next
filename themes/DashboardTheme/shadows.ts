// material-ui
import { alpha, Theme } from '@mui/material/styles';

// ==============================|| DEFAULT THEME - CUSTOM SHADOWS  ||============================== //

const CustomShadows = (theme : Theme) => ({
  button: `0 2px #0000000b`,
  text: `0 -1px 0 rgb(0 0 0 / 12%)`,
  z1: `0 4px 24px rgba(0, 0, 0, 0.08)`
  // only available in paid version
});

export default CustomShadows;
