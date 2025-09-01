export const theme = {
  colors: {
    primary: '#335CFF',        // Sapphire
    accent: '#00C2A8',         // Teal
    text: '#111827',
    muted: '#6B7280',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    dark: {
      surface: '#0B1220',
      surfaceAlt: '#0F172A',
      text: '#E5E7EB',
      muted: '#9CA3AF',
      primary: '#93A4FF',
      accent: '#7CE7DB',
      danger: '#EF4444'
    }
  },
  spacing: { 
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32,
    xxl: 48 
  },
  radius: { 
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24,
    pill: 9999 
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 5,
    }
  },
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
  overlayGradient: 'toBottom, rgba(0,0,0,0) → rgba(0,0,0,0.55) ~200px'
} as const;

export type Theme = typeof theme;
export type ColorScheme = 'light' | 'dark';
