import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  List,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

// project import
import NavItem from './NavItem';
import { useTranslation } from 'react-i18next';
import Authorize from '@root/app/dashboard/_components/Authorization/Authorize';

// Local storage key for expanded navigation groups
const STORAGE_KEY = 'nav_expanded_groups';

// Function to get expanded groups from localStorage
const getExpandedGroups = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Function to save expanded groups to localStorage
const saveExpandedGroups = (groups: string[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface NavGroupProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const NavGroup = ({ item, isExpanded, onToggle }: NavGroupProps) => {
  const menu = useSelector((state: any) => state.menu);
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem) => {
    return menuItem.permission ? (
      <Authorize key={menuItem.id + '_auth'} permission={menuItem.permission} accessDeniedElement={<></>}>
        <NavItem item={menuItem} level={1} />
      </Authorize>
    ) : (
      <NavItem key={menuItem.id + '_nav-item'} item={menuItem} level={1} />
    );
  });

  return item.permission ? (
    <Authorize permission={item.permission} accessDeniedElement={<></>}>
      <NavList key={item.id} item={item} navCollapse={navCollapse} drawerOpen={drawerOpen} open={isExpanded} handleClick={onToggle} />
    </Authorize>
  ) : (
    <NavList key={item.id} item={item} navCollapse={navCollapse} drawerOpen={drawerOpen} open={isExpanded} handleClick={onToggle} />
  );
};

interface NavListProps {
  item: MenuItem;
  navCollapse: React.ReactNode;
  drawerOpen: boolean;
  open: boolean;
  handleClick: () => void;
}

const NavList = ({ item, navCollapse, drawerOpen, open, handleClick }: NavListProps) => {
  const { t } = useTranslation();
  const nsTranslation = 'navigation.';

  // Only render group header if drawer is open or if it's the first render
  const groupHeader = item.id && drawerOpen && (
    <ListItemButton
      key={"nav-grup-h-" + item.id}
      onClick={handleClick}
      sx={{
        borderRadius: 0,
        // backgroundColor: open ? 'primary.lighter' : 'transparent',
        // '&:hover': {
        //   bgcolor: 'primary.lighter'
        // },
        transition: 'background-color 0.3s ease',
        borderLeft: open ? '5px solid' : '0px solid',
        borderColor: 'primary.main',
        paddingLeft: open ? 2.6 : 3
      }}
      title={t(open ? 'navigation.collapse-group' : 'navigation.expand-group')}
    >
      {/* Add icon if available */}
      {item.icon && (
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: open ? 'primary.main' : 'text.primary',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          {item.icon ?
            <item.icon style={{ fontSize: '1.25rem', color: open ? 'inherit' : 'textSecondary' }} /> :
            item.icon
          }
        </ListItemIcon>
      )}
      <ListItemText
        key={"nav-group-text-" + item.id}
        primary={
          <Typography
            variant="subtitle2"
            color={open ? 'primary.main' : 'text.primary'}
            fontWeight={open ? 600 : 400}
          >
            {t(nsTranslation + item.id)}
          </Typography>
        }
      />
      {open ? <ExpandMore fontSize="small" color="primary" /> : <ChevronRight fontSize="small" />}
    </ListItemButton>
  );

  return (
    <List
      key={"nav-grp-c-" + item.id}
      subheader={groupHeader}
      sx={{
        // mb: drawerOpen ? 1.5 : 0, 
        py: 0,
        zIndex: 0,
        overflow: 'hidden',
        bgcolor: open ? 'background.paper' : 'transparent'
      }}
    >
      <Collapse key={"nav-col-" + item.id} in={open || !drawerOpen} timeout="auto" unmountOnExit>
        {navCollapse}
      </Collapse>
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func
};

export default NavGroup;
