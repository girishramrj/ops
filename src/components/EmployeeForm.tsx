import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { z } from 'zod';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
  Divider,
  Container,
  useTheme,
  alpha,
  Autocomplete,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import api, { Employee } from '../services/api';
import AddressTable from './AddressTable';

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

// Address validation schema
const addressSchema = Yup.object().shape({
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip code is required'),
  isDefault: Yup.boolean()
});

// Define Zod schema for personal information validation
const personalInfoSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine(email => email.includes('@'), {
      message: "Email must contain @ symbol"
    }),
  phone: z.string()
    .min(1, "Phone number is required")
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  position: z.string().min(1, "Position is required")
});

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

  // Add these state variables for the address dialog
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address>({
    id: 0,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  
  // Add state for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isEditMode = !!id;

  // Function to capitalize first letter of each word
  const capitalizeWords = (str: string): string => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Add the handleEditAddress function
  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setCurrentAddress({...formData.addresses[index]});
    setAddressDialogOpen(true);
  };

  // Add the handleAddNewAddress function properly inside the component
  const handleAddNewAddress = () => {
    const newId = Math.max(0, ...formData.addresses.map(a => a.id)) + 1;
    setEditingAddressIndex(null);
    setCurrentAddress({
      id: newId,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: formData.addresses.length === 0 // Make it default if it's the first address
    });
    setAddressDialogOpen(true);
  };

  // Handle saving address from Formik form
  const handleSaveAddress = (values: Address) => {
    let updatedAddresses: Address[];
    
    if (editingAddressIndex !== null) {
      // Update existing address
      updatedAddresses = formData.addresses.map((address, index) => {
        if (index === editingAddressIndex) {
          return values;
        }
        // If we're setting a new default, make sure others are not default
        if (values.isDefault && address.isDefault) {
          return { ...address, isDefault: false };
        }
        return address;
      });
    } else {
      // Add new address
      updatedAddresses = [...formData.addresses];
      
      // If the new address is default, update other addresses
      if (values.isDefault) {
        updatedAddresses = updatedAddresses.map(address => ({
          ...address,
          isDefault: false
        }));
      }
      
      updatedAddresses.push(values);
    }
    
    setFormData({
      ...formData,
      addresses: updatedAddresses
    });
    
    setAddressDialogOpen(false);
  };

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
    const { name, value } = e.target;
    
    // If the field is "name", capitalize the first letter of each word
    if (name === 'name') {
      setFormData({ ...formData, [name]: capitalizeWords(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle position change from Autocomplete
  const handlePositionChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setFormData({ ...formData, position: newValue || '' });
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
    
    // Reset error state
    setError(null);
    
    // Validate with Zod
    try {
      const validationResult = personalInfoSchema.safeParse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position
      });
      
      if (!validationResult.success) {
        // Extract and display the first error message
        const formattedErrors = validationResult.error.format();
        const errorMessages = [];
        
        if (formattedErrors.name?._errors) {
          errorMessages.push(formattedErrors.name._errors[0]);
        }
        if (formattedErrors.email?._errors) {
          errorMessages.push(formattedErrors.email._errors[0]);
        }
        if (formattedErrors.phone?._errors) {
          errorMessages.push(formattedErrors.phone._errors[0]);
        }
        if (formattedErrors.position?._errors) {
          errorMessages.push(formattedErrors.position._errors[0]);
        }
        
        setError(errorMessages.join(', '));
        return;
      }
      
      // Clean up addresses data - remove empty addresses
      const cleanedAddresses = formData.addresses.filter(addr => 
        addr.street.trim() !== '' || 
        addr.city.trim() !== '' || 
        addr.state.trim() !== '' || 
        addr.zipCode.trim() !== ''
      );
      
      // Ensure at least one address exists
      const addressesToSubmit = cleanedAddresses.length > 0 
        ? cleanedAddresses 
        : [{ id: 1, street: '', city: '', state: '', zipCode: '', isDefault: true }];
      
      // Prepare the data for submission
      const dataToSubmit = {
        ...formData,
        addresses: addressesToSubmit
      };
      
      // Check if email is unique (only for new employees)
      // if (!isEditMode) {
      //   try {
      //     // This assumes your API has a method to check if an email exists
      //     // You may need to implement this in your API service
      //     const emailExists = await api.checkEmailExists(formData.email);
      //     if (emailExists) {
      //       setError('Email address is already in use. Please use a different email.');
      //       return;
      //     }
      //   } catch (error) {
      //     console.error('Error checking email uniqueness:', error);
      //     // Continue with submission if the check fails
      //   }
      // }
      
      try {
        if (isEditMode && id) {
          // Ensure ID is a valid number
          const employeeId = parseInt(id);
          if (isNaN(employeeId)) {
            setError('Invalid employee ID');
            return;
          }
          
          await api.update({ ...dataToSubmit, id: employeeId });
          // Show success message
          setSnackbarMessage(`Employee ${formData.name} updated successfully!`);
          setSnackbarOpen(true);
        } else {
          await api.add(dataToSubmit);
          // Show success message
          setSnackbarMessage(`Employee ${formData.name} added successfully!`);
          setSnackbarOpen(true);
        }
        
        // Set a timeout to allow the snackbar to be visible before navigating away
        setTimeout(() => {
          if (onSubmitSuccess) {
            onSubmitSuccess();
          } else {
            navigate('/');
          }
        }, 1500);
      } catch (error: any) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, error);
        
        // More detailed error message
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} employee. `;
        if (error.response) {
          errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
        } else if (error.request) {
          errorMessage += 'No response received from server. Please check your connection.';
        } else {
          errorMessage += error.message || 'Unknown error occurred.';
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError('An unexpected error occurred during validation.');
    }
  };

  // Add handler for closing the snackbar
  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
          
          {/* Addresses section - modified to use AddressTable */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="500">
                  Addresses
                </Typography>
              </Box>
              <Button 
                aria-label="Add Address"
                variant="contained" 
                onClick={handleAddNewAddress}
                size="small"
                sx={{ 
                  borderRadius: 1,
                  boxShadow: 2,
                  minWidth: 'auto',
                  p: 1
                }}
              >
                <AddIcon />
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {/* Address Table */}
            <AddressTable 
              addresses={formData.addresses}
              onEdit={handleEditAddress}
              onDelete={handleRemoveAddress}
              onSetDefault={handleSetDefaultAddress}
            />
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          {/* Form buttons - unchanged */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              aria-label="Cancel"
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: 1,
                minWidth: 'auto',
                p: 1.5
              }}
            >
              <CancelIcon />
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label={isEditMode ? 'Update Employee' : 'Save Employee'}
              sx={{ 
                borderRadius: 1,
                minWidth: 'auto',
                p: 1.5,
                boxShadow: 2
              }}
            >
              <SaveIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Address Edit Dialog with Formik */}
      <Dialog 
        open={addressDialogOpen} 
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={currentAddress}
            validationSchema={addressSchema}
            onSubmit={(values) => {
              handleSaveAddress(values);
            }}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <Box sx={{ pt: 1 }}>
                  <Stack spacing={3}>
                    <Box>
                      <TextField
                        fullWidth
                        id="street"
                        name="street"
                        label="Street Address"
                        value={values.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.street && Boolean(errors.street)}
                        helperText={touched.street && errors.street}
                        required
                        variant="outlined"
                        autoFocus
                        InputProps={{
                          sx: { borderRadius: 1 }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        id="city"
                        name="city"
                        label="City"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                        required
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 1 }
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          id="state"
                          name="state"
                          label="State"
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.state && Boolean(errors.state)}
                          helperText={touched.state && errors.state}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          sx={{ width: { xs: '100%', sm: '120px' } }}
                        />
                        
                        <TextField
                          id="zipCode"
                          name="zipCode"
                          label="Zip Code"
                          value={values.zipCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.zipCode && Boolean(errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          sx={{ width: { xs: '100%', sm: '120px' } }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        type="button"
                        variant={values.isDefault ? "contained" : "outlined"}
                        color={values.isDefault ? "primary" : "inherit"}
                        onClick={() => setFieldValue('isDefault', !values.isDefault)}
                        sx={{ borderRadius: 1 }}
                        aria-label={values.isDefault ? "Default Address" : "Set as Default"}
                      >
                        {values.isDefault ? "Default Address" : "Set as Default"}
                      </Button>
                      {values.isDefault && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          This address will be used as the primary contact address
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
                
                <DialogActions sx={{ px: 3, pb: 3, mt: 3 }}>
                  <Button 
                    onClick={() => setAddressDialogOpen(false)} 
                    color="inherit"
                    variant="outlined"
                    aria-label="Cancel"
                    sx={{ 
                      borderRadius: 1,
                      minWidth: 'auto',
                      p: 1.5
                    }}
                  >
                    <CancelIcon />
                  </Button>
                  <Button 
                    type="submit"
                    color="primary"
                    variant="contained"
                    aria-label="Save Address"
                    sx={{ 
                      borderRadius: 1,
                      minWidth: 'auto',
                      p: 1.5,
                      boxShadow: 2
                    }}
                  >
                    <SaveIcon />
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeForm;