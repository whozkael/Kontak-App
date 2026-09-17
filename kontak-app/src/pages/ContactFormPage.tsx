import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '@/layouts/MainLayout'
import { Input } from '@/components/Input'
import { TextArea } from '@/components/TextArea'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { contactAPI, CreateContactData } from '@/api/contacts'
import { useContactsStore } from '@/store/contactsStore'
import { handleApiError } from '@/utils/helpers'

interface PhoneField {
  id?: number
  jenis: string
  nomor_telepon: string
}

const PHONE_TYPES = [
  { value: 'HP', label: 'Handphone' },
  { value: 'Rumah', label: 'Rumah' },
  { value: 'Kantor', label: 'Kantor' },
  { value: 'Fax', label: 'Fax' },
  { value: 'Lainnya', label: 'Lainnya' },
]

export const ContactFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { contacts, addContact, updateContact } = useContactsStore()

  const isEdit = !!id
  const contact = id ? contacts.find((c) => c.id === Number(id)) : null

  const [isLoading, setIsLoading] = useState(isEdit ? !contact : false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nama: contact?.nama || '',
    alamat: contact?.alamat || '',
    tanggal_lahir: contact?.tanggal_lahir || '',
  })
  const [phones, setPhones] = useState<PhoneField[]>(
    contact?.phones || [{ jenis: 'HP', nomor_telepon: '' }]
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit && !contact) {
      const loadContact = async () => {
        try {
          const response = await contactAPI.getById(Number(id))
          const contactData = response.data.data
          setFormData({
            nama: contactData.nama,
            alamat: contactData.alamat || '',
            tanggal_lahir: contactData.tanggal_lahir || '',
          })
          setPhones(contactData.phones)
        } catch (error) {
          toast.error(handleApiError(error))
          navigate('/contacts')
        } finally {
          setIsLoading(false)
        }
      }
      loadContact()
    }
  }, [isEdit, id, contact, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhoneChange = (
    index: number,
    field: 'jenis' | 'nomor_telepon',
    value: string
  ) => {
    const newPhones = [...phones]
    newPhones[index][field] = value
    setPhones(newPhones)
  }

  const addPhoneField = () => {
    setPhones([...phones, { jenis: 'HP', nomor_telepon: '' }])
  }

  const removePhoneField = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index))
    } else {
      toast.error('Minimal harus ada satu nomor telepon')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi'
    }

    if (phones.length === 0) {
      newErrors.phones = 'Minimal harus ada satu nomor telepon'
    } else {
      phones.forEach((phone, idx) => {
        if (!phone.jenis.trim()) {
          newErrors[`phone_${idx}_jenis`] = 'Jenis harus dipilih'
        }
        if (!phone.nomor_telepon.trim()) {
          newErrors[`phone_${idx}_nomor`] = 'Nomor telepon harus diisi'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSaving(true)

    try {
      const submitData: CreateContactData = {
        nama: formData.nama,
        alamat: formData.alamat || undefined,
        tanggal_lahir: formData.tanggal_lahir || undefined,
        phones: phones.map((p) => ({
          jenis: p.jenis,
          nomor_telepon: p.nomor_telepon,
        })),
      }

      if (isEdit && id) {
        const response = await contactAPI.update(Number(id), submitData)
        updateContact(response.data.data)
        toast.success('Kontak berhasil diperbarui')
      } else {
        const response = await contactAPI.create(submitData)
        addContact(response.data.data)
        toast.success('Kontak berhasil ditambahkan')
      }

      navigate('/contacts')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        toast.error(handleApiError(error))
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/contacts')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEdit ? 'Edit Kontak' : 'Tambah Kontak Baru'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEdit
                ? 'Perbarui informasi kontak Anda'
                : 'Tambahkan kontak baru beserta nomor teleponnya'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Informasi Pribadi</h2>

            <Input
              label="Nama"
              name="nama"
              placeholder="Contoh: Budi Santoso"
              value={formData.nama}
              onChange={handleInputChange}
              error={errors.nama}
              required
            />

            <TextArea
              label="Alamat"
              name="alamat"
              placeholder="Contoh: Denpasar, Bali"
              value={formData.alamat}
              onChange={handleInputChange}
              rows={3}
            />

            <Input
              label="Tanggal Lahir"
              name="tanggal_lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone Numbers */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Nomor Telepon</h2>
              {errors.phones && (
                <p className="text-sm text-red-600">{errors.phones}</p>
              )}
            </div>

            <div className="space-y-3">
              {phones.map((phone, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Select
                      options={PHONE_TYPES}
                      value={phone.jenis}
                      onChange={(e) =>
                        handlePhoneChange(index, 'jenis', e.target.value)
                      }
                      error={errors[`phone_${index}_jenis`]}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder="Nomor telepon"
                      value={phone.nomor_telepon}
                      onChange={(e) =>
                        handlePhoneChange(
                          index,
                          'nomor_telepon',
                          e.target.value
                        )
                      }
                      error={errors[`phone_${index}_nomor`]}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removePhoneField(index)}
                    className="px-3"
                    disabled={phones.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={addPhoneField}
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Tambah Nomor Telepon
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/contacts')}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
            >
              {isSaving
                ? 'Menyimpan...'
                : isEdit
                ? 'Perbarui Kontak'
                : 'Tambah Kontak'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
