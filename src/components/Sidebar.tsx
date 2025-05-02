import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Toolbar,
  useTheme,
  alpha,
  Typography,
  // useMediaQuery,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  // Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
  darkMode: boolean;
  handleDrawerClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, drawerWidth, darkMode, handleDrawerClose }) => {
  const location = useLocation();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Employee List', icon: <PeopleIcon />, path: '/' },
    { text: 'Add Employee', icon: <PersonAddIcon />, path: '/add' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  // Handle menu item click - always close drawer
  const handleMenuItemClick = () => {
    handleDrawerClose();
  };

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: darkMode ? alpha('#2E073F', 0.9) : theme.palette.background.paper,
          color: darkMode ? '#fff' : theme.palette.text.primary,
          borderRight: `1px solid ${darkMode ? alpha('#AD49E1', 0.2) : theme.palette.divider}`,
          borderRadius: 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1 }}>
        <Toolbar sx={{ height: 64, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 500,
              color: darkMode ? '#AD49E1' : theme.palette.primary.main
            }}
          >
            EMS
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ 
            color: darkMode ? alpha('#fff', 0.7) : theme.palette.text.secondary,
            '&:hover': {
              bgcolor: darkMode ? alpha('#AD49E1', 0.15) : alpha(theme.palette.primary.main, 0.05),
            }
          }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
      </Box>
      
      <Divider sx={{ bgcolor: darkMode ? alpha('#AD49E1', 0.2) : undefined }} />
      
      <Box sx={{ p: 2, mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          color={darkMode ? alpha('#fff', 0.6) : 'text.secondary'}
          sx={{ 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          Main Navigation
        </Typography>
      </Box>
      
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.path}
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              onClick={handleMenuItemClick}
              sx={{
                mb: 0.5,
                height: 48,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: darkMode ? alpha('#AD49E1', 0.25) : alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: darkMode ? alpha('#AD49E1', 0.35) : alpha(theme.palette.primary.main, 0.2),
                  }
                },
                '&:hover': {
                  bgcolor: darkMode ? alpha('#AD49E1', 0.15) : alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path 
                  ? (darkMode ? '#AD49E1' : theme.palette.primary.main) 
                  : (darkMode ? alpha('#fff', 0.7) : theme.palette.text.secondary),
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  fontSize: '0.9rem',
                  color: darkMode ? '#ffffff' : 'inherit'
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, mx: 2, bgcolor: darkMode ? alpha('#AD49E1', 0.2) : undefined }} />
        <Box sx={{ p: 2, textAlign: 'center', color: darkMode ? alpha('#fff', 0.6) : theme.palette.text.secondary }}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;