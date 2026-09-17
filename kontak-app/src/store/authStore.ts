/**
 * FILE:
 * authStore.ts
 *
 * FUNGSI:
 * File ini adalah store global Zustand untuk mengelola status autentikasi aplikasi.
 * Data user dan token disimpan di sini agar seluruh halaman React dapat membaca status login secara konsisten.
 *
 * PROSES:
 * - Membaca data user terakhir dari localStorage saat aplikasi pertama kali dimuat
 * - Menyimpan token setelah login
 * - Menyimpan data user setelah login
 * - Menambah fungsi logout untuk menghapus sesi
 *
 * HUBUNGAN:
 * Dipakai oleh LoginPage, DashboardPage, ProtectedRoute, dan komponen yang memerlukan informasi user aktif.
 */
import { create } from 'zustand'
import { User } from '@/api/auth'

/**
 * FUNCTION:
 * getStoredUser()
 *
 * TUJUAN:
 * Mengambil data user yang sebelumnya sudah disimpan di localStorage saat aplikasi direfresh.
 * Fungsi ini memastikan sesi login tidak hilang meskipun user membuka ulang browser.
 */
const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('user')
  if (!stored) return null

  try {
    return JSON.parse(stored) as User
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  isAuthenticated: () => boolean
}

/**
 * STORE:
 * useAuthStore
 *
 * FUNGSI:
 * Mengekspos state autentikasi ke seluruh aplikasi.
 *
 * STATE:
 * - user: data user aktif
 * - token: token Sanctum yang dipakai untuk request protected API
 * - isLoading: status proses login/logout
 *
 * METHOD:
 * - setUser(): menyimpan atau menghapus data user
 * - setToken(): menyimpan atau menghapus token dan localStorage
 * - logout(): membersihkan sesi user
 * - isAuthenticated(): mengecek apakah token ada atau tidak
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isLoading: false,

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated: () => {
    return !!get().token
  },
}))
