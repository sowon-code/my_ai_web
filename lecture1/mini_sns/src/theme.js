import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7A30',
      light: '#FFB37A',
      dark: '#E2611A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFE3CC',
      contrastText: '#7A3E1D',
    },
    background: {
      default: '#FFF8F2',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3A2E28',
      secondary: '#9C8B82',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
