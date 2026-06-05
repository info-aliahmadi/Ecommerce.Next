// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

import { PalettesProps } from "@ant-design/colors";


const Theme = (colors : PalettesProps) => {
  const { blue, red, gold, cyan, green, grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };
  const contrastText = '#fff';

  return {
    primary: {
      lighter: "#847df74a",
      100: blue[1],
      200: blue[2],
      light: "#6765ec",
      400: blue[4],
      main: "#4F46E5",
      dark: "#4031cd",
      700: blue[7],
      darker: "#362dcb",
      900: blue[9],
      contrastText
    },
    secondary: {
      lighter: "#f4f5f6",
      100: greyColors[100],
      200: greyColors[200],
      light: "#bbbcbd",
      400: greyColors[400],
      main: "#6f7173",
      600: greyColors[600],
      dark: "#53535380",
      800: greyColors[800],
      darker:"#202021",
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: "#1F2937"
    },
    error: {
      lighter: "#fecdd5",
      light: "#ef505a",
      main: "#e63341",
      dark: "#d4293a",
      darker: "#b81427",
      contrastText
    },
    warning: {
      lighter: "#fff8c2",
      light: "#fdd62c",
      main: "#FBBF24",
      dark: "#f9a61c",
      darker: "#f67c0d",
      contrastText: "#1F2937"
    },
    info: {
      lighter: "#dcf3f0",
      light: "#6dcdbf",
      main: "#00a892",
      dark: "#00987f",
      darker: "#007b62",
      contrastText
    },
    success: {
      lighter:"#dcf3f0",
      light: "#6dcdbf",
      main: "#14B8A6",
      dark: "#00987f",
      darker: "#007b62",
      contrastText
    },
    grey: greyColors
  };
};

export default Theme;
