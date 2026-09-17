import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { AppLayout } from '@/layouts/MainLayout'
import { ContactCard } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/EmptyState'
import { Modal } from '@/components/Modal'
import { useContacts } from '@/hooks/useContacts'
import { Contact } from '@/api/contacts'

export const ContactsPage: React.FC = () => {
  const navigate = useNavigate()
  const { contacts, isLoading, fetchContacts, deleteContact } = useContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const filteredContacts = contacts.filter((contact) =>
    contact.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedContact) return

    setIsDeleting(true)
    const success = await deleteContact(selectedContact.id)
    setIsDeleting(false)

    if (success) {
      setDeleteModalOpen(false)
      setSelectedContact(null)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kelola Kontak</h1>
            <p className="text-slate-600 mt-1">
              Kelola semua kontak Anda di satu tempat
            </p>
          </div>
          <Button
            onClick={() => navigate('/contacts/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Kontak Baru
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari kontak berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                nama={contact.nama}
                  alamat={contact.alamat || undefined}
                  tanggal_lahir={contact.tanggal_lahir || undefined}
                phones={contact.phones}
                onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
                onDelete={() => handleDeleteClick(contact)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              searchTerm ? 'Kontak tidak ditemukan' : 'Belum ada kontak'
            }
            description={
              searchTerm
                ? 'Coba ubah pencarian Anda'
                : 'Mulai tambahkan kontak Anda yang pertama untuk memulai'
            }
            action={
              !searchTerm ? (
                <Button onClick={() => navigate('/contacts/new')}>
                  <Plus className="w-4 h-4" />
                  Tambah Kontak Pertama
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Hapus Kontak"
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedContact(null)
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
        isDangerous
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Apakah Anda yakin ingin menghapus kontak{' '}
            <strong>{selectedContact?.nama}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Semua nomor telepon yang terkait juga akan dihapus.
            </p>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
