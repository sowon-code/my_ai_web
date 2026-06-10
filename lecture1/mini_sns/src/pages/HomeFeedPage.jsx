import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { supabase } from '../lib/supabaseClient'
import PostCard from '../components/PostCard'

export default function HomeFeedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    const { data: postsData } = await supabase
      .from('sns_posts')
      .select('*, sns_users(nickname, profile_image_url)')
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
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  function handleCommentAdded(postId, comment) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">아직 게시물이 없어요. 첫 맛집을 공유해보세요!</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onCommentAdded={handleCommentAdded} />
      ))}
    </Box>
  )
}
