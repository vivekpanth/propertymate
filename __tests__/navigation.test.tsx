import { render, screen } from '@testing-library/react-native';

// Mock expo-video BEFORE importing App
jest.mock('expo-video', () => {
  const MockVideoView = () => null as unknown as JSX.Element;
  return {
    VideoView: MockVideoView,
    useVideoPlayer: () => ({
      loop: true,
      muted: true,
      play: jest.fn(),
      pause: jest.fn(),
      addEventListener: () => ({ remove: jest.fn() }),
    }),
  };
});

// Mock ThemeProvider BEFORE importing App
jest.mock('../src/theme/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: unknown }) => children,
  useTheme: () => ({
    colors: {
      primary: '#335CFF',
      accent: '#00C2A8',
      text: '#111827',
      muted: '#6B7280',
      surface: '#FFFFFF',
      surfaceAlt: '#F8FAFC',
      danger: '#EF4444',
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
      small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    },
  }),
}));

// Mock haptics
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

// Mock Supabase to avoid initializing real client in tests
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

import App from '../App';

describe('Navigation', () => {
  it('renders key tabs', () => {
    render(<App />);
    expect(screen.getAllByText('Feed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Search').length).toBeGreaterThan(0);
  });
});