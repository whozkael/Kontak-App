<?php

/**
 * FILE:
 * AuthController.php
 *
 * FUNGSI:
 * File ini menangani seluruh proses autentikasi user pada backend Laravel.
 * Semua endpoint login, register, dan logout akan diproses melalui class ini.
 *
 * PROSES:
 * - Menambahkan user baru ke database
 * - Memvalidasi input user saat registrasi dan login
 * - Memeriksa credentials dengan Hash::check()
 * - Membuat token Sanctum untuk user yang berhasil login
 * - Menghapus token aktif saat logout
 *
 * HUBUNGAN:
 * File ini dipanggil oleh route yang ada di routes/api.php dan oleh frontend
 * melalui request HTTP ke endpoint /api/register, /api/login, dan /api/logout.
 */

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * FUNCTION:
     * register()
     *
     * TUJUAN:
     * Melakukan proses pendaftaran user baru ke aplikasi.
     *
     * ALUR:
     * 1. Menerima request valid dari frontend.
     * 2. Menyimpan nama, email, dan password ke database.
     * 3. Password di-hash agar aman saat disimpan.
     * 4. Mengembalikan response JSON yang berisi data user baru.
     *
     * DIPANGGIL OLEH:
     * POST /api/register
     *
     * HUBUNGAN:
     * - Menggunakan RegisterUserRequest untuk validasi input
     * - Menggunakan model User untuk menyimpan data
     */
    public function register(RegisterUserRequest $request)
    {
        try {
            // Proses pembuatan user baru. Data password tidak disimpan dalam bentuk plain text,
            // melainkan di-hash terlebih dahulu agar aman dari akses yang tidak sah.
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * login()
     *
     * TUJUAN:
     * Melakukan autentikasi user dan menghasilkan token API untuk sesi berikutnya.
     *
     * ALUR:
     * 1. Menerima email dan password dari request frontend.
     * 2. Mencari user berdasarkan email.
     * 3. Memeriksa apakah user ditemukan dan password cocok.
     * 4. Membuat token menggunakan Sanctum.
     * 5. Mengembalikan data user beserta token ke frontend.
     *
     * DIPANGGIL OLEH:
     * POST /api/login
     *
     * HUBUNGAN:
     * - Menggunakan LoginUserRequest untuk validasi input
     * - Menggunakan Hash::check() untuk keamanan password
     * - Menggunakan HasApiTokens dari model User agar bisa membuat token
     */
    public function login(LoginUserRequest $request)
    {
        try {
            // Langkah pertama: mencari user berdasarkan email. Jika email tidak ada,
            // maka user dianggap belum terdaftar atau password salah.
            $user = User::where('email', $request->email)->first();

            // Memeriksa apakah user ada dan password sesuai dengan hash yang tersimpan di database.
            // Jika salah, maka server akan melempar ValidationException agar frontend bisa
            // menampilkan error login dengan jelas.
            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Email atau password tidak valid.'],
                ]);
            }

            // Membuat token untuk user yang berhasil login. Token ini akan dikirim ke frontend
            // dan disimpan di localStorage untuk dipakai pada request selanjutnya.
            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'errors' => $e->errors()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNCTION:
     * logout()
     *
     * TUJUAN:
     * Mengakhiri sesi login user dengan cara menghapus token aktif yang sedang dipakai.
     *
     * ALUR:
     * 1. Ambil user dari request yang sedang terautentikasi.
     * 2. Ambil token aktif yang saat ini sedang dipakai user.
     * 3. Hapus token tersebut dari database.
     * 4. Kirim response berhasil ke frontend.
     *
     * DIPANGGIL OLEH:
     * POST /api/logout
     *
     * HUBUNGAN:
     * - Dijalankan setelah middleware auth:sanctum berhasil memvalidasi token
     * - Frontend akan membersihkan state dan localStorage setelah menerima response
     */
    public function logout(Request $request)
    {
        try {
            // Menghapus token yang aktif saat ini. Dengan begitu, token lama tidak lagi
            // bisa dipakai untuk akses API yang terproteksi.
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
