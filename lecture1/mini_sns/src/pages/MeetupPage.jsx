import { useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Stack, Chip, Snackbar } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'

// 친구 모임 공유 페이지: 기획서에 따라 목업(mock) 데이터로만 구성
const MOCK_MEETUPS = [
  { id: 1, title: '강남역 떡볶이 같이 드실 분', time: '오늘 저녁 7:00', location: '강남역 11번 출구 (0.5km)', current: 2, max: 4 },
  { id: 2, title: '홍대 맛집 탐방 모임', time: '내일 오후 1:00', location: '홍대입구역 (1.2km)', current: 3, max: 6 },
  { id: 3, title: '연남동 브런치 같이 드실 분', time: '토요일 오전 11:00', location: '연남동 (2.0km)', current: 1, max: 3 },
  { id: 4, title: '성수동 디저트 카페 투어', time: '일요일 오후 3:00', location: '성수동 (3.4km)', current: 4, max: 5 },
]

export default function MeetupPage() {
  const [snackbar, setSnackbar] = useState('')

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        내 주변 친구 모임
      </Typography>

      <Stack spacing={2}>
        {MOCK_MEETUPS.map((meetup) => (
          <Card key={meetup.id} elevation={0} sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                {meetup.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {meetup.time}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {meetup.location}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Chip
                  icon={<GroupsIcon sx={{ fontSize: 16 }} />}
                  label={`모집 ${meetup.current}/${meetup.max}명`}
                  size="small"
                  sx={{ bgcolor: 'secondary.main', color: 'primary.dark' }}
                />
                <Button variant="contained" size="small" onClick={() => setSnackbar('채팅 기능은 준비 중입니다.')}>
                  참가하기
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Snackbar open={!!snackbar} autoHideDuration={2000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  )
}
