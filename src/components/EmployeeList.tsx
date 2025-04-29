//components/EmployeeList.tsx:

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Pagination,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  // Drawer
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteMultipleIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  // Cancel as CancelIcon
} from '@mui/icons-material';
import api, { Employee } from '../services/api';
import EmployeeDetails from './EmployeeDetails';
import EmployeeFilter from './EmployeeFilter';
import EmployeeSearch from './EmployeeSearch';

// Define type for sorting
type Order = 'asc' | 'desc';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean, ids: number[] }>({ show: false, ids: [] });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [order] = useState<Order>('asc');
  const [orderBy] = useState<keyof Employee>('name');
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  
  // Filter state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  
  // Search state
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      const data = await api.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
      
      // Extract unique positions for filter
      const positions = Array.from(new Set(data.map(emp => emp.position))).filter(Boolean) as string[];
      setAvailablePositions(positions);
      
      // Ensure loader shows for at least 1 second
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  // Apply position filters and search
  useEffect(() => {
    let filtered = employees;
    
    // Apply position filter
    if (selectedPositions.length > 0) {
      filtered = filtered.filter(emp => 
        selectedPositions.includes(emp.position)
      );
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredEmployees(filtered);
    // Reset to first page when filters change
    setPage(1);
  }, [selectedPositions, searchTerm, employees]);

  const handleDelete = async () => {
    try {
      for (const id of confirmDelete.ids) {
        await api.delete(id);
      }
      setEmployees(employees.filter(emp => !confirmDelete.ids.includes(emp.id!)));
      setSelected(selected.filter(id => !confirmDelete.ids.includes(id)));
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setConfirmDelete({ show: false, ids: [] });
    }
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  // Function to sort data
  const sortedData = (data: Employee[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (order === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all employees, not just the current page
      const allIds = employees.map(employee => employee.id!);
      setSelected(allIds);
    } else {
      // Deselect all
      setSelected([]);
    }
  };

  const handleCheckboxClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleDeleteSelected = () => {
    if (selected.length > 0) {
      setConfirmDelete({ show: true, ids: selected });
    }
  };
  
  // Filter handlers
  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (positions: string[]) => {
    setSelectedPositions(positions);
  };
  
  // Search handlers
  const handleOpenSearch = (event: React.MouseEvent<HTMLElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Get current page data with sorting
  const indexOfLastEmployee = page * rowsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
  const sortedEmployees = sortedData(filteredEmployees);
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <CircularProgress size={60} />
      <Typography variant="body1" sx={{ mt: 2 }}>Loading employees...</Typography>
    </Box>
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: Employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewEmployee = () => {
    handleMenuClose();
    setViewDrawerOpen(true);
  };

  const handleCloseViewDrawer = () => {
    setViewDrawerOpen(false);
  };

  const handleEditEmployee = () => {
    handleMenuClose();
    if (selectedEmployee) {
      navigate(`/edit/${selectedEmployee.id}`);
    }
  };

  const handleDeleteEmployee = () => {
    handleMenuClose();
    if (selectedEmployee) {
      setConfirmDelete({ show: true, ids: [selectedEmployee.id!] });
    }
  };

  return (
    <Box sx={{ width: '100%' , overflowX: 'auto', overflowY:'hidden'}}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: '8px', overflowX: 'auto', overflowY:'hidden' }}>
        <Toolbar sx={{ 
          pl: { sm: 2 }, 
          pr: { xs: 1, sm: 1 },
          bgcolor: selected.length > 0 ? 'rgba(25, 118, 210, 0.12)' : '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="primary"
              variant="subtitle1"
              component="div"
            >
              {selected.length} {selected.length === 1 ? 'employee' : 'employees'} selected
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                id="tableTitle"
                component="div"
                sx={{ mr: 2 }}
              >
                Employee List
              </Typography>
              
              {(selectedPositions.length > 0 || searchTerm) && (
                <Typography variant="body2" color="text.secondary">
                  ({filteredEmployees.length} of {employees.length} employees)
                </Typography>
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selected.length > 0 ? (
              <Tooltip title="Delete Selected">
                <IconButton 
                  color="error" 
                  onClick={handleDeleteSelected}
                  size="medium"
                >
                  <DeleteMultipleIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Filter by Position">
                  <IconButton onClick={handleOpenFilter}>
                    <Badge 
                      color="primary" 
                      badgeContent={selectedPositions.length} 
                      invisible={selectedPositions.length === 0}
                    >
                      <FilterListIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Search by Name">
                  <IconButton onClick={handleOpenSearch}>
                    <Badge 
                      color="primary" 
                      badgeContent={searchTerm ? 1 : 0} 
                      invisible={!searchTerm}
                    >
                      <SearchIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add New Employee">
                  <IconButton 
                    color="primary" 
                    onClick={() => navigate('/add')}
                    size="medium"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
        
        <TableContainer sx={{ overflowX: 'auto', overflowY:'hidden' }} >
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                <TableCell padding="checkbox">
                  <Checkbox                    
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredEmployees.length}
                    checked={filteredEmployees.length > 0 && selected.length === filteredEmployees.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all employees' }}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 24 },
                      '& .PrivateSwitchBase-input': {
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 1,
                        opacity: 0,
                        width: '18px',
                        height: '18px'
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>Phone</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEmployees.map((employee) => {
                const isItemSelected = isSelected(employee.id!);
                return (
                  <TableRow
                    hover
                    key={employee.id}
                    selected={isItemSelected}
                    sx={{ 
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': { borderBottom: '1px solid #e0e0e0' }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleCheckboxClick(employee.id!)}
                        inputProps={{ 'aria-labelledby': `employee-${employee.id}` }}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 24 },
                          '& .PrivateSwitchBase-input': {
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            zIndex: 1,
                            opacity: 0,
                            width: '100%',
                            height: '100%'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ pl: 2 }} id={`employee-${employee.id}`}>
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton 
                          size="small"
                          onClick={(event) => handleMenuOpen(event, employee)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {currentEmployees.length === 0 && (
                <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No employees found. Add some employees to get started.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#ecf0f1'
        }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredEmployees.length > 0 ? indexOfFirstEmployee + 1 : 0} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} entries
          </Typography>
          
          <Pagination 
            count={Math.ceil(filteredEmployees.length / rowsPerPage)} 
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, ids: [] })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDelete.ids.length === 1 
              ? 'Are you sure you want to delete this employee?' 
              : `Are you sure you want to delete these ${confirmDelete.ids.length} employees?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ show: false, ids: [] })} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleViewEmployee}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditEmployee}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteEmployee}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Employee Details Component */}
      <EmployeeDetails 
        open={viewDrawerOpen}
        employee={selectedEmployee}
        onClose={handleCloseViewDrawer}
      />
      
      {/* Position Filter Component */}
      <EmployeeFilter
        positions={availablePositions}
        selectedPositions={selectedPositions}
        onFilterChange={handleFilterChange}
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleCloseFilter}
      />
      
      {/* Search Component */}
      <EmployeeSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        anchorEl={searchAnchorEl}
        open={Boolean(searchAnchorEl)}
        onClose={handleCloseSearch}
      />
    </Box>
  );
};

export default EmployeeList;