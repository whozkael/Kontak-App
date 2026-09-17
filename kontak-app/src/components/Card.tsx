import React, { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface CardProps {
  className?: string
  children: ReactNode
  hoverable?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card p-6',
        hoverable &&
          'cursor-pointer hover:shadow-md hover:border-slate-300 transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => {
  return (
    <Card className="col-span-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
      </div>
    </Card>
  )
}

interface ContactCardProps {
  nama: string
  alamat?: string
  tanggal_lahir?: string
  phones: Array<{ jenis: string; nomor_telepon: string }>
  onEdit?: () => void
  onDelete?: () => void
}

export const ContactCard: React.FC<ContactCardProps> = ({
  nama,
  alamat,
  tanggal_lahir,
  phones,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="col-span-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-900">{nama}</h3>
          {alamat && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{alamat}</p>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {tanggal_lahir && (
        <p className="text-xs text-slate-500 mb-3">
          Lahir: {new Date(tanggal_lahir).toLocaleDateString('id-ID')}
        </p>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase">
          Nomor Telepon
        </p>
        {phones.length > 0 ? (
          phones.map((phone, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded"
            >
              <span className="text-slate-600">{phone.jenis}</span>
              <span className="font-medium text-slate-900">
                {phone.nomor_telepon}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic">Tidak ada nomor telepon</p>
        )}
      </div>
    </Card>
  )
}
