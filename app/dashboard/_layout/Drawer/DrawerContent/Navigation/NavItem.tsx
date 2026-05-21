'use client';
import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';

// project import
import { activeItem } from '@root//store/reducers/menu';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //


const NavItem = ({ item, level }: { item: MenuItem, level: number }) => {
  const t = useTranslations("");
  const nsTranslation = 'navigation.';
  const keyName = nsTranslation + item.id;
  const theme = useTheme();
  const dispatch = useDispatch();
  const primaryColors: PaletteColor = theme.palette.primary;
  const { drawerOpen, openItem } = useSelector((state: any) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  // eslint-disable-next-line react/display-name
  const LinkComponent = forwardRef<HTMLAnchorElement, any>((props, ref) => (
    <Link ref={ref} {...props} href={item.url || ''} target={itemTarget} />
  ));

  let listItemProps: any = { component: LinkComponent };
  if (item?.external) {
    listItemProps = { component: 'a' as any, href: item.url, target: itemTarget };
  }

  const itemHandler = (id: any) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const isSelected = openItem.findIndex((id: any) => id === item.id) > -1;
  // active menu item on page load
  let path = usePathname();
  useEffect(() => {
    if (path.includes(item.url as string)) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [path]);

  const themeMode = theme.palette.mode;
  const textColor = 'text.primary';
  const iconSelectedColor = themeMode == "dark" ? "#818cf8" : 'primary.main';
  const bgColor = themeMode == "dark" ? "#312e814d" : "primary.lighter";
  return (
    <ListItemButton
      key={"nav-item-" + item.id}
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 40}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen ? {
          '&:hover': {
            bgcolor: bgColor,
          },
          '&.Mui-selected': {
            bgcolor: bgColor,
            borderRight: `5px solid ${theme.palette.primary.main}`,
            color: textColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: bgColor
            }
          }
        } : {}),
        ...(!drawerOpen ? {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        } : {})
      }}
    >
      {itemIcon &&
        drawerOpen ? (<ListItemIcon
          key={"nav-item-icon-" + item.id}
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen ? {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            } : {}),
            ...(!drawerOpen && isSelected ? {
              bgcolor: themeMode == "dark" ? "primary.darker" : "primary.lighter",
              '&:hover': {
                bgcolor: themeMode == "dark" ? "primary.darker" : "primary.lighter"
              }
            } : {})
          }}
        >
          {itemIcon}
        </ListItemIcon>
      ) : (
        <Tooltip title={t(keyName)} arrow placement="left">
          <ListItemIcon
            key={"nav-item-icon-" + item.id}
            sx={{
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(!drawerOpen ? {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter'
                }
              } : {}),
              ...(!drawerOpen && isSelected ? {
                bgcolor: themeMode == "dark" ? "primary.darker" : "primary.lighter",
                '&:hover': {
                  bgcolor: themeMode == "dark" ? "primary.darker" : "primary.lighter"
                }
              } : {})
            }}
          >
            {itemIcon}
          </ListItemIcon>
        </Tooltip>
      )
      }
      {
        (drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            key={"nav-item-text-" + item.id}
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                {t(keyName)}
              </Typography>
            }
          />
        )
      }
      {
        (drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            key={"nav-item-chip-" + item.id}
            color={item.chip.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
            variant={item.chip.variant as 'filled' | 'outlined'}
            size={item.chip.size as 'small' | 'medium'}
            label={item.chip.label}
            avatar={item.chip.avatar ? <Avatar>{item.chip.avatar}</Avatar> : undefined}
          />
        )
      }
    </ListItemButton >
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
