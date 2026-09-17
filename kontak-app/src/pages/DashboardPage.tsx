/**
 * FILE:
 * DashboardPage.tsx
 *
 * FUNGSI:
 * Halaman ini menampilkan ringkasan aktivitas utama aplikasi setelah user login.
 * Dashboard berfungsi sebagai halaman awal yang menggambarkan jumlah kontak dan data terbaru.
 *
 * PROSES:
 * - Memanggil API untuk mengambil seluruh kontak
 * - Menghitung statistik jumlah kontak dan nomor telepon
 * - Menampilkan 3 kontak terbaru
 * - Menyediakan tombol untuk menuju halaman tambah kontak atau semua kontak
 *
 * HUBUNGAN:
 * Dipakai bersama dengan useContacts hook dan layout AppLayout.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Phone, Plus, Clock } from 'lucide-react'
import { AppLayout } from '@/layouts/MainLayout'
import { StatCard, ContactCard } from '@/components/Card'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/EmptyState'
import { useContacts } from '@/hooks/useContacts'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { contacts, isLoading, fetchContacts } = useContacts()

  /**
   * useEffect:
   *
   * TUJUAN:
   * Saat halaman dashboard pertama kali dibuka, otomatis memanggil fetchContacts()
   * agar data kontak terkini tersedia di UI.
   */
  useEffect(() => {
    console.log('USER AUTH', localStorage.getItem('user'))
    fetchContacts()
  }, [fetchContacts])

  // recentContacts hanya menampilkan 3 kontak paling akhir/terbaru.
  const recentContacts = contacts.slice(0, 3)

  // totalPhones menjumlahkan seluruh nomor telepon dari semua kontak.
  const totalPhones = contacts.reduce((sum, c) => sum + c.phones.length, 0)

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Selamat datang kembali! Berikut ringkasan kontak Anda
            </p>
          </div>
          <Button
            onClick={() => navigate('/contacts/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Kontak
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Total Kontak"
            value={contacts.length}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Nomor Telepon"
            value={totalPhones}
            icon={<Phone className="w-6 h-6" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Recent Contacts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Kontak Terbaru
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                3 kontak yang paling baru ditambahkan
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/contacts')}
            >
              Lihat Semua
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : recentContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  nama={contact.nama}
                  alamat={contact.alamat || undefined}
                  tanggal_lahir={contact.tanggal_lahir || undefined}
                  phones={contact.phones}
                  onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="w-12 h-12 text-slate-400" />}
              title="Belum ada kontak"
              description="Mulai tambahkan kontak Anda yang pertama untuk memulai"
              action={
                <Button onClick={() => navigate('/contacts/new')}>
                  <Plus className="w-4 h-4" />
                  Tambah Kontak Pertama
                </Button>
              }
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
