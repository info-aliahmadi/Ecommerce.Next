// material-ui
import { Box, Typography, Divider } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItems from '@dashboard/_lib/menu-items';
import useNavigationState from '@dashboard/_hooks/useNavigationState';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const { isGroupExpanded, toggleGroup } = useNavigationState();

  const navGroups = Object.values(menuItems.items).map((item) => {
    if (item.type === 'group') {
      return (
        <Box key={`nav-group-container-${item.id}`}>
          <NavGroup
            item={item}
            isExpanded={isGroupExpanded(item.id)}
            onToggle={() => toggleGroup(item.id)}
          />
          <Divider sx={{ opacity: 0.4 }} />
        </Box>
      );
    } else {
      return (
        <Typography key={"nav-groups-error-" + item.id} variant="h6" color="error" align="center">
          Fix - Navigation Group
        </Typography>
      );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
