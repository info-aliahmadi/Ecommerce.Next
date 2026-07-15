// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes, presetDarkPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode : 'light' | 'dark' | undefined) : any => {
  const colors = mode === 'light' ? presetPalettes : presetDarkPalettes;

  const greyPrimary =
    mode == 'light'
      ? ['#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9', '#8e8e8e', '#8c8c8c', '#595959', '#262626', '#141414', '#000000']
      : ['#1a1a1a', '#202020', '#222222', '#303030', '#727272', '#999999', '#c0c0c0', '#b4b4b4', '#bfbfbf', '#f0f0f0', '#f8f8f8'];

  const greyAscent = mode == 'light' ? ['#fafafa', '#8e8e8e', '#434343', '#1f1f1f'] : ['#2c2c2c', '#999999', '#f8f8f8', '#DDDDDD'];
  const greyConstant = mode == 'light' ? ['#fafafb', '#e6ebf1'] : ['#1e1e1e', '#1f1f1f'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            common: {
              black: '#1F2937',
              white: '#fff'
            },
            ...paletteColor,
            text: {
              primary: "#111827",
              secondary: "#6b7280",
              disabled: paletteColor.grey[400]
            },
            action: {
              disabled: paletteColor.grey[400]
            },
            divider: paletteColor.grey[400],
            background: {
              paper: '#fff',
              default: '#F9FAFB'
            }
          }
        : {
            // palette values for dark mode
            common: {
              black: '#111827',
              white: '#f3f4f6'
            },
            ...paletteColor,
            text: {
              primary: "#f3f4f6",
              secondary: "#f3f4f6",
              
              disabled: paletteColor.grey[400]
            },
            action: {
              disabled: paletteColor.grey[300]
            },
            divider: paletteColor.grey[200],
            background: {
              paper: '#1f2937',
              default: "#111827"
            }
          })
    }
  });
};

export default Palette;
