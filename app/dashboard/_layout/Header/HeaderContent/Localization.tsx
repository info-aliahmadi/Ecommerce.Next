// material-ui
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';

// project import

// assets
import languageList from '@root/locales/languageList';
import { useTranslations } from 'next-intl';
import LocalizationService from '@root/locales/LocalizationService';
import { useSession } from 'next-auth/react';
import CONFIG from '@root/config';
import LocalStorageService from '@root/utils/LocalStorageService';
import nextIntlService from '@root/locales/nextIntlService';

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Localization = () => {
  const theme = useTheme();
  const t = useTranslations("");
  const { data: session, update } = useSession();
  const jwt = session?.accessToken;

  
  let locale = session?.user?.defaultLanguage ?? CONFIG.DEFAULT_LANGUAGE;

  let currentLanguage = languageList.find((l : any) => l.key === locale);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const changeLanguage = async (lng :Language) => {
    let locService = new LocalizationService(jwt ?? "");
    locService.setCurrentLanguage(lng);
    nextIntlService.setNextIntlLocale(lng.key);

    if (session) {
      
      session.user.defaultLanguage = lng.key;
      await update({ ...session, user: session.user });
    }
    setAnchorEl(null);
  };
  const handleClick = async (event : any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Change default language">
        <IconButton
          disableRipple
          color="secondary"
          sx={{ color: 'text.primary' }}
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {currentLanguage && (
            <img src={currentLanguage.icon} alt={currentLanguage.name} style={{ opacity: '0.8' }} />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
       // anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languageList.map((language: any) => (
          <MenuItem key={language.key} onClick={() => changeLanguage(language)}>
            <img src={language.icon} alt={language.name} style={{ width: '20px', margin: '0px 5px' }} /> {language.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Localization;
