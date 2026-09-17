import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const { user, token, setUser, setToken, logout, isAuthenticated } =
    useAuthStore()

  return {
    user,
    token,
    setUser,
    setToken,
    logout,
    isAuthenticated: isAuthenticated(),
  }
}

export const useRequireAuth = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  return { isAuthenticated }
}

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth()
  console.log('AUTH CHECK', token)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
