import { useState } from 'react'
import { Drawer, Box, Typography, Avatar, TextField, Button, IconButton, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function CommentModal({ open, onClose, post, comments, onCommentAdded }) {
  const { currentUser } = useAuth()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const content = text.trim()
    if (!content || !currentUser) return

    setSubmitting(true)
    const { data, error } = await supabase
      .from('sns_comments')
      .insert({ post_id: post.id, user_id: currentUser.id, content })
      .select('*, sns_users(nickname)')
      .single()
    setSubmitting(false)

    if (!error && data) {
      onCommentAdded(post.id, data)
      setText('')
    }
  }

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          width: '100%',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, borderBottom: '1px solid', borderColor: 'secondary.main' }}
        >
          <Typography fontWeight={700}>댓글 {comments.length}개</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {comments.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </Typography>
          ) : (
            comments.map((c) => (
              <Stack key={c.id} direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: 14 }}>
                  {c.sns_users?.nickname?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {c.sns_users?.nickname}
                  </Typography>
                  <Typography variant="body2">{c.content}</Typography>
                </Box>
              </Stack>
            ))
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ p: 2, borderTop: '1px solid', borderColor: 'secondary.main' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="댓글을 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={submitting || !text.trim()}>
            등록
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}
