/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const colorOptions = {
  blue: '#1976d2', // Default MUI blue
  purple: '#9c27b0', // Deep Purple
  green: '#2e7d32', // Green
  orange: '#ed6c02', // Orange
  red: '#d32f2f', // Red
  teal: '#009688', // Teal
};

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  THEME_MODE: 'theme_mode',
  PRIMARY_COLOR: 'primary_color',
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return (savedMode as 'light' | 'dark') || 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR);
    return savedColor || colorOptions.blue;
  });

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleSetPrimaryColor = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        primaryColor,
        setPrimaryColor: handleSetPrimaryColor,
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
