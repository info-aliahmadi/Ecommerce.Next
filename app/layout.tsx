'use client';

import { ReactNode } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, IconButton, Badge, useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ShoppingCart, Person, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if the current path is in the dashboard section
  const isDashboard = pathname?.startsWith('/dashboard');

  // If we're in the dashboard, don't show the ecommerce header/footer
  if (isDashboard) {
    return (
      <html lang="en">
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    );
  }
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>
          <AppBar position="sticky">
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  href="/"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  E-COMMERCE
                </Typography>

                {isMobile ? (
                  <>
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      onClick={toggleMobileMenu}
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography
                      variant="h6"
                      noWrap
                      component={Link}
                      href="/"
                      sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      E-COMMERCE
                    </Typography>
                    <Drawer
                      anchor="left"
                      open={mobileMenuOpen}
                      onClose={toggleMobileMenu}
                    >
                      <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={toggleMobileMenu}
                        onKeyDown={toggleMobileMenu}
                      >
                        <List>
                          {navItems.map((item) => (
                            <ListItem 
                              key={item.name} 
                              component={Link} 
                              href={item.path}
                              sx={{ 
                                color: 'inherit',
                                textDecoration: 'none',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              <ListItemText primary={item.name} />
                            </ListItem>
                          ))}
                        </List>
                        <Divider />
                        <List>
                          <ListItem 
                            component={Link} 
                            href="/login"
                            sx={{ 
                              color: 'inherit',
                              textDecoration: 'none',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <ListItemText primary="Sign In" />
                          </ListItem>
                          <ListItem 
                            component={Link} 
                            href="/register"
                            sx={{ 
                              color: 'inherit',
                              textDecoration: 'none',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <ListItemText primary="Register" />
                          </ListItem>
                        </List>
                      </Box>
                    </Drawer>
                  </>
                ) : (
                  <>
                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                      {navItems.map((item) => (
                        <Button
                          key={item.name}
                          component={Link}
                          href={item.path}
                          sx={{ 
                            my: 2, 
                            color: 'white', 
                            display: 'block',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            ...(pathname === item.path && {
                              borderBottom: '2px solid white'
                            })
                          }}
                        >
                          {item.name}
                        </Button>
                      ))}
                    </Box>
                  </>
                )}

                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    size="large"
                    aria-label="show cart items"
                    color="inherit"
                    component={Link}
                    href="/cart"
                  >
                    <Badge badgeContent={0} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account"
                    color="inherit"
                    component={Link}
                    href="/login"
                  >
                    <Person />
                  </IconButton>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
          
          <Box component="main">
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
} 