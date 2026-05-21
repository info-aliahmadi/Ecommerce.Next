import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }: { open: any, handleDrawerToggle: any }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const direction = theme.direction; // 'ltr' or 'rtl'
  // common header
  const mainHeader = (
    <Toolbar>
      <IconButton
        title="Minimize the Sidebar"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        sx={{ color: 'text.primary', ml: { xs: 0, lg: -2 } }}
      >
         {!open ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon sx={{ transform: direction == "rtl" ? "rotate(180deg)" : "" }} />}
      </IconButton>

      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar: any = {
    position: 'fixed',
    color: 'default',
    elevation: 0,
    sx: {
      boxShadow: theme.shadows[1],
      background: theme.palette.background.default
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar  {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
