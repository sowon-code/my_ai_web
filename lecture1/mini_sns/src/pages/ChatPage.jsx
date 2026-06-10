import { Box, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'

export default function ChatPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'text.secondary',
        gap: 2,
      }}
    >
      <ChatBubbleOutlineIcon sx={{ fontSize: 56, color: 'primary.light' }} />
      <Typography>채팅 기능은 준비 중입니다.</Typography>
    </Box>
  )
}
