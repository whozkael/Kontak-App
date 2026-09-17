<?php

/**
 * FILE:
 * LoginUserRequest.php
 *
 * FUNGSI:
 * File ini adalah FormRequest khusus untuk validasi login user.
 * Sebelum AuthController@login dipanggil, Laravel akan memvalidasi data yang dikirim
 * dari frontend terlebih dahulu agar input email dan password sesuai format yang diharapkan.
 *
 * PROSES:
 * - Mengecek email wajib diisi dan valid format email
 * - Mengecek password wajib diisi
 * - Mengirimkan pesan error yang ramah untuk mahasiswa/ frontend developer
 *
 * HUBUNGAN:
 * Digunakan oleh AuthController@login dan endpoint POST /api/login.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    /**
     * FUNCTION:
     * authorize()
     *
     * TUJUAN:
     * Menentukan apakah request ini diizinkan untuk diproses.
     *
     * KARENA:
     * Untuk login, kita mengizinkan semua request karena validasi dan autentikasi
     * akan dilakukan di controller. Tidak ada role atau permission khusus di sini.
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
     * Menentukan aturan validasi data login.
     *
     * ATURAN:
     * - email: wajib diisi dan harus valid format email
     * - password: wajib diisi dan harus bertipe string
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',
        ];
    }

    /**
     * FUNCTION:
     * messages()
     *
     * TUJUAN:
     * Memberikan pesan error kustom yang lebih mudah dipahami oleh user.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email harus diisi',
            'email.email' => 'Email harus valid',
            'password.required' => 'Password harus diisi',
        ];
    }
}
