import React from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Employee } from '../services/api';

interface EmployeeTableProps {
  currentEmployees: Employee[];
  selected: number[];
  isSelected: (id: number) => boolean;
  handleCheckboxClick: (id: number) => void;
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, employee: Employee) => void;
  filteredEmployees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  currentEmployees,
  selected,
  isSelected,
  handleCheckboxClick,
  handleSelectAllClick,
  handleMenuOpen,
  filteredEmployees,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Custom checkbox renderer for the selection column
  const renderCheckbox = (params: GridRenderCellParams) => {
    const isItemSelected = isSelected(params.row.id);
    return (
      <Checkbox
        color="primary"
        checked={isItemSelected}
        onChange={() => handleCheckboxClick(params.row.id)}
        inputProps={{ 'aria-labelledby': `employee-${params.row.id}` }}
        sx={{
          '& .MuiSvgIcon-root': { fontSize: 24 },
          '& .PrivateSwitchBase-input': {
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 1,
            opacity: 0,
            width: '24px',
            height: '24px'
          }
        }}
      />
    );
  };

  // Custom action button renderer
  const renderActions = (params: GridRenderCellParams) => {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, params.row)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: 'selection',
      headerName: '',
      width: 63,
      sortable: false,
      filterable: false,
      renderCell: renderCheckbox,
      renderHeader: () => (
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
      )
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'position', headerName: 'Position', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: renderActions,
      headerAlign: 'center',
      align: 'center'
    },
  ];

  // Ensure all rows have a unique ID
  const rows = currentEmployees.map((employee, index) => ({
    ...employee,
    id: employee.id || `temp-id-${index}`,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        checkboxSelection={false}
        disableColumnMenu
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(even)': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9f9f9',
              color: isDarkMode ? '#000000' : 'inherit',
              '& .MuiDataGrid-cell': {
                color: isDarkMode ? '#ffffff' : 'inherit',
              }
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              },
            },
          },
        }}
      />
      {rows.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <p>No employees found. Add some employees to get started.</p>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeTable;