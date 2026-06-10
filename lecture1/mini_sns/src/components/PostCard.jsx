import { useState } from 'react'
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, IconButton, Box, Chip, Stack } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { getLikedPostIds, setLikedPostIds } from '../lib/likes'
import CommentModal from './CommentModal'

function formatTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${Math.floor(diffHour / 24)}일 전`
}

export default function PostCard({ post, onCommentAdded }) {
  const { currentUser } = useAuth()
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [liked, setLiked] = useState(() =>
    currentUser ? getLikedPostIds(currentUser.username).has(post.id) : false,
  )
  const [commentOpen, setCommentOpen] = useState(false)

  const author = post.sns_users
  const comments = post.comments || []
  const recentComments = comments.slice(-2)

  async function toggleLike() {
    if (!currentUser) return
    const nextLiked = !liked
    const nextCount = likesCount + (nextLiked ? 1 : -1)

    setLiked(nextLiked)
    setLikesCount(nextCount)

    const likedIds = getLikedPostIds(currentUser.username)
    if (nextLiked) likedIds.add(post.id)
    else likedIds.delete(post.id)
    setLikedPostIds(currentUser.username, likedIds)

    await supabase.from('sns_posts').update({ likes_count: nextCount }).eq('id', post.id)
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 0, borderBottom: '8px solid', borderColor: 'background.default' }}>
      <CardHeader
        avatar={<Avatar src={author?.profile_image_url} alt={author?.nickname} />}
        title={
          <Typography fontWeight={700} fontSize={14}>
            {author?.nickname}
          </Typography>
        }
        subheader={
          post.location ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {post.location}
              </Typography>
            </Stack>
          ) : null
        }
      />

      <Box sx={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', bgcolor: 'secondary.main' }}>
        <Box
          component="img"
          src={post.image_url}
          alt="post"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <CardContent sx={{ pb: 1 }}>
        {post.caption && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
            {post.caption}
          </Typography>
        )}
        {post.hashtags?.length > 0 && (
          <Stack direction="row" flexWrap="wrap" sx={{ mb: 1, gap: 0.5 }}>
            {post.hashtags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{ bgcolor: 'secondary.main', color: 'primary.dark' }}
              />
            ))}
          </Stack>
        )}
        <Typography variant="caption" color="text.secondary">
          {formatTime(post.created_at)}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pt: 0 }}>
        <IconButton onClick={toggleLike} size="small" sx={{ color: liked ? '#E63946' : 'text.primary' }}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount}
        </Typography>
        <IconButton onClick={() => setCommentOpen(true)} size="small">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">{comments.length}</Typography>
      </CardActions>

      {recentComments.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          {recentComments.map((c) => (
            <Typography key={c.id} variant="body2" sx={{ mb: 0.5 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {c.sns_users?.nickname}
              </Box>{' '}
              {c.content}
            </Typography>
          ))}
        </Box>
      )}

      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        post={post}
        comments={comments}
        onCommentAdded={onCommentAdded}
      />
    </Card>
  )
}
