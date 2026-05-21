// material-ui
import { Box, Typography, Divider } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItems from '@dashboard/_lib/menu-items';
import useNavigationState from '@dashboard/_hooks/useNavigationState';
import { useContext } from 'react';
import { AuthorizationContext } from '@root/app/dashboard/_components/Authorization/AuthorizationProvider';
import dashboardMenu from '@root/app/dashboard/_lib/dashboard';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const { isGroupExpanded, toggleGroup } = useNavigationState();
  const context = useContext(AuthorizationContext);
  const permissions = context?.permissions;

  function filterMenuByPermissions(
    menuItems: MenuItem[],
    permissions: string[]
  ): MenuItem[] {
    return menuItems
      .map((item): MenuItem | null => {
        // If item has children → filter children first
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenuByPermissions(
            item.children,
            permissions
          );

          // ❌ Remove parent if no children remain
          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren
          };
        }

        // Leaf node → must have permission
        if (item.permission && permissions.includes(item.permission)) {
          return item;
        }

        return null;
      })
      .filter((item): item is MenuItem => item !== null);
  }

  let authorizedMenu: MenuItem[] = [];
  if (permissions)
    authorizedMenu = filterMenuByPermissions(menuItems.items, permissions!)
  authorizedMenu = [dashboardMenu, ...authorizedMenu ]
  const navGroups = Object.values(authorizedMenu).map((item) => {
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
