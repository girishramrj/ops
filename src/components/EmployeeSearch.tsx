import React, { useState, useEffect } from 'react';
import {
  Box,
  Popover,
  Typography,
  TextField,
  Button,
  Divider,
  useTheme,
  alpha,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Define props interface
interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchTerm,
  onSearchChange,
  anchorEl,
  open,
  onClose
}) => {
  const theme = useTheme();
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  
  // Update local state when props change
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleApplySearch = () => {
    onSearchChange(localSearchTerm);
    onClose();
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleApplySearch();
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          width: 320,
          p: 2,
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="500">
            Search Employees
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Search by Name
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter employee name"
        value={localSearchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        size="small"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: localSearchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setLocalSearchTerm('')}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: { borderRadius: 1 }
        }}
        sx={{ mb: 3 }}
      />
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleClearSearch}
          sx={{ borderRadius: 1 }}
        >
          Clear
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleApplySearch}
          sx={{ borderRadius: 1 }}
        >
          Search
        </Button>
      </Box>
    </Popover>
  );
};

export default EmployeeSearch;