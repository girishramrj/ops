import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  useTheme,
  alpha,
  Container,
  Paper} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  // Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import FloatingNavButtons from '../components/FloatingNavButtons';
import ThemeToggle from '../components/ThemeToggle';
import api, { Employee } from '../services/api';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionCounts, setPositionCounts] = useState<{[key: string]: number}>({});
  const [uniquePositions, setUniquePositions] = useState<string[]>([]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await api.getAll();
        setEmployees(data);
        
        // Calculate position counts
        const positions: {[key: string]: number} = {};
        data.forEach((emp: Employee) => {
          if (emp.position) {
            positions[emp.position] = (positions[emp.position] || 0) + 1;
          }
        });
        setPositionCounts(positions);
        setUniquePositions(Object.keys(positions));
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const stats = [
    { 
      title: 'Total Employees', 
      value: loading ? '...' : employees.length.toString(), 
      icon: <PeopleIcon />, 
      color: '#244855' 
    },
    { 
      title: 'New Hires', 
      value: '8', // This could be calculated based on hire date if available
      icon: <PersonAddIcon />, 
      color: '#E64833' 
    },
    { 
      title: 'Positions', 
      value: loading ? '...' : uniquePositions.length.toString(), 
      icon: <WorkIcon />, 
      color: '#874F41' 
    },
    { 
      title: 'Notifications', 
      value: '3', 
      icon: <NotificationsIcon />, 
      color: '#90AEAD' 
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 500,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '100%',
              height: 4,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2
            }
          }}
        >
          Dashboard Overview
        </Typography>
        
        {/* Add ThemeToggle component */}
        <Box sx={{ mb: 4 }}>
          <ThemeToggle />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  bgcolor: isDarkMode ? alpha('#2E073F', 0.7) : theme.palette.background.paper,
                  borderLeft: `5px solid ${stat.color}`,
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 3
                }}>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1.8rem', sm: '2.2rem' }
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(stat.color, isDarkMode ? 0.3 : 0.1), 
                      color: stat.color,
                      width: 60,
                      height: 60,
                      boxShadow: `0 4px 8px ${alpha(stat.color, 0.2)}`
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                minHeight: '400px',
                bgcolor: isDarkMode ? alpha('#2E073F', 0.7) : theme.palette.background.paper,
                boxShadow: 3,
                overflow: 'hidden'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 500,
                  pb: 1,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                Employee Distribution by Position
              </Typography>
              {loading ? (
                <Box sx={{ 
                  height: '90%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}>
                  <Typography>Loading position data...</Typography>
                </Box>
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {Object.entries(positionCounts).map(([position, count], index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={position}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: isDarkMode ? alpha('#7A1CAC', 0.1) : alpha(theme.palette.primary.main, 0.05),
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isDarkMode ? alpha('#7A1CAC', 0.15) : alpha(theme.palette.primary.main, 0.1),
                            transform: 'translateY(-5px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        <Typography variant="h6" fontWeight={500} gutterBottom>
                          {position}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: isDarkMode ? alpha('#AD49E1', 0.3) : alpha(theme.palette.primary.main, 0.1),
                              color: isDarkMode ? '#AD49E1' : theme.palette.primary.main,
                              width: 40,
                              height: 40,
                              mr: 2
                            }}
                          >
                            <PeopleIcon />
                          </Avatar>
                          <Typography variant="h5" fontWeight={700} color="primary">
                            {count}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {count === 1 ? 'Employee' : 'Employees'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                  {Object.keys(positionCounts).length === 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        No position data available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <FloatingNavButtons />
    </Container>
  );
};

export default HomePage;