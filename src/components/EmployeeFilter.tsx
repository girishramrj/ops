import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Chip,
  Divider,
  useTheme,
  alpha,
  Collapse,
  Paper,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';

// Define props interface
interface EmployeeFilterProps {
  positions: string[];
  selectedPositions: string[];
  onFilterChange: (positions: string[]) => void;
  open: boolean;
  onClose: () => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  positions,
  selectedPositions,
  onFilterChange,
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
    // Removed the onClose() call to keep the filter panel open
  };

  const handleClearFilter = () => {
    setLocalSelectedPositions([]);
    onFilterChange([]);
    // Removed the onClose() call to keep the filter panel open
  };

  const handleRemovePosition = (position: string) => {
    const newPositions = localSelectedPositions.filter(pos => pos !== position);
    setLocalSelectedPositions(newPositions);
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Paper 
        elevation={2}
        sx={{
          p: 1.5,
          mb: 1,
          mx: 2,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="500">
            Filter by Position
          </Typography>
          <Button 
            size="small" 
            onClick={onClose}
            startIcon={<CloseIcon fontSize="small" />}
            sx={{ color: 'text.secondary', minWidth: 'auto', p: 0.5 }}
          >
            Close
          </Button>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Autocomplete
            multiple
            id="position-filter"
            options={positions}
            value={localSelectedPositions}
            onChange={handlePositionChange}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select positions"
                size="small"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: { borderRadius: 1, fontSize: '0.875rem' }
                }}
              />
            )}
            renderTags={() => null} // Don't render tags inside the input
            sx={{ flex: 1 }}
          />
          
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleApplyFilter}
            sx={{ borderRadius: 1, height: 32, minWidth: 'auto', px: 1 }}
          >
            Apply
          </Button>
        </Stack>
        
        {/* Selected positions as chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
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
                  height: 24,
                  fontSize: '0.75rem',
                  '& .MuiChip-deleteIcon': {
                    width: 16,
                    height: 16,
                    color: alpha(theme.palette.primary.main, 0.7),
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }
                }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No positions selected
            </Typography>
          )}
        </Box>
        
        {localSelectedPositions.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={handleClearFilter}
              sx={{ borderRadius: 1, p: 0, minHeight: 'auto', fontSize: '0.75rem' }}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Paper>
    </Collapse>
  );
};

export default EmployeeFilter;