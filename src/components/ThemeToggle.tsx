import React from 'react';
import { Box, Typography, Switch, useTheme } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 2,
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      <Typography variant="body1">
        Current Theme: {darkMode ? 'Dark Mode' : 'Light Mode'}
      </Typography>
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        color="primary"
      />
    </Box>
  );
};

export default ThemeToggle;