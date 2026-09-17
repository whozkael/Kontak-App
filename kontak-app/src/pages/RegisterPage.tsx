import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/layouts/MainLayout'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { authAPI } from '@/api/auth'
import { handleApiError } from '@/utils/helpers'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Password tidak cocok'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      toast.success('Registrasi berhasil! Silakan login')
      navigate('/login')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        toast.error(handleApiError(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      side={
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="text-white text-center relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold mb-4">Bergabung Sekarang</h1>
            <p className="text-lg text-emerald-100 mb-8">
              Mulai kelola kontak Anda dengan cara yang lebih baik
            </p>
            <div className="space-y-3 text-left max-w-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <span>Daftar dalam hitungan detik</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <span>Data Anda aman dan terlindungi</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💯</span>
                <span>Akses penuh dan gratis</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Daftar</h1>
          <p className="text-slate-600">
            Buat akun baru untuk memulai
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-7 w-5 h-5 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              name="name"
              label="Nama Lengkap"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-7 w-5 h-5 text-slate-400 pointer-events-none" />
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="nama@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-7 w-5 h-5 text-slate-400 pointer-events-none" />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-7 w-5 h-5 text-slate-400 pointer-events-none" />
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirmation"
                label="Konfirmasi Password"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-600">
              Sudah punya akun?
            </span>
          </div>
        </div>

        <Link
          to="/login"
          className="block w-full py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
        >
          Masuk sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
