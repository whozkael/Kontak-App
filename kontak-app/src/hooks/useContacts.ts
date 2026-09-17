/**
 * FILE:
 * useContacts.ts
 *
 * FUNGSI:
 * Custom hook ini menjadi lapisan penghubung antara komponen UI dan Store serta API kontak.
 * Hook ini menangani proses fetch, delete, dan state loading agar komponen tidak perlu mengurus logic API secara manual.
 *
 * PROSES:
 * - Ambil data kontak dari backend
 * - Simpan ke global store Zustand
 * - Hapus kontak melalui API dan store
 * - Menangani pesan error dan feedback user
 *
 * HUBUNGAN:
 * Digunakan oleh DashboardPage, ContactsPage, dan komponen yang butuh data kontak.
 */
import { useContactsStore } from '@/store/contactsStore'
import { contactAPI } from '@/api/contacts'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { handleApiError } from '@/utils/helpers'

export const useContacts = () => {
  const { contacts, isLoading, setContacts, setLoading, deleteContact: removeContact } = useContactsStore()

  /**
   * FUNCTION:
   * fetchContacts()
   *
   * TUJUAN:
   * Mengambil daftar kontak dari backend dan menyimpannya ke Zustand store.
   *
   * ALUR:
   * 1. Set loading menjadi true
   * 2. Panggil contactAPI.getAll()
   * 3. Simpan data ke store
   * 4. Tangani error jika request gagal
   * 5. Set loading kembali false
   */
  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await contactAPI.getAll()
      setContacts(response.data.data)
    } catch (error) {
      console.error('FETCH CONTACTS ERROR', error)
      toast.error(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }, [setContacts, setLoading])

  /**
   * FUNCTION:
   * deleteContact()
   *
   * TUJUAN:
   * Menghapus kontak dari server lalu memperbarui state lokal agar UI langsung terupdate.
   *
   * ALUR:
   * 1. Kirim request DELETE ke backend
   * 2. Jika berhasil, hapus data dari Zustand store
   * 3. Tampilkan toast sukses
   * 4. Jika gagal, tampilkan pesan error
   */
  const deleteContact = useCallback(
    async (id: number) => {
      try {
        await contactAPI.delete(id)
        removeContact(id)
        toast.success('Kontak berhasil dihapus')
        return true
      } catch (error) {
        toast.error(handleApiError(error))
        return false
      }
    },
    [removeContact]
  )

  return {
    contacts,
    isLoading,
    fetchContacts,
    deleteContact,
  }
}
