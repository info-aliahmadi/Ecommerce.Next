'use client'
// material-ui
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import AccountService from '@root/app/dashboard/(auth)/_service/AccountService';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

  const t = useTranslations("");
  const { data: session, update } = useSession();

  const jwt = session?.accessToken;

  var accountService = new AccountService(jwt ?? '');

  const theme = useTheme();

  const handleThemeMode = async (mode: 'light' | 'dark') => {
    if (session) {
      session.user.defaultTheme = mode;
      await update({ ...session, user: session.user });
    }

    await accountService.setDefaultTheme(mode);
  };
  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {theme.palette.mode == 'light' ? (
        <Tooltip title={t('tooltips.switch-to-darkmode')}>
          <IconButton
            aria-label="open drawer"
            onClick={() => handleThemeMode('dark')}
            edge="start"
            color="secondary"
            sx={{ color: 'text.primary' }}
          >
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t('tooltips.switch-to-lightmode')}>
          <IconButton
            aria-label="open drawer"
            onClick={() => handleThemeMode('light')}
            edge="start"
            color="secondary"
            sx={{ color: 'text.primary' }}
          >
            <Brightness7Icon />
          </IconButton>
        </Tooltip>
      )}
      {/* <Localization /> */}
      {/* <Notification /> */}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
