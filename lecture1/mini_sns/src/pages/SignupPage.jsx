import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, IconButton, Alert, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signup(username, password, nickname)
    setLoading(false)

    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', p: 3, bgcolor: 'background.default' }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>
          회원가입
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="아이디" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required />
        <TextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <TextField label="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} fullWidth required />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, borderRadius: 3, mt: 1 }}>
          회원가입
        </Button>
      </Box>
    </Box>
  )
}
