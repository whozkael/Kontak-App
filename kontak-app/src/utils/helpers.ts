export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const handleApiError = (error: any): string => {
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors
    const firstError = Object.values(errors)[0]
    return Array.isArray(firstError) ? firstError[0] : String(firstError)
  }
  return error.response?.data?.message || 'Terjadi kesalahan'
}
