import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { theme as tokens } from './theme';

type ThemeContextValue = {
  scheme: ColorSchemeName;
  colors: typeof tokens['colors'] | typeof tokens['colors']['dark'];
  toggle?: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({ scheme: 'light', colors: tokens.colors });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [manual, setManual] = useState<ColorSchemeName | null>(null);
  const scheme = manual ?? system ?? 'light';
  const colors = useMemo(() => (scheme === 'dark' ? tokens.colors.dark : tokens.colors), [scheme]);
  return (
    <ThemeContext.Provider value={{ scheme, colors, toggle: () => setManual(scheme === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


