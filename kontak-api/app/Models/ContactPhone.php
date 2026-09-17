<?php

/**
 * FILE:
 * ContactPhone.php
 *
 * FUNGSI:
 * Model ini mewakili data nomor telepon yang dimiliki oleh satu kontak.
 * Setiap nomor telepon masuk ke table kontak_phones dan terhubung ke table kontak.
 *
 * PROSES:
 * - Merekam nomor telepon untuk kontak tertentu
 * - Menentukan jenis nomor seperti HP, Rumah, Kantor
 * - Menghubungkan nomor telepon dengan kontak induknya
 *
 * HUBUNGAN:
 * Model ini terhubung ke Contact melalui relasi belongsTo.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContactPhone extends Model
{
    use HasFactory;

    // Table ini memiliki nama kontak_phones, berbeda dari konvensi default plural.
    // Ini dipilih agar sesuai dengan skema database yang dibuat pada migrasi.
    protected $table = 'kontak_phones';

    /**
     * FIELD:
     * $fillable
     *
     * FUNGSI:
     * Menentukan kolom yang boleh diisi saat membuat atau memperbarui record nomor telepon.
     */
    protected $fillable = [
        'kontak_id',
        'jenis',
        'nomor_telepon',
    ];

    /**
     * FUNCTION:
     * contact()
     *
     * TUJUAN:
     * Mendefinisikan relasi inverse dari ContactPhone ke Contact.
     *
     * ALUR:
     * 1. Setiap nomor telepon memiliki satu kontak induk.
     * 2. Field kontak_id menjadi foreign key.
     * 3. Ketika ingin menampilkan informasi kontak dari nomor telepon, relasi ini bisa dipanggil.
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'kontak_id');
    }
}
