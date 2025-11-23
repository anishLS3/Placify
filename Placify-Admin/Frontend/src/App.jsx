import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

// Context Providers
import { AuthProvider } from './context/AuthContext'

// Components
import LoadingSpinner from './components/common/LoadingSpinner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Experiences from './pages/Experiences'
import ExperienceDetail from './pages/ExperienceDetail'
import Contacts from './pages/Contacts'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import InitialSetup from './pages/InitialSetup'

// Services
import { authService } from './services/authService'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        // Add delay to prevent immediate rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const setupStatus = await authService.checkSetupNeeded()
        setNeedsSetup(setupStatus.needsSetup)
      } catch (error) {
        console.error('Error checking setup status:', error.message || error)
        
        // If rate limited, assume no setup needed and continue
        if (error.message && error.message.includes('Too many requests')) {
          console.log('Rate limited on setup check, assuming no setup needed')
          setNeedsSetup(false)
        } else {
          // For other errors, also assume no setup needed
          setNeedsSetup(false)
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Add a longer delay before starting setup check to avoid conflicts
    const timer = setTimeout(checkInitialSetup, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  // If initial setup is needed, show setup page
  if (needsSetup) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Routes>
          <Route path="/setup" element={<InitialSetup onSetupComplete={() => setNeedsSetup(false)} />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </Routes>
      </Box>
    )
  }

  return (
    <AuthProvider>
        <Box bg="gray.50" minH="100vh">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* Experience Management */}
              <Route path="experiences" element={<Experiences />} />
              <Route path="experiences/:id" element={<ExperienceDetail />} />
              
              {/* Contact Management */}
              <Route path="contacts" element={<Contacts />} />
              
              {/* Analytics */}
              <Route path="analytics" element={<Analytics />} />
              
              {/* Admin Profile */}
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
    </AuthProvider>
  )
}

export default App