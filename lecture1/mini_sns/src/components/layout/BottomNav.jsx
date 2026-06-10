import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';

const ROUTES = ['/', '/meetup', '/create', '/chat', '/me'];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = ROUTES.includes(pathname) ? ROUTES.indexOf(pathname) : 0;

  return (
    <Paper elevation={3} sx={{ borderRadius: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => navigate(ROUTES[newValue])}
        sx={{ bgcolor: 'background.paper' }}
      >
        <BottomNavigationAction label="홈" icon={<HomeIcon />} />
        <BottomNavigationAction label="모임" icon={<GroupsIcon />} />
        <BottomNavigationAction
          label="작성"
          icon={<AddCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
        />
        <BottomNavigationAction label="채팅" icon={<ChatBubbleOutlineIcon />} />
        <BottomNavigationAction label="마이" icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
