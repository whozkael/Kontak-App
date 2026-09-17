<?php

/**
 * FILE:
 * UpdateContactRequest.php
 *
 * FUNGSI:
 * File ini berfungsi sebagai validasi saat user melakukan edit data kontak.
 * Logika update memiliki struktur yang mirip dengan create, tetapi dilakukan pada data yang sudah ada.
 *
 * PROSES:
 * - Validasi input dasar kontak
 * - Memastikan data phone baru tetap valid jika dikirim
 * - Menjaga konsistensi data saat proses update
 *
 * HUBUNGAN:
 * Digunakan oleh ContactController@update dan endpoint PUT /api/kontak/{id}.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
{
    /**
     * FUNCTION:
     * authorize()
     *
     * TUJUAN:
     * Mengizinkan request update kontak diproses oleh controller.
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
     * Menentukan validasi data saat update kontak.
     *
     * ATURAN:
     * - nama wajib diisi
     * - alamat dan tanggal_lahir boleh kosong
     * - bila phones dikirim, maka formatnya harus array
     * - item di dalam phones harus punya jenis dan nomor_telepon
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'phones' => 'nullable|array',
            'phones.*.jenis' => 'required_with:phones|string|max:50',
            'phones.*.nomor_telepon' => 'required_with:phones|string|max:20',
        ];
    }

    /**
     * FUNCTION:
     * messages()
     *
     * TUJUAN:
     * Menyediakan feedback yang jelas ketika update gagal karena validasi.
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama harus diisi',
            'nama.string' => 'Nama harus berupa teks',
            'nama.max' => 'Nama tidak boleh lebih dari 255 karakter',
            'phones.*.jenis.required_with' => 'Jenis telepon harus diisi',
            'phones.*.nomor_telepon.required_with' => 'Nomor telepon harus diisi',
        ];
    }
}
