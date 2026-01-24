import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './LoginPage.tsx'
import LoginCode from './LoginCode.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './RegisterPage.tsx'
import Notflix from './Notflix.tsx'
import ProfileSelector from './ProfileSelector.tsx'
import Forgot from './ForgotPage.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import ProtectedRoute from './components/ProtectedRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <ProfileSelector />
              </ProtectedRoute>
            } />
            <Route path="/browse/:profileId" element={
              <ProtectedRoute>
                <Notflix />
              </ProtectedRoute>
            } />

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/code" element={<LoginCode />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<Forgot />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
