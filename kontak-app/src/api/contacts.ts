/**
 * FILE:
 * contacts.ts
 *
 * FUNGSI:
 * File ini berisi wrapper API untuk operasi CRUD kontak terhadap backend Laravel.
 * Semua fungsi di sini terhubung langsung ke route yang ada di kontak-api/routes/api.php.
 *
 * PROSES:
 * - Membaca semua kontak
 * - Membuat kontak baru
 * - Melihat detail kontak
 * - Mengubah kontak
 * - Menghapus kontak
 *
 * HUBUNGAN:
 * Dipakai oleh hooks, pages, dan store frontend untuk mengambil data kontakt dari server.
 */
import apiClient from './axios'

export interface Phone {
  id: number
  kontak_id: number
  jenis: string
  nomor_telepon: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  nama: string
  alamat: string | null
  tanggal_lahir: string | null
  created_at: string
  updated_at: string
  phones: Phone[]
}

export interface CreateContactData {
  nama: string
  alamat?: string
  tanggal_lahir?: string
  phones: Array<{
    jenis: string
    nomor_telepon: string
  }>
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/**
 * OBJEK:
 * contactAPI
 *
 * FUNGSI:
 * Menyediakan operasi CRUD menuju endpoint kontak Laravel.
 *
 * getAll():
 * Mengirim GET /api/kontak untuk membaca seluruh data kontak.
 *
 * getById():
 * Mengirim GET /api/kontak/{id} untuk detail satu kontak.
 *
 * create():
 * Mengirim POST /api/kontak untuk membuat kontak baru.
 *
 * update():
 * Mengirim PUT /api/kontak/{id} untuk memperbarui kontak.
 *
 * delete():
 * Mengirim DELETE /api/kontak/{id} untuk menghapus kontak.
 */
export const contactAPI = {
  getAll: () =>
    apiClient.get<ApiResponse<Contact[]>>('/kontak'),
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<Contact>>(`/kontak/${id}`),
  
  create: (data: CreateContactData) =>
    apiClient.post<ApiResponse<Contact>>('/kontak', data),
  
  update: (id: number, data: CreateContactData) =>
    apiClient.put<ApiResponse<Contact>>(`/kontak/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/kontak/${id}`),
}
