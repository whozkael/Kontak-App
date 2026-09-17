import React from 'react'
import { LogOut, Home, Users } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/api/auth'
import toast from 'react-hot-toast'

export const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      toast.success('Berhasil logout')
      navigate('/login')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-blue-600">
            KontakApp
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/contacts"
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isActive('/contacts')
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Kontak
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

interface AuthLayoutProps {
  children: React.ReactNode
  side?: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, side }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand */}
      {side ? (
        side
      ) : (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-8">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4">KontakApp</h1>
            <p className="text-xl text-blue-100">
              Kelola kontak Anda dengan mudah dan profesional
            </p>
          </div>
        </div>
      )}

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
