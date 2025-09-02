import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

jest.mock('../src/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getSession: jest.fn(async () => ({ data: { session: null }, error: null })),
    },
  },
}));

// Mock the theme context
jest.mock('../src/theme/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    colors: {
      primary: '#335CFF',
      accent: '#00C2A8',
      text: '#111827',
      muted: '#6B7280',
      surface: '#FFFFFF',
      surfaceAlt: '#F8FAFC',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    radius: { sm: 8, md: 12, lg: 16, pill: 9999 },
    shadows: { sm: {}, md: {}, lg: {} },
    typography: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
      h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
      bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
      caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      captionBold: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
      small: { fontSize: 12, fontWeight: '400', lineHeight: 16 }
    },
  }),
}));

// Mock the haptics utility
jest.mock('../src/utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    selection: jest.fn(),
  },
}));

describe('Navigation', () => {
  it('renders key tabs', () => {
    render(<App />);
    // ensure a couple of tabs exist
    expect(screen.getAllByText('Feed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Search').length).toBeGreaterThan(0);
  });
});


