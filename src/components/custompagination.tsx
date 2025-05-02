import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  useTheme,
  alpha
} from '@mui/material';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';

interface CustomPaginationProps {
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  onRowsPerPageChange?: (event: SelectChangeEvent<number>) => void;
  rowsPerPageOptions?: number[];
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100]
}) => {
  const theme = useTheme();
  
  const handlePrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (page > 1) {
      onPageChange(event as unknown as React.ChangeEvent<unknown>, page - 1);
    }
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    const maxPage = Math.ceil(count / rowsPerPage);
    if (page < maxPage) {
      onPageChange(event as unknown as React.ChangeEvent<unknown>, page + 1);
    }
  };

  const startItem = count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, count);
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= Math.ceil(count / rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        bgcolor: '#244855', // Updated to use the dark teal color
        color: 'white',
        p: 1,
        px: 2,
        borderRadius: '8px 8px 8px 8px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
          Rows per page:
        </Typography>
        <FormControl size="small" variant="standard" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            sx={{
              color: 'white',
              '& .MuiSelect-select': { py: 0 },
              '& .MuiSvgIcon-root': { color: 'white' }
            }}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 200 }
              }
            }}
            disableUnderline
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" sx={{ mx: 2 }}>
        {startItem}–{endItem} of {count}
      </Typography>

      <Box sx={{ display: 'flex' }}>
        <IconButton
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          size="small"
          sx={{
            color: isPreviousDisabled ? alpha('#ffffff', 0.3) : '#ffffff',
            '&:hover': { bgcolor: alpha('#ffffff', 0.1) }
          }}
        >
          <PreviousIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={isNextDisabled}
          size="small"
          sx={{
            color: isNextDisabled ? alpha('#ffffff', 0.3) : '#ffffff',
            '&:hover': { bgcolor: alpha('#ffffff', 0.1) }
          }}
        >
          <NextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomPagination;