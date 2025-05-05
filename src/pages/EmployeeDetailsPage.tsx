import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Employee } from '../services/api';
import api from '../services/api';
import EmployeeDetailsContent from '../components/EmployeeDetailsContent';
import FloatingNavButtons from '../components/FloatingNavButtons';

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        setError('Employee ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const employeeId = parseInt(id);
        if (isNaN(employeeId)) {
          setError('Invalid employee ID');
          return;
        }

        const data = await api.getById(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error || 'Employee not found'}</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Employee List
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/employees');
            }}
          >
            Employee List
          </Link>
          <Typography color="text.primary">Employee Details</Typography>
        </Breadcrumbs>
      </Box>

      <EmployeeDetailsContent employee={employee} />
      
      {/* Add FloatingNavButtons component */}
      <FloatingNavButtons scrollThreshold={200} />
    </Container>
  );
};

export default EmployeeDetailsPage;