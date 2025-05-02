import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  open: boolean;
  onClose: () => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchTerm,
  onSearchChange,
  open,
  onClose
}) => {
  const theme = useTheme();
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setLocalSearchTerm(newTerm);
    onSearchChange(newTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Paper
        elevation={2}
        sx={{
          p: 1,
          mb: 1,
          mx: 2,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search employees..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: localSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={handleClearSearch}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1,
                fontSize: '0.875rem',
                pr: localSearchTerm ? 0.5 : 1
              }
            }}
            sx={{ flex: 1 }}
          />
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ ml: 1, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default EmployeeSearch;