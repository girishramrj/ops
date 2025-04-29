import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  Divider,
  Card,
  CardContent,
  Container,
  Chip,
  useTheme,
  alpha,
  Autocomplete,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import api, { Employee } from '../services/api';

// Define address interface
interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface EmployeeFormProps {
  id?: string;
  onSubmitSuccess?: () => void;
}

// List of available positions
const positionOptions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'Project Manager',
  'UI/UX Designer',
  'Graphic Designer',
  'Data Scientist',
  'Data Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'Technical Writer',
  'Marketing Specialist',
  'HR Manager',
  'Finance Manager',
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'Sales Representative',
  'Customer Support Specialist'
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ id, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Employee & { addresses: Address[] }>({
    name: '',
    email: '',
    position: '',
    phone: '',
    addresses: [{ id: 1, street: '', city: '', state: '', zipCode: '', isDefault: true }]
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (!isEditMode || !id) {
      setLoading(false);
      return;
    }
    
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Ensure ID is a valid number
        const employeeId = parseInt(id);
        if (isNaN(employeeId)) {
          setError('Invalid employee ID');
          return;
        }
        
        const employee = await api.getById(employeeId);
        // Initialize addresses array if it doesn't exist
        setFormData({
          ...employee,
          addresses: employee.addresses || [{ id: 1, street: '', city: '', state: '', zipCode: '', isDefault: true }]
        });
        
        // Ensure loader shows for at least 1 second
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle position change from Autocomplete
  const handlePositionChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setFormData({ ...formData, position: newValue || '' });
  };

  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    const updatedAddresses = formData.addresses?.map((address, i) => {
      if (i === index) {
        return { ...address, [field]: value };
      }
      return address;
    });
    
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleAddAddress = () => {
    const newId = Math.max(0, ...formData.addresses!.map(a => a.id)) + 1;
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses!,
        { id: newId, street: '', city: '', state: '', zipCode: '', isDefault: false }
      ]
    });
  };

  const handleRemoveAddress = (index: number) => {
    // Don't remove if it's the only address
    if (formData.addresses?.length === 1) {
      return;
    }
    
    const updatedAddresses = formData.addresses?.filter((_, i) => i !== index);
    
    // If we're removing the default address, make the first one default
    if (formData.addresses?.[index].isDefault && updatedAddresses?.length) {
      updatedAddresses[0].isDefault = true;
    }
    
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = formData.addresses?.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        // Ensure ID is a valid number
        const employeeId = parseInt(id);
        if (isNaN(employeeId)) {
          setError('Invalid employee ID');
          return;
        }
        
        await api.update({ ...formData, id: employeeId });
      } else {
        await api.add(formData);
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'add'} employee. Please try again.`);
    }
  };

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '400px',
      backgroundColor: alpha(theme.palette.primary.light, 0.05),
      borderRadius: 2
    }}>
      <CircularProgress size={60} color="primary" />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>Loading employee data...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <PersonIcon fontSize="large" />
          <Typography variant="h4" component="h1" fontWeight="500">
            {isEditMode ? 'Edit' : 'Add'} Employee
          </Typography>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mx: 3, 
              mt: 3, 
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <PersonIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="h6" fontWeight="500">Personal Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  autoComplete="name"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  variant="outlined"
                  autoComplete="email"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Autocomplete
                  id="position"
                  options={positionOptions}
                  value={formData.position || null}
                  onChange={handlePositionChange}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Job Position"
                      required
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 1 }
                      }}
                    />
                  )}
                  sx={{ width: '100%' }}
                />
                
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  autoComplete="tel"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
              </Box>
            </Stack>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="500">
                  Addresses
                </Typography>
              </Box>
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                onClick={handleAddAddress}
                size="small"
                sx={{ 
                  borderRadius: 1,
                  boxShadow: 2,
                }}
              >
                Add Address
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              {formData.addresses?.map((address, index) => (
                <Card 
                  key={address.id} 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor: address.isDefault ? 'primary.main' : alpha(theme.palette.divider, 0.8),
                    position: 'relative',
                    overflow: 'visible', // Changed from 'hidden' to 'visible' to prevent chip clipping
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: address.isDefault ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` : '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: address.isDefault 
                        ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.25)}` 
                        : '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, pt: address.isDefault ? 5 : 3 }}> {/* Added top padding when default */}
                    {address.isDefault && (
                      <Chip
                        label="Default"
                        color="primary"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -12, // Changed from 12 to -12 to position above the card
                          right: 12,
                          fontWeight: 'bold',
                          zIndex: 1, // Added to ensure chip appears above other elements
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Added subtle shadow
                        }}
                      />
                    )}
                    
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                        required
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 1 }
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <TextField
                          fullWidth
                          label="City"
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            label="State"
                            value={address.state}
                            onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                            required
                            variant="outlined"
                            InputProps={{
                              sx: { borderRadius: 1 }
                            }}
                            sx={{ width: { xs: '100%', sm: '120px' } }}
                          />
                          
                          <TextField
                            label="Zip Code"
                            value={address.zipCode}
                            onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                            required
                            variant="outlined"
                            InputProps={{
                              sx: { borderRadius: 1 }
                            }}
                            sx={{ width: { xs: '100%', sm: '120px' } }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        {!address.isDefault && (
                          <Button 
                            size="small" 
                            onClick={() => handleSetDefaultAddress(index)}
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          >
                            Set as Default
                          </Button>
                        )}
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveAddress(index)}
                          disabled={formData.addresses?.length === 1}
                          size="small"
                          sx={{ 
                            ml: 'auto',
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.2),
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: 1,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ 
                borderRadius: 1,
                px: 3,
                boxShadow: 2
              }}
            >
              {isEditMode ? 'Update' : 'Save'} Employee
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;