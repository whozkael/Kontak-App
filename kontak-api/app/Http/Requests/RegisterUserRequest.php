<?php

/**
 * FILE:
 * RegisterUserRequest.php
 *
 * FUNGSI:
 * File ini berfungsi sebagai validasi request saat user mendaftar akun baru.
 * FormRequest digunakan agar data yang masuk ke AuthController@register telah sesuai format
 * sebelum masuk ke logika create user.
 *
 * PROSES:
 * - Validasi nama user
 * - Validasi email, apakah format benar dan unik
 * - Validasi password panjang minimal 6 karakter
 * - Mengembalikan pesan error yang rapi ke frontend
 *
 * HUBUNGAN:
 * Digunakan oleh AuthController@register dan route POST /api/register.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    /**
     * FUNCTION:
     * authorize()
     *
     * TUJUAN:
     * Mengizinkan request registrasi diproses. Tidak ada role-level security di sini.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * FUNCTION:
     * rules()
     *
     * TUJUAN:
     * Menetapkan aturan validasi untuk registrasi user.
     *
     * ATURAN:
     * - name wajib diisi, tipe string, maksimal 255 karakter
     * - email wajib valid dan harus unik pada table users
     * - password wajib diisi dan minimal panjang 6 karakter
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ];
    }

    /**
     * FUNCTION:
     * messages()
     *
     * TUJUAN:
     * Menyediakan pesan error yang lebih jelas agar frontend bisa menampilkan feedback ke user.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi',
            'email.required' => 'Email harus diisi',
            'email.email' => 'Email harus valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password harus diisi',
            'password.min' => 'Password minimal 6 karakter',
        ];
    }
}
