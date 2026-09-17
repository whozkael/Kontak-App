<?php

/**
 * FILE:
 * StoreContactRequest.php
 *
 * FUNGSI:
 * File ini berfungsi sebagai validasi saat frontend mengirim permintaan untuk membuat kontak baru.
 * Validasi ini memastikan data yang masuk ke ContactController@store sudah benar dan aman.
 *
 * PROSES:
 * - Validasi nama kontak wajib diisi
 * - Validasi alamat boleh kosong
 * - Validasi tanggal_lahir harus format tanggal jika ada
 * - Validasi nomor telepon jika dikirim harus memiliki jenis dan nomor telepon
 *
 * HUBUNGAN:
 * Digunakan oleh ContactController@store dan endpoint POST /api/kontak.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * FUNCTION:
     * authorize()
     *
     * TUJUAN:
     * Memungkinkan request create contact diproses oleh controller.
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
     * Menentukan aturan validasi data kontak baru.
     *
     * ATURAN:
     * - nama wajib diisi sebagai string
     * - alamat optional tetapi harus string jika ada
     * - tanggal_lahir optional tetapi harus format date
     * - phones optional, jika ada harus berbentuk array
     * - tiap item phones harus memiliki jenis dan nomor_telepon
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
     * Menyediakan pesan error kustom agar user tahu apa yang salah saat input kontak.
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
