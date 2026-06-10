import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, IconButton, Stack, CircularProgress, Snackbar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RefreshIcon from '@mui/icons-material/Refresh'
import { supabase } from '../lib/supabaseClient'
import { getRandomFoodImage } from '../lib/randomImages'
import { useAuth } from '../context/AuthContext'

export default function PostCreatePage() {
  const [caption, setCaption] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState('')
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const reroll = useCallback(async () => {
    setImageLoading(true)
    const url = await getRandomFoodImage()
    setImageUrl(url)
    setImageLoading(false)
  }, [])

  useEffect(() => {
    reroll()
  }, [reroll])

  async function handleSubmit() {
    if (!caption.trim()) {
      setSnackbar('게시물 내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    const hashtags = hashtagInput
      .split(/[\s,#]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)

    const { error } = await supabase.from('sns_posts').insert({
      user_id: currentUser.id,
      caption: caption.trim(),
      image_url: imageUrl,
      hashtags,
      location: location.trim() || null,
      likes_count: 0,
    })
    setSubmitting(false)

    if (error) {
      setSnackbar('게시물 등록에 실패했습니다.')
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>
          게시물 작성
        </Typography>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageLoading ? (
          <CircularProgress color="primary" />
        ) : (
          <Box component="img" src={imageUrl} alt="random food" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <Button
          variant="contained"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={reroll}
          disabled={imageLoading}
          sx={{ position: 'absolute', bottom: 12, right: 12 }}
        >
          다른 이미지
        </Button>
      </Box>

      <TextField label="게시물 내용" value={caption} onChange={(e) => setCaption(e.target.value)} multiline minRows={3} fullWidth />
      <TextField
        label="해시태그 (예: 맛집 강남 데이트)"
        value={hashtagInput}
        onChange={(e) => setHashtagInput(e.target.value)}
        fullWidth
      />
      <TextField label="위치" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />

      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={submitting || imageLoading}
        sx={{ py: 1.5, borderRadius: 3 }}
      >
        게시물 등록
      </Button>

      <Snackbar open={!!snackbar} autoHideDuration={2500} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  )
}
