import { AppBar, Toolbar, Typography } from '@mui/material';
import { ThemeSettings } from '../theme/ThemeSettings';

export const Header = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Client Management
        </Typography>
        <ThemeSettings />
      </Toolbar>
    </AppBar>
  );
};
