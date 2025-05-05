//app.tsx

import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, Box, Toolbar, useMediaQuery, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';

// Lazy load all page components
const EmployeeListPage = lazy(() => import('./pages/EmployeeListPage'));
const EmployeeFormPage = lazy(() => import('./pages/EmployeeFormPage'));
const EmployeeDetailsPage = lazy(() => import('./pages/EmployeeDetailsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

// Loading component to show while pages are loading
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Main app content separated to use context
const AppContent = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawerWidth = 240;
  
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#7A1CAC' : '#244855', // Purple in dark mode, Dark teal in light mode
        light: darkMode ? '#AD49E1' : '#3a6b7a',
        dark: darkMode ? '#2E073F' : '#1a343d',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkMode ? '#AD49E1' : '#E64833', // Light purple in dark mode, Coral red in light mode
        light: darkMode ? '#c16be9' : '#eb6a58',
        dark: darkMode ? '#7A1CAC' : '#c13a28',
        contrastText: '#ffffff',
      },
      error: {
        main: '#E64833', // Using coral red for errors
      },
      warning: {
        main: '#874F41', // Using brown for warnings
      },
      info: {
        main: '#90AEAD', // Using sage green for info
      },
      success: {
        main: '#4caf50', // Keeping standard green for success
      },
      background: {
        default: darkMode ? '#1a1a2e' : '#FBE9D0', // Dark blue in dark mode, Cream in light mode
        paper: darkMode ? '#252547' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#b3b3cc' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.2rem',
        fontWeight: 500,
        marginBottom: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  }), [darkMode]);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navbar 
            toggleSidebar={toggleSidebar} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
          <Sidebar 
            open={sidebarOpen} 
            drawerWidth={drawerWidth} 
            darkMode={darkMode}
            handleDrawerClose={handleDrawerClose}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 0,
              width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
              ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Toolbar /> {/* This creates space below the app bar */}
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/add" element={<EmployeeFormPage />} />
                <Route path="/edit/:id" element={<EmployeeFormPage />} />
                <Route path="/employee/:id" element={<EmployeeDetailsPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/settings" element={<HomePage />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Router>
    </MuiThemeProvider>
  );
};

// Main App component that wraps everything with our context provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;