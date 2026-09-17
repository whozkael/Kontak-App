<?php

/**
 * FILE:
 * User.php
 *
 * FUNGSI:
 * Model ini merepresentasikan tabel users dan menjadi pusat autentikasi user di Laravel.
 * Karena aplikasi menggunakan Laravel Sanctum, model User juga harus mendukung token API.
 *
 * PROSES:
 * - Menyimpan data user baru
 * - Menangani login dan autentikasi
 * - Menghasilkan token API ketika user login
 * - Menyembunyikan password agar tidak ikut tampil di response API
 *
 * HUBUNGAN:
 * Model ini digunakan oleh:
 * - AuthController
 * - routes/api.php
 * - Laravel Sanctum middleware auth:sanctum
 */

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // Trait HasApiTokens sangat penting dalam Laravel Sanctum. Trait ini membuat model User
    // bisa membuat token API yang dipakai untuk autentikasi request dari frontend.
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * FIELD:
     * $fillable
     *
     * FUNGSI:
     * Menentukan kolom mana yang boleh diisi secara mass assignment oleh Eloquent.
     * Ini mencegah user menyisipkan kolom yang tidak diinginkan secara sembarangan.
     *
     * KOLom:
     * - name
     * - email
     * - password
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * FIELD:
     * $hidden
     *
     * FUNGSI:
     * Menentukan atribut yang harus disembunyikan pada saat serialisasi atau response JSON.
     * Tujuannya agar password dan token tidak terlihat oleh frontend secara langsung.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * FUNCTION:
     * casts()
     *
     * TUJUAN:
     * Mendefinisikan casting otomatis untuk field tertentu.
     *
     * ALUR:
     * - email_verified_at akan otomatis diubah menjadi objek datetime.
     * - password akan otomatis di-hash ketika disimpan.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
