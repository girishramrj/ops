import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Employee } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface EmployeeDetailsContentProps {
  employee: Employee;
}

const EmployeeDetailsContent: React.FC<EmployeeDetailsContentProps> = ({ employee }) => {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/employees')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="500">
            Employee Details
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => navigate(`/edit/${employee.id}`)}
          sx={{ minWidth: 'auto', p: 1.5 }}
          aria-label="Edit Employee"
        >
          <EditIcon />
        </Button>
      </Box>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Name</Typography>
            <Typography variant="h6">{employee.name}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email</Typography>
            <Typography variant="h6">{employee.email}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Position</Typography>
            <Typography variant="h6">{employee.position}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Phone</Typography>
            <Typography variant="h6">{employee.phone}</Typography>
          </Box>
        </Box>
        
        {employee.addresses && employee.addresses.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Addresses</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {employee.addresses.map((address, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 3, position: 'relative' }}>
                  {address.isDefault && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10,
                        display: 'inline-block', 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1
                      }}
                    >
                      Default
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mb: 1 }}>{address.street}</Typography>
                  <Typography variant="body1">{address.city}, {address.state} {address.zipCode}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EmployeeDetailsContent;