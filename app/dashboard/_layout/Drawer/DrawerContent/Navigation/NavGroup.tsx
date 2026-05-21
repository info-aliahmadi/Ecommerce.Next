import PropTypes from 'prop-types';

// material-ui
import {
  List,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme
} from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

// project import
import NavItem from './NavItem';
import { useTranslations } from 'next-intl';
import useDrawerState from '@root/app/dashboard/_hooks/useDrawerState';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface NavGroupProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const NavGroup = ({ item, isExpanded, onToggle }: NavGroupProps) => {
  // const menu = useSelector((state: any) => state.menu);
  // const { drawerOpen } = menu;
  // Use custom hook for drawer state persistence
  const { drawerOpen } = useDrawerState();
  
  const navCollapse = item.children?.map((menuItem) => {
    return <NavItem key={menuItem.id + '_nav-item'} item={menuItem} level={1} />
  });

  return  <NavList key={item.id} item={item} navCollapse={navCollapse} drawerOpen={drawerOpen} open={isExpanded} handleClick={onToggle} />
};

interface NavListProps {
  item: MenuItem;
  navCollapse: React.ReactNode;
  drawerOpen: boolean;
  open: boolean;
  handleClick: () => void;
}

const NavList = ({ item, navCollapse, drawerOpen, open, handleClick }: NavListProps) => {
  const t = useTranslations("");
  const nsTranslation = 'navigation.';
  const theme = useTheme();
  const themeMode = theme.palette.mode;
  const selectedTextColor = themeMode == "dark" ? "#818cf8" : 'primary.main';

  // Only render group header if drawer is open or if it's the first render
  const groupHeader = item.id && drawerOpen && (
    <ListItemButton
      key={"nav-grup-h-" + item.id}
      onClick={handleClick}
      sx={{
        borderRadius: 0,
        pt: 1.7,
        pb: 1.7,
        // backgroundColor: open ? 'primary.lighter' : 'transparent',
        // '&:hover': {
        //   bgcolor: 'primary.lighter'
        // },
        transition: 'background-color 0.3s ease',
        //borderLeft: open ? '5px solid' : '0px solid',
        borderColor: 'primary.main',
        paddingLeft: open ? 2.6 : 3
      }}
    >
      {/* Add icon if available */}
      {item.icon && (
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: open ? selectedTextColor : 'text.primary',
            '&:hover': {
              color: selectedTextColor
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
            color={open ? selectedTextColor : 'text.primary'}
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
