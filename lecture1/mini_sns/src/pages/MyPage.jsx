import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Avatar, Typography, Stack, IconButton, Modal, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

const BOTTOM_NAV_HEIGHT = 56

export default function MyPage() {
  const { currentUser, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()

  const fetchMyPosts = useCallback(async () => {
    setLoading(true)

    const { data: postsData } = await supabase
      .from('sns_posts')
      .select('*, sns_users(nickname, profile_image_url)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })

    const { data: commentsData } = await supabase
      .from('sns_comments')
      .select('*, sns_users(nickname)')
      .order('created_at', { ascending: true })

    const commentsByPost = {}
    ;(commentsData || []).forEach((c) => {
      ;(commentsByPost[c.post_id] ??= []).push(c)
    })

    setPosts((postsData || []).map((p) => ({ ...p, comments: commentsByPost[p.id] || [] })))
    setLoading(false)
  }, [currentUser.id])

  useEffect(() => {
    fetchMyPosts()
  }, [fetchMyPosts])

  function handleCommentAdded(postId, comment) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    )
    setSelectedPost((prev) =>
      prev && prev.id === postId ? { ...prev, comments: [...prev.comments, comment] } : prev,
    )
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          마이페이지
        </Typography>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Stack>

      <Stack alignItems="center" spacing={1} sx={{ pb: 3 }}>
        <Avatar src={currentUser.profile_image_url} sx={{ width: 88, height: 88 }} />
        <Typography variant="h6" fontWeight={700}>
          {currentUser.nickname}
        </Typography>
        <Stack direction="row" spacing={4}>
          <Stack alignItems="center">
            <Typography fontWeight={700}>{posts.length}</Typography>
            <Typography variant="caption" color="text.secondary">
              게시물
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Typography fontWeight={700}>128</Typography>
            <Typography variant="caption" color="text.secondary">
              팔로워
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Typography fontWeight={700}>96</Typography>
            <Typography variant="caption" color="text.secondary">
              팔로잉
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ p: 4 }}>
          아직 작성한 게시물이 없어요.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {posts.map((post) => (
            <Box
              key={post.id}
              onClick={() => setSelectedPost(post)}
              sx={{ aspectRatio: '1 / 1', overflow: 'hidden', cursor: 'pointer' }}
            >
              <Box component="img" src={post.image_url} alt="post" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
      )}

      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: BOTTOM_NAV_HEIGHT,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', minHeight: '100%', position: 'relative' }}>
            <IconButton
              onClick={() => setSelectedPost(null)}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'rgba(255,255,255,0.85)' }}
            >
              <CloseIcon />
            </IconButton>
            {selectedPost && <PostCard post={selectedPost} onCommentAdded={handleCommentAdded} />}
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
