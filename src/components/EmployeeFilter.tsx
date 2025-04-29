import React, { useState, useEffect } from 'react';
import {
  Box,
  Popover,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Chip,
  Divider,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Define props interface
interface EmployeeFilterProps {
  positions: string[];
  selectedPositions: string[];
  onFilterChange: (positions: string[]) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  positions,
  selectedPositions,
  onFilterChange,
  anchorEl,
  open,
  onClose
}) => {
  const theme = useTheme();
  const [localSelectedPositions, setLocalSelectedPositions] = useState<string[]>(selectedPositions);
  
  // Update local state when props change
  useEffect(() => {
    setLocalSelectedPositions(selectedPositions);
  }, [selectedPositions]);

  const handlePositionChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    setLocalSelectedPositions(newValue);
  };

  const handleApplyFilter = () => {
    onFilterChange(localSelectedPositions);
    onClose();
  };

  const handleClearFilter = () => {
    setLocalSelectedPositions([]);
    onFilterChange([]);
    onClose();
  };

  const handleRemovePosition = (position: string) => {
    const newPositions = localSelectedPositions.filter(pos => pos !== position);
    setLocalSelectedPositions(newPositions);
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
          <FilterIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="500">
            Filter Employees
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Position
      </Typography>
      
      <Autocomplete
        multiple
        id="position-filter"
        options={positions}
        value={localSelectedPositions}
        onChange={handlePositionChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select positions"
            size="small"
            fullWidth
            InputProps={{
              ...params.InputProps,
              sx: { borderRadius: 1 }
            }}
          />
        )}
        renderTags={() => null} // Don't render tags inside the input
        sx={{ mb: 2 }}
      />
      
      {/* Selected positions as chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {localSelectedPositions.length > 0 ? (
          localSelectedPositions.map((position) => (
            <Chip
              key={position}
              label={position}
              onDelete={() => handleRemovePosition(position)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                borderRadius: 1,
                '& .MuiChip-deleteIcon': {
                  color: alpha(theme.palette.primary.main, 0.7),
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No positions selected
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleClearFilter}
          sx={{ borderRadius: 1 }}
        >
          Clear All
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleApplyFilter}
          sx={{ borderRadius: 1 }}
        >
          Apply Filter
        </Button>
      </Box>
    </Popover>
  );
};

export default EmployeeFilter;