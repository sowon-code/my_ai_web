import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <TopBar />
      <Box component="main" sx={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
}
