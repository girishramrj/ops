//pages/EmployeeListPage.tsx:

import EmployeeList from '../components/EmployeeList';
import FloatingNavButtons from '../components/FloatingNavButtons';
import { Box, useTheme } from '@mui/material';

const EmployeeListPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box 
      className="employee-list-page"
      sx={{ 
        bgcolor: isDarkMode ? '#441c5e' : '#FBE9D0', // Dark purple in dark mode, cream in light mode
        borderRadius: 2,
        p: 2
      }}
    >
      <h2>Employee List</h2>
      <EmployeeList />
      <FloatingNavButtons />
    </Box>
  );
};

export default EmployeeListPage;