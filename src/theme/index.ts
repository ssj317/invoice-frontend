export const theme = {
  colors: {
    primary: {
      main: '#178C92', // Teal
      light: '#1aa3aa',
      dark: '#0f6368',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F8F4E1', // Cream
      light: '#fffef7',
      dark: '#e8e2c8',
      contrastText: '#178C92',
    },
    background: {
      default: '#F8F4E1',
      paper: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d4f0f2',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  spacing: (multiplier: number = 1) => `${8 * multiplier}px`,
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 10px 20px rgba(0,0,0,0.1)',
  ],
} as const;

export type Theme = typeof theme;
