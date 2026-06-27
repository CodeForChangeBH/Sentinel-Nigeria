import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, type ColorPalette } from '../styles/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDarkMode: boolean;
  colors: ColorPalette;
  setMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
}

const THEME_STORAGE_KEY = '@sentinel_nigeria_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
        setModeState(storedMode);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const currentIsDark = getIsDarkMode(mode, systemColorScheme);
    const newMode: ThemeMode = currentIsDark ? 'light' : 'dark';
    setMode(newMode);
  }, [mode, systemColorScheme, setMode]);

  const getIsDarkMode = (themeMode: ThemeMode, systemScheme: string | null | undefined): boolean => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return themeMode === 'dark';
  };

  const isDarkMode = getIsDarkMode(mode, systemColorScheme);
  const colors = isDarkMode ? darkColors : lightColors;

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, isDarkMode, colors, setMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
