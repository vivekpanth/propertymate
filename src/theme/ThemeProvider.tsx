import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { theme as tokens } from './theme';

type ThemeContextValue = {
  scheme: ColorSchemeName;
  colors: typeof tokens['colors'] | typeof tokens['colors']['dark'];
  spacing: typeof tokens['spacing'];
  radius: typeof tokens['radius'];
  shadows: typeof tokens['shadows'];
  typography: typeof tokens['typography'];
  toggle?: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({ 
  scheme: 'light', 
  colors: tokens.colors,
  spacing: tokens.spacing,
  radius: tokens.radius,
  shadows: tokens.shadows,
  typography: tokens.typography,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [manual, setManual] = useState<ColorSchemeName | null>(null);
  const scheme = manual ?? system ?? 'light';
  const colors = useMemo(() => (scheme === 'dark' ? tokens.colors.dark : tokens.colors), [scheme]);
  
  const value = useMemo(() => ({
    scheme,
    colors,
    spacing: tokens.spacing,
    radius: tokens.radius,
    shadows: tokens.shadows,
    typography: tokens.typography,
    toggle: () => setManual(scheme === 'dark' ? 'light' : 'dark')
  }), [scheme, colors]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


