'use client';
import { useLayoutEffect, useMemo, useState } from 'react';

// material-ui
import { CssBaseline, StyledEngineProvider, ThemeOptions } from '@mui/material';
import { createTheme, Shadows, ThemeProvider } from '@mui/material/styles';

// project import
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';
import { prefixer } from 'stylis';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import CONFIG from '@root/config';

import IranSans from './fonts/IranSans';
import Poppins from './fonts/Poppins';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import '@root/public/css/customStyle/dashboard.css';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useSession } from 'next-auth/react';
import Loader from '@dashboard/_components/Loader';
import { Options } from '@emotion/cache';
import nextIntlService from '@root/locales/nextIntlService';
import { PERSIAN_CALENDAR, RTL_LOCALES } from '@root/app/(home)/_lib/store';
// ==============================|| DEFAULT THEME - MAIN  ||============================== //
export default function DashboardThemeCustomization({ children }: { children: any }) {

  const { data: session, status } = useSession();

  let themeMode: 'light' | 'dark' | undefined = session?.user?.defaultTheme;

  if (session != undefined && themeMode == undefined) {
    themeMode = CONFIG.DEFAULT_THEME as 'light' | 'dark';
  }

  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr'); // Default to LTR
  const [isPersianCalendar, setIsPersianCalendar] = useState<boolean>(false);
  const initFonts = direction === 'rtl' ? CONFIG.RTL_FONTS_EDITOR : CONFIG.LTR_FONTS_EDITOR;
  const [fonts, setFonts] = useState(initFonts);

  // useLayoutEffect(() => {
  //   setDirection(dir)
  //   document.dir = dir;
  //   //i18n.changeLanguage(session?.user?.defaultLanguage);
  // }, [dir, session]);

  useLayoutEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    let locale: string = session?.user?.defaultLanguage ?? CONFIG.DEFAULT_LANGUAGE;
    nextIntlService.setNextIntlLocale(locale);
    const dir = RTL_LOCALES.includes(locale as any) == true ? 'rtl' : 'ltr';
    setDirection(dir)
    setIsPersianCalendar(PERSIAN_CALENDAR.includes(locale as any) == true ? true : false);

  }, [session]);

  useLayoutEffect(() => {
    //document.dir = direction;
    direction === 'rtl' ? setFonts(CONFIG.RTL_FONTS_EDITOR) : setFonts(CONFIG.LTR_FONTS_EDITOR);
  }, [direction]);

  function changeDirection(dir: 'ltr' | 'rtl') {
    setDirection(dir);
  }

  const themePallete = Palette(themeMode);
  // create custom shadows
  themePallete.shadows[1] = themeMode == "light" ? "0 4px 24px rgba(0, 0, 0, 0.08)" : "0 4px 24px rgba(0, 0, 0, 0.3)";


  const themeTypography = Typography(fonts);
  const themeCustomShadows = useMemo(() => CustomShadows(themePallete), [themePallete]);
  const themeOptions = useMemo<ThemeOptions>(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 560,
          md: 1000,
          lg: 1460,
          xl: 1900
        }
      },
      direction: direction,
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: themePallete.palette,
      customShadows: themeCustomShadows,
      shadows: themePallete.shadows,
      typography: themeTypography,
      setDirection: changeDirection,
    }),
    [themePallete, themeTypography, themeCustomShadows]
  );
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);
  // Create rtl cache

  const cacheRtl: Options = {
    key: 'muirtl',
    stylisPlugins: [prefixer, stylisRTLPlugin]
  };
  if (status === "loading") {
    return <Loader />
  }
  return (

    <StyledEngineProvider injectFirst>
      {direction === 'rtl' && (
        <LocalizationProvider dateAdapter={isPersianCalendar ? AdapterMomentJalaali : AdapterMoment}>
          <NextAppDirEmotionCacheProvider options={cacheRtl}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <IranSans />
              {children}
            </ThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </LocalizationProvider>
      )}
      {direction === 'ltr' && (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Poppins />
              {children}
            </ThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </LocalizationProvider>
      )}
    </StyledEngineProvider>
  );
}

