'use client';
import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import navigation from '@dashboard/_lib/menu-items';

// types
import Header from './Header';
import MainDrawer from './Drawer';
import Breadcrumbs from '@dashboard/_components/@extended/Breadcrumbs';
import useDrawerState from '../_hooks/useDrawerState';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout({ children }: { children: any }) {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Use custom hook for drawer state persistence
  const { drawerOpen, toggleDrawer, openDrawerState, closeDrawerState } = useDrawerState();

  // Only handle responsive drawer on first load if no preference saved yet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only apply default mobile behavior if no preference exists
      const storedValue = localStorage.getItem('drawer_open_state');
      if (storedValue === null && matchDownLG) {
        closeDrawerState();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={drawerOpen} handleDrawerToggle={toggleDrawer} />
      <MainDrawer
        open={drawerOpen}
        handleDrawerToggle={toggleDrawer}
        handleDrawerOpen={openDrawerState}
        handleDrawerClose={closeDrawerState}
      />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        {children}
      </Box>
    </Box>
  );
}
