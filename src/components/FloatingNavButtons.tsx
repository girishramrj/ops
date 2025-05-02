import React, { useState, useEffect } from 'react';
import { Box, Fab, Zoom, Tooltip } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

interface FloatingNavButtonsProps {
  scrollThreshold?: number;
}

const FloatingNavButtons: React.FC<FloatingNavButtonsProps> = ({ 
  scrollThreshold = 300 
}) => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      // Check if at the top of the page
      const isAtTop = window.scrollY <= scrollThreshold;
      
      // Check if at the bottom of the page
      const isAtBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 20;
      
      // Show "Go to Top" button only when not at the top
      setShowTopButton(!isAtTop);
      
      // Show "Go to Bottom" button only when not at the bottom
      setShowBottomButton(!isAtBottom);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      <Zoom in={showTopButton}>
        <Tooltip title="Go to top" placement="left">
          <Fab
            size="small"
            aria-label="scroll to top"
            onClick={scrollToTop}
            sx={{
              bgcolor: '#244855', // Dark teal from your palette
              color: 'white',
              '&:hover': {
                bgcolor: '#1a343d', // Darker shade
              }
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Tooltip>
      </Zoom>
      
      <Zoom in={showBottomButton}>
        <Tooltip title="Go to bottom" placement="left">
          <Fab
            size="small"
            aria-label="scroll to bottom"
            onClick={scrollToBottom}
            sx={{
              bgcolor: '#E64833', // Coral red from your palette
              color: 'white',
              '&:hover': {
                bgcolor: '#c13a28', // Darker shade
              }
            }}
          >
            <KeyboardArrowDown />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default FloatingNavButtons;