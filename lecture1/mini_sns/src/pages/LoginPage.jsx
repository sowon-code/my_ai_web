import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Avatar, Alert } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(username, password)
    setLoading(false)

    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        bgcolor: 'background.default',
      }}
    >
      <Avatar sx={{ width: 88, height: 88, bgcolor: 'primary.main', mb: 2 }}>
        <RestaurantIcon sx={{ fontSize: 48 }} />
      </Avatar>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 4 }}>
        맛집공유
      </Typography>

      <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, borderRadius: 3 }}>
          로그인
        </Button>
        <Button variant="outlined" size="large" onClick={() => navigate('/signup')} sx={{ py: 1.5, borderRadius: 3 }}>
          회원가입
        </Button>
      </Box>
    </Box>
  )
}
