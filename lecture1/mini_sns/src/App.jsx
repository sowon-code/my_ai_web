import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomeFeedPage from './pages/HomeFeedPage'
import PostCreatePage from './pages/PostCreatePage'
import MeetupPage from './pages/MeetupPage'
import ChatPage from './pages/ChatPage'
import MyPage from './pages/MyPage'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomeFeedPage />} />
            <Route path="/create" element={<PostCreatePage />} />
            <Route path="/meetup" element={<MeetupPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/me" element={<MyPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
