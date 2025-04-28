import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4 }}>
        {id ? 'Edit Employee' : 'Add New Employee'}
      </Typography>
      <EmployeeForm id={id} />
    </Box>
  );
};

export default EmployeeFormPage;