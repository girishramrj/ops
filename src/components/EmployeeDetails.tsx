import React from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../services/api';

interface EmployeeDetailsProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ open, employee, onClose }) => {
  const navigate = useNavigate();

  if (!employee) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, p: 3 }
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">Employee Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CancelIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="body1">{employee.name}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
          <Typography variant="body1">{employee.email}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Position</Typography>
          <Typography variant="body1">{employee.position}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
          <Typography variant="body1">{employee.phone}</Typography>
        </Box>
        
        {employee.addresses && employee.addresses.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Addresses</Typography>
            {employee.addresses.map((address, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                {address.isDefault && (
                  <Typography variant="caption" sx={{ display: 'inline-block', bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, mb: 1 }}>
                    Default
                  </Typography>
                )}
                <Typography variant="body2">{address.street}</Typography>
                <Typography variant="body2">{address.city}, {address.state} {address.zipCode}</Typography>
              </Paper>
            ))}
          </Box>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={() => {
              onClose();
              navigate(`/edit/${employee.id}`);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EmployeeDetails;