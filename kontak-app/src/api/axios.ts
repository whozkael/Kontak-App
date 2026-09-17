/**
 * FILE:
 * axios.ts
 *
 * FUNGSI:
 * File ini membuat instance Axios yang menjadi penghubung utama antara frontend React dan backend Laravel.
 * Semua request API dari aplikasi melalui file ini, sehingga login, kontak, dan protected route menjadi terpusat.
 *
 * PROSES:
 * - Menetapkan base URL backend
 * - Menambahkan header Content-Type dan Accept
 * - Menyisipkan token dari localStorage pada setiap request
 * - Menangani response error khusus 401 untuk logout otomatis
 *
 * HUBUNGAN:
 * Digunakan oleh:
 * - src/api/auth.ts
 * - src/api/contacts.ts
 * - seluruh halaman yang melakukan request ke backend
 */
import axios from 'axios'

// Base URL API Laravel. Nilai ini menunjuk ke endpoint backend yang berjalan di port 8000.
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Instance axios ini dibuat agar semua request punya konfigurasi umum yang sama.
// Dengan begitu frontend tidak perlu menulis baseURL dan header berulang-ulang di setiap file.
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * INTERCEPTOR:
 * request.use()
 *
 * FUNGSI:
 * Sebelum request dikirim, interceptor ini mengecek apakah token sudah tersimpan di localStorage.
 * Jika ada, maka header Authorization akan diisi dengan format Bearer <token>.
 *
 * ALUR:
 * 1. Ambil token dari localStorage
 * 2. Jika token ada, tambahkan header Authorization
 * 3. Lanjutkan request ke backend
 *
 * MANFAAT:
 * Dengan interceptor ini, seluruh request yang butuh autentikasi tidak perlu menulis header manual.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * INTERCEPTOR:
 * response.use()
 *
 * FUNGSI:
 * Menangani error response yang datang dari backend.
 * Jika status 401 menunjukkan token tidak valid atau sesi berakhir, maka frontend otomatis
 * membersihkan state dan me-redirect ke halaman login.
 *
 * ALUR:
 * 1. Ambil status dari response error
 * 2. Jika 401, hapus token dan user dari localStorage
 * 3. Redirect ke halaman /login
 * 4. Lempar error agar komponen yang memanggil API bisa menangani error lebih lanjut
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
