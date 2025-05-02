import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  useTheme,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
// import { useThemeContext } from '../contexts/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  // We can access the theme context here if needed

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: darkMode ? '#2E073F' : theme.palette.primary.main,
        borderRadius: 0,
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, height: 64 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ 
            mr: 2,
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.1)
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}
        >
          Employee Management System
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="default"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#AD49E1',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#7A1CAC',
                    },
                    ml: 1
                  }}
                />
              }
              label={darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              labelPlacement="start"
              sx={{ 
                mx: 1,
                '& .MuiTypography-root': {
                  color: 'white'
                }
              }}
            />
          </Tooltip>
          
          <Tooltip title="Profile">
            <IconButton 
              color="inherit"
              sx={{ 
                ml: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.1)
                }
              }}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;