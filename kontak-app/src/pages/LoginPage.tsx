/**
 * FILE:
 * LoginPage.tsx
 *
 * FUNGSI:
 * Halaman ini bertanggung jawab untuk menampilkan form login dan menghubungkannya dengan backend.
 * Ini adalah pintu masuk utama ke aplikasi setelah user membuka project dan ingin masuk ke dashboard.
 *
 * PROSES:
 * - Menangkap input email dan password
 * - Mengirim request login ke backend
 * - Menerima token dan data user
 * - Menyimpan token ke localStorage dan store global
 * - Redirect ke halaman dashboard
 *
 * HUBUNGAN:
 * Digunakan bersama dengan authAPI, useAuthStore, dan route system React Router.
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/layouts/MainLayout'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { authAPI } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/utils/helpers'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * FUNCTION:
   * handleChange()
   *
   * TUJUAN:
   * Menangani perubahan input form login.
   *
   * ALUR:
   * 1. Ambil nama field dan value dari input
   * 2. Update state formData
   * 3. Jika sebelumnya ada error pada field tersebut, hapus pesan error
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * FUNCTION:
   * handleSubmit()
   *
   * TUJUAN:
   * Mengirim data login ke backend dan mengelola response sukses atau error.
   *
   * ALUR:
   * 1. Mencegah submit form default
   * 2. Reset error sebelumnya
   * 3. Panggil authAPI.login(formData)
   * 4. Ambil user dan token dari response
   * 5. Simpan ke Zustand store dan localStorage
   * 6. Tampilkan toast sukses
   * 7. Redirect ke /dashboard
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const response = await authAPI.login(formData)
      console.log('LOGIN SUCCESS', response.data)
      const { user, token } = response.data.data

      // Menyimpan user ke Zustand agar state global dapat diakses oleh komponen lain.
      setUser(user)
      // Menyimpan token agar semua request berikutnya otomatis membawa bearer token.
      setToken(token)
      console.log('TOKEN STORAGE', localStorage.getItem('token'))
      toast.success('Login berhasil!')
      navigate('/dashboard', { replace: true })
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
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="text-white text-center relative z-10">
            <div className="text-5xl mb-4">👥</div>
            <h1 className="text-4xl font-bold mb-4">KontakApp</h1>
            <p className="text-lg text-blue-100 mb-8">
              Kelola kontak Anda dengan mudah dan profesional
            </p>
            <div className="space-y-3 text-left max-w-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <span>Interface modern dan intuitif</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <span>Keamanan tingkat enterprise</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span>Performa super cepat</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Masuk</h1>
          <p className="text-slate-600">
            Selamat datang kembali di KontakApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-7 w-5 h-5 text-slate-400 pointer-events-none" />
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="nama@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
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
                error={errors.password?.[0]}
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

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-600">
              Belum punya akun?
            </span>
          </div>
        </div>

        <Link
          to="/register"
          className="block w-full py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
        >
          Daftar sekarang
        </Link>

        <div className="text-center text-xs text-slate-500">
          Demo: john@example.com / password123
        </div>
      </div>
    </AuthLayout>
  )
}
