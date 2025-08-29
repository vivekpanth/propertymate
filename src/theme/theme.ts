export const theme = {
  colors: {
    primary: '#335CFF',
    accent: '#00C2A8',
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
    },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, pill: 9999 },
  overlayGradient: 'toBottom, rgba(0,0,0,0) → rgba(0,0,0,0.55) ~200px',
} as const;
