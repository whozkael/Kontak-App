/**
 * FILE:
 * auth.ts
 *
 * FUNGSI:
 * File ini berisi wrapper function untuk mengakses endpoint autentikasi backend.
 * Semua request login, register, logout, dan getCurrentUser dipusatkan di sini agar
 * halaman React tidak perlu menulis URL dan method secara berulang.
 *
 * PROSES:
 * - Mengirim data register ke endpoint /api/register
 * - Mengirim email/password ke endpoint /api/login
 * - Mengirim request logout ke /api/logout
 * - Mengambil data user yang sedang login dari /api/user
 *
 * HUBUNGAN:
 * Menggunakan apiClient dari src/api/axios.ts, kemudian dipakai oleh LoginPage dan authStore.
 */
import apiClient from './axios'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      created_at: string
      updated_at: string
    }
    token: string
  }
}

export interface User {
  id: number
  name: string
  email: string
}

/**
 * OBJEK:
 * authAPI
 *
 * FUNGSI:
 * Menyediakan fungsi-fungsi untuk komunikasi dengan endpoint autentikasi Laravel.
 *
 * register():
 * Mengirim data registrasi user baru ke backend.
 *
 * login():
 * Mengirim email dan password untuk menerima token Sanctum serta data user.
 *
 * logout():
 * Mengirim request logout agar token aktif dihapus dari server.
 *
 * getCurrentUser():
 * Mengambil data user yang sedang login dari endpoint /api/user.
 */
export const authAPI = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/register', data),
  
  login: (data: LoginData) =>
    apiClient.post<AuthResponse>('/login', data),
  
  logout: () =>
    apiClient.post('/logout'),
  
  getCurrentUser: () =>
    apiClient.get<{ data: User }>('/user'),
}
