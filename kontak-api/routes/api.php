<?php

/**
 * FILE:
 * api.php
 *
 * FUNGSI:
 * File ini berperan sebagai pusat routing REST API untuk project KontakApp.
 * Semua endpoint aplikasi didefinisikan di sini agar frontend React bisa
 * mengakses fungsi autentikasi dan pengelolaan kontak melalui HTTP request.
 *
 * PROSES:
 * - Menyediakan route publik untuk register dan login.
 * - Menyediakan route yang dilindungi middleware auth:sanctum.
 * - Menghubungkan route ke controller yang sesuai.
 * - Menyediakan endpoint untuk mengambil data user yang sedang login.
 *
 * HUBUNGAN:
 * File ini terhubung dengan:
 * - AuthController untuk login, register, logout
 * - ContactController untuk CRUD kontak
 * - Frontend React yang memanggil endpoint melalui Axios
 */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;

/**
 * ENDPOINT:
 * POST /api/register
 *
 * FUNGSI:
 * Endpoint publik untuk mendaftarkan user baru ke sistem.
 * Route ini tidak memerlukan token karena user masih dalam tahap registrasi.
 *
 * CONTROLLER:
 * AuthController@register
 */
Route::post('/register', [AuthController::class, 'register']);

/**
 * ENDPOINT:
 * POST /api/login
 *
 * FUNGSI:
 * Endpoint publik untuk login user. Jika kredensial benar, server akan
 * membuat token Sanctum lalu dikirim kembali ke frontend.
 *
 * CONTROLLER:
 * AuthController@login
 */
Route::post('/login', [AuthController::class, 'login']);

/**
 * GROUP ROUTE PROTECTED:
 * Semua endpoint di bawah ini memerlukan middleware auth:sanctum.
 *
 * FUNGSI:
 * Middleware ini memastikan hanya user yang sudah memiliki token valid yang
 * bisa mengakses fitur kontak dan informasi akun.
 */
Route::middleware('auth:sanctum')->group(function () {
    /**
     * ENDPOINT:
     * POST /api/logout
     *
     * FUNGSI:
     * Endpoint logout untuk menghapus token aktif user yang sedang login.
     *
     * CONTROLLER:
     * AuthController@logout
     */
    Route::post('/logout', [AuthController::class, 'logout']);

    /**
     * ENDPOINT:
     * GET /api/kontak
     *
     * FUNGSI:
     * Mengambil semua data kontak beserta nomor telepon di dalamnya.
     * Digunakan untuk menampilkan daftar kontak di dashboard dan halaman kontak.
     *
     * CONTROLLER:
     * ContactController@index
     */
    Route::get('/kontak', [ContactController::class, 'index']);

    /**
     * ENDPOINT:
     * POST /api/kontak
     *
     * FUNGSI:
     * Membuat kontak baru dan menyimpan nomor telepon sebagai data terkait.
     *
     * CONTROLLER:
     * ContactController@store
     */
    Route::post('/kontak', [ContactController::class, 'store']);

    /**
     * ENDPOINT:
     * GET /api/kontak/{id}
     *
     * FUNGSI:
     * Menampilkan detail satu kontak berdasarkan ID, termasuk nomor telepon yang
     * dimiliki kontak tersebut.
     *
     * CONTROLLER:
     * ContactController@show
     */
    Route::get('/kontak/{id}', [ContactController::class, 'show']);

    /**
     * ENDPOINT:
     * PUT /api/kontak/{id}
     *
     * FUNGSI:
     * Mengubah data kontak yang sudah ada. Jika payload berisi nomor telepon baru,
     * backend akan mengganti daftar nomor lama dengan data baru.
     *
     * CONTROLLER:
     * ContactController@update
     */
    Route::put('/kontak/{id}', [ContactController::class, 'update']);

    /**
     * ENDPOINT:
     * DELETE /api/kontak/{id}
     *
     * FUNGSI:
     * Menghapus kontak beserta data nomor telepon yang terkait.
     *
     * CONTROLLER:
     * ContactController@destroy
     */
    Route::delete('/kontak/{id}', [ContactController::class, 'destroy']);

    /**
     * ENDPOINT:
     * GET /api/user
     *
     * FUNGSI:
     * Mengambil data user yang sedang login. Ini biasanya dipakai oleh frontend
     * untuk mengecek sesi pengguna yang aktif setelah login.
     *
     * IMPLEMENTASI:
     * Route ini langsung mengambil user dari request melalui $request->user().
     */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

