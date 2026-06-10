import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function TopBar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'secondary.main',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestaurantIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={800} color="primary.main">
            맛집공유
          </Typography>
        </Box>
        <IconButton size="small">
          <NotificationsNoneIcon sx={{ color: 'text.primary' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
