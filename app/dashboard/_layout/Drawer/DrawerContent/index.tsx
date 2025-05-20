// project import
import SimpleBar from '@dashboard/_components/third-party/SimpleBar';
import Navigation from './Navigation';
import { Box, Divider, IconButton, Tooltip, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useNavigationState from '@dashboard/_hooks/useNavigationState';
import menuItems from '@dashboard/_lib/menu-items';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      <Navigation />
      {/* <NavCard /> */}
    </SimpleBar>
  );
};

export default DrawerContent;
