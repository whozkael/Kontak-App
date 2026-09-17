<?php

/**
 * FILE:
 * ContactController.php
 *
 * FUNGSI:
 * File ini bertanggung jawab untuk seluruh operasi CRUD data kontak.
 * Controller ini menjadi penghubung antara frontend dan database, khususnya table kontak dan kontak_phones.
 *
 * PROSES:
 * - Menampilkan daftar kontak
 * - Menambahkan kontak baru
 * - Menampilkan detail kontak per ID
 * - Mengubah data kontak
 * - Menghapus kontak
 *
 * HUBUNGAN:
 * File ini dipanggil oleh routes/api.php dan menggunakan model Contact serta ContactPhone
 * untuk membaca dan menyimpan data ke database melalui Eloquent ORM.
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Models\ContactPhone;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * FUNCTION:
     * index()
     *
     * TUJUAN:
     * Mengambil semua data kontak dari database untuk ditampilkan di frontend.
     *
     * ALUR:
     * 1. Memanggil Contact::with('phones')->get().
     * 2. Eager loading dilakukan agar data kontak dan nomor telepon bisa diambil sekaligus.
     * 3. Response JSON dikirimkan kembali ke frontend.
     *
     * DIPANGGIL OLEH:
     * GET /api/kontak
     *
     * HUBUNGAN:
     * - Berelasi dengan model Contact
     * - Data phones berasal dari relasi one-to-many Contact -> ContactPhone
     */
    public function index()
    {
        try {
            // Mengambil data kontak dengan relasi phones agar tidak terjadi query berulang.
            // Ini penting agar data nomor telepon bisa langsung ikut disertakan dalam response.
            $contacts = Contact::with('phones')->get();

            return response()->json([
                'success' => true,
                'message' => 'Contacts retrieved successfully',
                'data' => $contacts
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * store()
     *
     * TUJUAN:
     * Membuat data kontak baru sekaligus menyimpan nomor telepon yang terkait.
     *
     * ALUR:
     * 1. Menerima request dari frontend.
     * 2. Menyimpan data utama kontak ke table kontak.
     * 3. Jika request berisi phones, maka setiap nomor telepon dibuat sebagai data baru di table kontak_phones.
     * 4. Mengembalikan data kontak lengkap bersama daftar telefonnya.
     *
     * DIPANGGIL OLEH:
     * POST /api/kontak
     *
     * HUBUNGAN:
     * - Menggunakan StoreContactRequest untuk validasi input
     * - Menggunakan model Contact dan ContactPhone
     * - Relationship: satu Contact memiliki banyak ContactPhone
     */
    public function store(StoreContactRequest $request)
    {
        try {
            // Langkah pertama: menyimpan data kontak utama seperti nama, alamat, dan tanggal lahir.
            $contact = Contact::create([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'tanggal_lahir' => $request->tanggal_lahir,
            ]);

            // Jika frontend mengirimkan array phones, maka tiap item akan disimpan sebagai
            // record di table kontak_phones dengan foreign key kontak_id yang mengarah ke kontak baru.
            if ($request->has('phones') && is_array($request->phones)) {
                foreach ($request->phones as $phone) {
                    ContactPhone::create([
                        'kontak_id' => $contact->id,
                        'jenis' => $phone['jenis'],
                        'nomor_telepon' => $phone['nomor_telepon'],
                    ]);
                }
            }

            // Setelah insert selesai, data kontak di-load ulang bersama relasi phones agar
            // frontend menerima response yang lengkap dan konsisten.
            $contact->load('phones');

            return response()->json([
                'success' => true,
                'message' => 'Contact created successfully',
                'data' => $contact
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * show()
     *
     * TUJUAN:
     * Mengambil detail satu kontak berdasarkan ID yang dikirimkan oleh frontend.
     *
     * ALUR:
     * 1. Mencari kontak dengan id tertentu.
     * 2. Jika tidak ditemukan, kirim response 404.
     * 3. Jika ditemukan, kirim data lengkap dengan semua nomor telepon terkait.
     *
     * DIPANGGIL OLEH:
     * GET /api/kontak/{id}
     */
    public function show($id)
    {
        try {
            // Pencarian kontak dengan eager loading terhadap phones agar response detail
            // berisi data nomor telepon sekaligus tanpa query tambahan.
            $contact = Contact::with('phones')->find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Contact retrieved successfully',
                'data' => $contact
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * update()
     *
     * TUJUAN:
     * Memperbarui data kontak lama berdasarkan ID dan mengganti informasi nomor telepon apabila ada.
     *
     * ALUR:
     * 1. Cari kontak lama berdasarkan id.
     * 2. Jika tidak ada, kirim status 404.
     * 3. Update field utama kontak seperti nama, alamat, tanggal_lahir.
     * 4. Jika payload phones ada, hapus semua nomor lama dan buat nomor baru.
     * 5. Kirim data kontak yang sudah diperbarui ke frontend.
     *
     * DIPANGGIL OLEH:
     * PUT /api/kontak/{id}
     *
     * HUBUNGAN:
     * - Menggunakan UpdateContactRequest untuk validasi data baru
     * - Memiliki hubungan penting dengan ContactPhone karena daftar phone bisa berubah total
     */
    public function update(UpdateContactRequest $request, $id)
    {
        try {
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }

            // Mengupdate data utama kontak seperti nama, alamat, dan tanggal lahir.
            $contact->update([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'tanggal_lahir' => $request->tanggal_lahir,
            ]);

            // Jika request membawa data phones, maka seluruh nomor lama dihapus dan nomor baru dibuat.
            // Logika ini cocok untuk skenario edit kontak yang mengganti seluruh daftar telepon.
            if ($request->has('phones') && is_array($request->phones)) {
                ContactPhone::where('kontak_id', $contact->id)->delete();

                foreach ($request->phones as $phone) {
                    ContactPhone::create([
                        'kontak_id' => $contact->id,
                        'jenis' => $phone['jenis'],
                        'nomor_telepon' => $phone['nomor_telepon'],
                    ]);
                }
            }

            // Setelah update selesai, data kontak di-load ulang dengan relasi phones supaya
            // frontend menerima state terbaru yang lengkap.
            $contact->load('phones');

            return response()->json([
                'success' => true,
                'message' => 'Contact updated successfully',
                'data' => $contact
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * destroy()
     *
     * TUJUAN:
     * Menghapus kontak dari database berdasarkan ID tertentu.
     *
     * ALUR:
     * 1. Cari kontak berdasarkan id.
     * 2. Jika tidak ada, kirim response 404.
     * 3. Jika ada, hapus data kontak menggunakan Eloquent delete().
     * 4. Data nomor telepon yang berhubungan ikut terhapus karena cascade delete di database.
     *
     * DIPANGGIL OLEH:
     * DELETE /api/kontak/{id}
     *
     * HUBUNGAN:
     * - Bergantung pada relasi kontak -> kontak_phones
     * - Bonus: menghapus data induk secara otomatis akan menghapus data anak jika database diatur cascade
     */
    public function destroy($id)
    {
        try {
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }

            // Menghapus kontak. Karena dalam migrasi nomor telepon di table kontak_phones
            // memakai foreign key dengan onDelete('cascade'), semua nomor telepon terkait
            // juga ikut terhapus otomatis.
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
