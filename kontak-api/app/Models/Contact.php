<?php

/**
 * FILE:
 * Contact.php
 *
 * FUNGSI:
 * Model ini mewakili tabel kontak di database. Data utama kontak disimpan di model ini,
 * sedangkan nomor telepon disimpan di model ContactPhone yang berelasi satu-ke-banyak.
 *
 * PROSES:
 * - Merekam data nama, alamat, dan tanggal_lahir
 * - Menyediakan hubungan ke data telepon kontak
 * - Dipakai saat API kontak membaca atau menyimpan data
 *
 * HUBUNGAN:
 * Model ini digunakan oleh ContactController dan dihubungkan ke ContactPhone melalui relasi hasMany.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;

    // Table database ini bukan memakai nama default plural seperti contacts,
    // melainkan secara eksplisit diatur ke tabel 'kontak' sesuai skema migrasi.
    protected $table = 'kontak';

    /**
     * FIELD:
     * $fillable
     *
     * FUNGSI:
     * Menentukan kolom yang boleh diisi secara mass assignment pada model Contact.
     * Kolom ini biasanya dipakai saat create/update melalui ContactController.
     */
    protected $fillable = [
        'nama',
        'alamat',
        'tanggal_lahir',
    ];

    /**
     * FUNCTION:
     * phones()
     *
     * TUJUAN:
     * Mendefinisikan relasi one-to-many antara kontak dan nomor telepon.
     *
     * ALUR:
     * 1. Satu kontak memiliki banyak data nomor telepon.
     * 2. Setiap nomor telepon terikat pada kontak tertentu melalui kontak_id.
     * 3. Ketika ContactController melakukan with('phones'), maka semua nomor telepon akan ikut diambil.
     */
    public function phones(): HasMany
    {
        return $this->hasMany(ContactPhone::class, 'kontak_id');
    }
}
