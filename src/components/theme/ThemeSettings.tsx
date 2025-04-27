import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useTheme, colorOptions } from '../../contexts/ThemeContext';

export const ThemeSettings = () => {
  const { mode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={toggleTheme} sx={{ mr: 1 }} size="small">
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      <IconButton onClick={handleClick} size="small">
        <PaletteIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem sx={{ typography: 'subtitle2', opacity: 0.6 }}>Color Options</MenuItem>
        <Divider />
        {Object.entries(colorOptions).map(([name, color]) => (
          <MenuItem
            key={name}
            onClick={() => handleColorChange(color)}
            selected={primaryColor === color}
          >
            <ListItemIcon>
              <CircleIcon sx={{ color }} />
            </ListItemIcon>
            <ListItemText
              primary={name.charAt(0).toUpperCase() + name.slice(1)}
              sx={{
                ml: -1,
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
