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
  Stack,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon
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

const EmployeeForm: React.FC<EmployeeFormProps> = ({ id, onSubmitSuccess }) => {
  const navigate = useNavigate();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <CircularProgress size={60} />
      <Typography variant="body1" sx={{ mt: 2 }}>Loading employee data...</Typography>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', overflow: 'hidden' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {isEditMode ? 'Edit' : 'Add'} Employee
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            autoComplete="name"
          />
          
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
            variant="outlined"
            autoComplete="email"
          />
          
          <TextField
            fullWidth
            id="position"
            name="position"
            label="Position"
            value={formData.position}
            onChange={handleChange}
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            variant="outlined"
            autoComplete="tel"
          />
          
          {/* Addresses Section */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3">
                Addresses
              </Typography>
              <Button 
                startIcon={<AddIcon />} 
                variant="outlined" 
                onClick={handleAddAddress}
                size="small"
              >
                Add Address
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {formData.addresses?.map((address, index) => (
              <Card 
                key={address.id} 
                variant="outlined" 
                sx={{ 
                  mb: 2, 
                  borderColor: address.isDefault ? 'primary.main' : 'divider',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                
                <CardContent>
                  {address.isDefault && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                        required
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <TextField
                          fullWidth
                          label="City"
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px' }}>
                        <TextField
                          fullWidth
                          label="State"
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px' }}>
                        <TextField
                          fullWidth
                          label="Zip Code"
                          value={address.zipCode}
                          onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {!address.isDefault && (
                        <Button 
                          size="small" 
                          onClick={() => handleSetDefaultAddress(index)}
                          color="primary"
                        >
                          Set as Default
                        </Button>
                      )}
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveAddress(index)}
                        disabled={formData.addresses?.length === 1}
                        size="small"
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;