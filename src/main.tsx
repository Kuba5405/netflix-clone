import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './LoginPage.tsx'
import LoginCode from './LoginCode.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './RegisterPage.tsx'
import HomePage from './pages/HomePage.tsx'
import SeriesPage from './pages/SeriesPage.tsx'
import MyListPage from './pages/MyListPage.tsx'
import NewPopularPage from './pages/NewPopularPage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import ProfileSelector from './ProfileSelector.tsx'
import Forgot from './ForgotPage.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import ProtectedRoute from './components/ProtectedRoute'
import MoviesPage from './pages/MoviesPage.tsx'
// NEW IMPORTS
import AddProfilePage from './pages/AddProfilePage.tsx'
import ManageProfilesPage from './pages/ManageProfilesPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Profile selector */}
            <Route path="/" element={<ProtectedRoute><ProfileSelector /></ProtectedRoute>} />
            
            {/* Profile Management */}
            <Route path="/add-profile" element={<ProtectedRoute><AddProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile/:id" element={<ProtectedRoute><AddProfilePage /></ProtectedRoute>} />
            <Route path="/manage-profiles" element={<ProtectedRoute><ManageProfilesPage /></ProtectedRoute>} />

            {/* Settings page */}
            <Route path="/browse/:profileId/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Browse pages */}
            <Route path="/browse/:profileId" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/browse/:profileId/series" element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
            <Route path="/browse/:profileId/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
            <Route path="/browse/:profileId/new-popular" element={<ProtectedRoute><NewPopularPage /></ProtectedRoute>} />
            <Route path="/browse/:profileId/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
            <Route path="/browse/:profileId/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login-code" element={<LoginCode />} />
            <Route path="/forgot" element={<Forgot />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
