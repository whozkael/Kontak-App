# KontakApp

Dokumen ini berisi analisis lengkap project KontakApp berdasarkan file yang benar-benar ada di workspace. Tujuan utama dokumen ini adalah menjadi referensi teknis untuk demo aplikasi kepada dosen, sekaligus menjawab kemungkinan pertanyaan teknis yang akan muncul.

## 1. Gambaran Umum Project

Project KontakApp terdiri dari dua bagian utama:

1. Backend Laravel: folder `kontak-api`
2. Frontend React + TypeScript: folder `kontak-app`

Aplikasi ini berfungsi untuk:
- registrasi user baru
- login dan logout
- mengelola data kontak
- menambah kontak baru
- melihat daftar kontak
- mengubah kontak
- menghapus kontak
- menyimpan beberapa nomor telepon per kontak

Backend berperan sebagai REST API, sedangkan frontend berperan sebagai antarmuka pengguna yang mengirim request dan menampilkan response.

---

## 2. Struktur Project

```text
KontakApp
├── kontak-api
│   ├── app
│   │   ├── Http
│   │   │   ├── Controllers
│   │   │   └── Requests
│   │   └── Models
│   ├── bootstrap
│   ├── config
│   ├── database
│   │   ├── migrations
│   │   └── seeders
│   ├── public
│   ├── resources
│   ├── routes
│   │   └── api.php
│   ├── storage
│   └── tests
│
├── kontak-app
│   ├── public
│   └── src
│       ├── api
│       ├── components
│       ├── hooks
│       ├── layouts
│       ├── pages
│       ├── store
│       ├── utils
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── readme.md
└── readme.txt
```

### Fungsi tiap folder

#### Backend: `kontak-api`
- Folder utama backend Laravel
- Menyediakan API untuk frontend
- Mengelola authentication, route, controller, model, dan database

#### `app/Http/Controllers`
- Menangani request HTTP dari frontend
- Berisi logic autentikasi dan CRUD kontak

#### `app/Http/Requests`
- Menyimpan validasi input sebelum controller diproses
- Digunakan untuk register, login, create contact, update contact

#### `app/Models`
- Menggunakan Eloquent ORM untuk mapping table database
- Berisi model `User`, `Contact`, dan `ContactPhone`

#### `routes/api.php`
- File utama yang mendefinisikan endpoint API
- Membagi route publik dan route yang perlu autentikasi

#### `database/migrations`
- Menyimpan skema table database
- Menentukan struktur `users`, `kontak`, dan `kontak_phones`

#### `config`
- Menyimpan konfigurasi Laravel seperti auth, database, session, dan app

#### Frontend: `kontak-app`
- Folder utama aplikasi React + TypeScript
- Berisi UI, routing, state management, dan API client

#### `src/api`
- Tempat logic komunikasi antara frontend dan backend
- Menggunakan Axios

#### `src/pages`
- Halaman seperti login, register, dashboard, daftar kontak, form kontak

#### `src/components`
- Komponen reusable UI seperti `Button`, `Input`, `Modal`, `Card`, `LoadingSpinner`

#### `src/hooks`
- Hook khusus untuk fetch data dan logic reusable

#### `src/store`
- State management global menggunakan Zustand

#### `src/layouts`
- Layout halaman auth dan layout aplikasi utama

---

## 3. Analisis Backend

### 3.1 File route utama
File: `kontak-api/routes/api.php`

Ini adalah file utama yang mendefinisikan semua endpoint API aplikasi.

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/kontak', [ContactController::class, 'index']);
    Route::post('/kontak', [ContactController::class, 'store']);
    Route::get('/kontak/{id}', [ContactController::class, 'show']);
    Route::put('/kontak/{id}', [ContactController::class, 'update']);
    Route::delete('/kontak/{id}', [ContactController::class, 'destroy']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

Dari file tersebut terlihat:
- endpoint register dan login bersifat publik
- route kontak dan logout bersifat protected
- semua route kontak memakai middleware `auth:sanctum`

---

## 4. Endpoint API Lengkap

### 4.1 POST /api/register

- Method HTTP: `POST`
- URL: `/api/register`
- Controller: `AuthController@register`
- Fungsi: membuat akun baru
- Request: `RegisterUserRequest`

Kode di backend:

```php
$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
]);
```

Validasi:
- `name` wajib diisi
- `email` wajib, valid, dan unik
- `password` wajib minimal 6 karakter

Response berhasil:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 4.2 POST /api/login

- Method HTTP: `POST`
- URL: `/api/login`
- Controller: `AuthController@login`
- Fungsi: autentikasi user dan menghasilkan token Sanctum

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Proses backend:

```php
$user = User::where('email', $request->email)->first();

if (!$user || !Hash::check($request->password, $user->password)) {
    throw ValidationException::withMessages([
        'email' => ['Email atau password tidak valid.'],
    ]);
}

$token = $user->createToken('api_token')->plainTextToken;
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "token_abc123"
  }
}
```

---

### 4.3 POST /api/logout

- Method HTTP: `POST`
- URL: `/api/logout`
- Controller: `AuthController@logout`
- Fungsi: menghapus token aktif yang digunakan user

Request harus membawa header Authorization Bearer token.

Kode backend:

```php
$request->user()->currentAccessToken()->delete();
```

Response sukses:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 4.4 GET /api/kontak

- Method HTTP: `GET`
- URL: `/api/kontak`
- Controller: `ContactController@index`
- Fungsi: mengambil seluruh data kontak

Backend:

```php
$contacts = Contact::with('phones')->get();
```

Artinya data kontak diambil beserta nomor telepon terkait melalui relasi `phones()`.

Response contoh:

```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama": "Budi Santoso",
      "alamat": "Bandung",
      "tanggal_lahir": "2000-01-01",
      "phones": [
        {
          "id": 1,
          "kontak_id": 1,
          "jenis": "HP",
          "nomor_telepon": "081234567890"
        }
      ]
    }
  ]
}
```

---

### 4.5 POST /api/kontak

- Method HTTP: `POST`
- URL: `/api/kontak`
- Controller: `ContactController@store`
- Fungsi: menambahkan kontak baru

Request body contoh:

```json
{
  "nama": "Sari",
  "alamat": "Jakarta",
  "tanggal_lahir": "1997-03-15",
  "phones": [
    { "jenis": "HP", "nomor_telepon": "081234567890" }
  ]
}
```

Validasi dari `StoreContactRequest`:

```php
return [
    'nama' => 'required|string|max:255',
    'alamat' => 'nullable|string',
    'tanggal_lahir' => 'nullable|date',
    'phones' => 'nullable|array',
    'phones.*.jenis' => 'required_with:phones|string|max:50',
    'phones.*.nomor_telepon' => 'required_with:phones|string|max:20',
];
```

Proses backend:

```php
$contact = Contact::create([
    'nama' => $request->nama,
    'alamat' => $request->alamat,
    'tanggal_lahir' => $request->tanggal_lahir,
]);

foreach ($request->phones as $phone) {
    ContactPhone::create([
        'kontak_id' => $contact->id,
        'jenis' => $phone['jenis'],
        'nomor_telepon' => $phone['nomor_telepon'],
    ]);
}
```

---

### 4.6 GET /api/kontak/{id}

- Method HTTP: `GET`
- URL: `/api/kontak/{id}`
- Controller: `ContactController@show`
- Fungsi: menampilkan detail satu kontak

Kode:

```php
$contact = Contact::with('phones')->find($id);
```

Jika data tidak ditemukan, response 404:

```json
{
  "success": false,
  "message": "Contact not found"
}
```

---

### 4.7 PUT /api/kontak/{id}

- Method HTTP: `PUT`
- URL: `/api/kontak/{id}`
- Controller: `ContactController@update`
- Fungsi: mengubah data kontak dan nomor telepon

Proses:
1. cari kontak berdasarkan id
2. update field utama kontak
3. hapus phone lama
4. insert phone baru

Kode utama:

```php
$contact->update([
    'nama' => $request->nama,
    'alamat' => $request->alamat,
    'tanggal_lahir' => $request->tanggal_lahir,
]);

ContactPhone::where('kontak_id', $contact->id)->delete();
```

Artinya saat update kontak, semua nomor telepon lama dianggap diganti dengan data baru yang dikirim frontend.

---

### 4.8 DELETE /api/kontak/{id}

- Method HTTP: `DELETE`
- URL: `/api/kontak/{id}`
- Controller: `ContactController@destroy`
- Fungsi: menghapus kontak

Kode:

```php
$contact = Contact::find($id);
$contact->delete();
```

Karena di migrasi ada foreign key cascade, nomor telepon yang terkait otomatis ikut terhapus.

---

## 5. CRUD Contact

### 5.1 CREATE: `store()`
File: `kontak-api/app/Http/Controllers/ContactController.php`

Fungsi `store()` menangani proses pembuatan kontak baru.

Cara data diterima:
- frontend mengirim request ke endpoint `POST /api/kontak`
- request dikirim dalam format JSON
- validasi dilakukan dengan `StoreContactRequest`

Cara data disimpan:

```php
$contact = Contact::create([
    'nama' => $request->nama,
    'alamat' => $request->alamat,
    'tanggal_lahir' => $request->tanggal_lahir,
]);
```

Nomor telepon dibuat dengan loop:

```php
foreach ($request->phones as $phone) {
    ContactPhone::create([
        'kontak_id' => $contact->id,
        'jenis' => $phone['jenis'],
        'nomor_telepon' => $phone['nomor_telepon'],
    ]);
}
```

Alur proses:

```text
Frontend
  ↓
POST /api/kontak
  ↓
ContactController@store
  ↓
Contact::create()
  ↓
Insert ke table kontak
  ↓
Insert nomor telepon ke table kontak_phones
  ↓
Return JSON response
```

---

### 5.2 READ: `index()`
File: `kontak-api/app/Http/Controllers/ContactController.php`

Fungsi `index()` mengambil semua kontak dari database.

Kode:

```php
$contacts = Contact::with('phones')->get();
```

Relasi `phones()` ada di model `Contact`:

```php
public function phones(): HasMany
{
    return $this->hasMany(ContactPhone::class, 'kontak_id');
}
```

Jadi backend mengambil kontak dan nomor telepon terkait dalam satu query yang efisien.

Response dikirim dalam format JSON ke frontend.

---

### 5.3 UPDATE: `update()`
File: `kontak-api/app/Http/Controllers/ContactController.php`

Fungsi `update()` memperbarui data kontak dan daftar nomor telepon.

Proses:

```php
$contact = Contact::find($id);

$contact->update([
    'nama' => $request->nama,
    'alamat' => $request->alamat,
    'tanggal_lahir' => $request->tanggal_lahir,
]);

ContactPhone::where('kontak_id', $contact->id)->delete();
```

Setelah itu, nomor telepon baru dibuat kembali dari `phones` payload.

---

### 5.4 DELETE: `destroy()`
File: `kontak-api/app/Http/Controllers/ContactController.php`

Fungsi `destroy()` menghapus data kontak tertentu.

Proses:

```php
$contact = Contact::find($id);
if (!$contact) {
    return response()->json([
        'success' => false,
        'message' => 'Contact not found'
    ], 404);
}

$contact->delete();
```

Karena relasi menggunakan cascade delete, semua nomor telepon terkait ikut terhapus otomatis.

---

## 6. Database Explanation

### 6.1 Model User
File: `kontak-api/app/Models/User.php`

Model ini mewakili table `users`.

```php
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];
}
```

Fungsi:
- menyimpan data pengguna
- menangani autentikasi Laravel
- mendukung token API untuk Sanctum

---

### 6.2 Model Contact
File: `kontak-api/app/Models/Contact.php`

```php
class Contact extends Model
{
    use HasFactory;

    protected $table = 'kontak';

    protected $fillable = [
        'nama',
        'alamat',
        'tanggal_lahir',
    ];

    public function phones(): HasMany
    {
        return $this->hasMany(ContactPhone::class, 'kontak_id');
    }
}
```

Penjelasan:
- `$table = 'kontak'` menunjukkan model ini berhubungan dengan table `kontak`
- `fillable` membatasi kolom yang boleh diisi mass assignment
- `phones()` adalah relasi one-to-many

---

### 6.3 Model ContactPhone
File: `kontak-api/app/Models/ContactPhone.php`

```php
class ContactPhone extends Model
{
    use HasFactory;

    protected $table = 'kontak_phones';

    protected $fillable = [
        'kontak_id',
        'jenis',
        'nomor_telepon',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'kontak_id');
    }
}
```

Penjelasan:
- `kontak_phones` menyimpan nomor telepon kontak
- `contact()` menunjukkan bahwa tiap nomor telepon milik satu kontak
- `kontak_id` menjadi foreign key ke `kontak.id`

---

### 6.4 Hubungan database

```text
User
  ↓
Contact
  ↓
ContactPhone
```

Relasi yang benar-benar ada di project:
- satu `Contact` punya banyak `ContactPhone`
- setiap `ContactPhone` milik satu `Contact`

Migrations terkait:

- `2026_09_14_082512_create_contacts_table.php`
- `2026_09_14_082520_create_contact_phones_table.php`

Kode migrasi kontak:

```php
Schema::create('kontak', function (Blueprint $table) {
    $table->id();
    $table->string('nama');
    $table->text('alamat')->nullable();
    $table->date('tanggal_lahir')->nullable();
    $table->timestamps();
});
```

Kode migrasi nomor telepon:

```php
Schema::create('kontak_phones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('kontak_id')->constrained('kontak')->onDelete('cascade');
    $table->string('jenis');
    $table->string('nomor_telepon');
    $table->timestamps();
});
```

---

## 7. Frontend API Connection

### 7.1 File axios
File: `kontak-app/src/api/axios.ts`

```ts
const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
```

Fungsi:
- membuat instance axios
- menentukan base URL backend
- menambahkan Authorization header otomatis

Interceptor token:

```ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

Jika response 401 terjadi, frontend otomatis:
- hapus token dan user dari localStorage
- redirect ke `/login`

---

### 7.2 File auth.ts
File: `kontak-app/src/api/auth.ts`

Fungsi:
- `register()`
- `login()`
- `logout()`
- `getCurrentUser()`

```ts
export const authAPI = {
  register: (data: RegisterData) => apiClient.post('/register', data),
  login: (data: LoginData) => apiClient.post('/login', data),
  logout: () => apiClient.post('/logout'),
  getCurrentUser: () => apiClient.get('/user'),
}
```

---

### 7.3 File contacts.ts
File: `kontak-app/src/api/contacts.ts`

Fungsi:
- `getAll()`
- `getById()`
- `create()`
- `update()`
- `delete()`

```ts
export const contactAPI = {
  getAll: () => apiClient.get('/kontak'),
  getById: (id: number) => apiClient.get(`/kontak/${id}`),
  create: (data: CreateContactData) => apiClient.post('/kontak', data),
  update: (id: number, data: CreateContactData) => apiClient.put(`/kontak/${id}`, data),
  delete: (id: number) => apiClient.delete(`/kontak/${id}`),
}
```

Hubungan:

```text
React Component
  ↓
API Service
  ↓
Axios
  ↓
Laravel API
  ↓
Database
```

---

## 8. Login Flow

File yang terlibat:
- `kontak-app/src/pages/LoginPage.tsx`
- `kontak-app/src/api/auth.ts`
- `kontak-app/src/api/axios.ts`
- `kontak-app/src/store/authStore.ts`
- `kontak-api/routes/api.php`
- `kontak-api/app/Http/Controllers/AuthController.php`

### Alur login detail

1. User mengisi email dan password di `LoginPage.tsx`
2. `handleSubmit()` dipanggil
3. `authAPI.login(formData)` dijalankan
4. Request dikirim ke `POST /api/login`
5. Laravel menerima request di route `login`
6. `AuthController@login` dipanggil
7. Sistem mengecek password dengan `Hash::check()`
8. Jika valid, token dibuat dengan `createToken()`
9. Response dikembalikan dengan `user` dan `token`
10. Frontend memanggil:

```ts
setUser(user)
setToken(token)
```

11. Token disimpan ke `localStorage`
12. Aplikasi redirect ke `/dashboard`

Kode di `LoginPage.tsx`:

```ts
const response = await authAPI.login(formData)
const { user, token } = response.data.data

setUser(user)
setToken(token)
navigate('/dashboard', { replace: true })
```

---

## 9. State Management

### 9.1 `authStore.ts`
File: `kontak-app/src/store/authStore.ts`

Fungsi utama:
- menyimpan user state
- menyimpan token state
- memberi fungsi `logout()`
- mengecek status autentikasi

Kode inti:

```ts
export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isLoading: false,

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}))
```

Kenapa menggunakan Zustand:
- ringan dan praktis
- mudah digunakan untuk state global
- tidak membutuhkan setup kompleks seperti Redux
- cocok untuk aplikasi ini yang hanya butuh auth state dan daftar kontak

### 9.2 `contactsStore.ts`
File: `kontak-app/src/store/contactsStore.ts`

Fungsi:
- menyimpan array kontak dari backend
- update state setelah create/update/delete

---

## 10. Dashboard Analysis

File: `kontak-app/src/pages/DashboardPage.tsx`

Dashboard menggunakan custom hook `useContacts()`.

```ts
const { contacts, isLoading, fetchContacts } = useContacts()
```

Pada `useEffect()` dijalankan:

```ts
useEffect(() => {
  fetchContacts()
}, [fetchContacts])
```

Hook `useContacts`:

```ts
const fetchContacts = useCallback(async () => {
  setLoading(true)
  try {
    const response = await contactAPI.getAll()
    setContacts(response.data.data)
  } catch (error) {
    console.error('FETCH CONTACTS ERROR', error)
    toast.error(handleApiError(error))
  } finally {
    setLoading(false)
  }
}, [setContacts, setLoading])
```

Alur:

```text
DashboardPage
  ↓
useContacts()
  ↓
contactAPI.getAll()
  ↓
GET /api/kontak
  ↓
Laravel
  ↓
Database
  ↓
Response JSON
  ↓
UI render
```

Dashboard menghitung:

```ts
const recentContacts = contacts.slice(0, 3)
const totalPhones = contacts.reduce((sum, c) => sum + c.phones.length, 0)
```

Artinya:
- jumlah kontak = `contacts.length`
- total nomor telepon = `totalPhones`
- 3 kontak terbaru ditampilkan sebagai ringkasan

---

## 11. Frontend Pages

### 11.1 `LoginPage.tsx`
- form login email/password
- validasi local
- panggil `authAPI.login()`
- simpan token dan user
- redirect ke dashboard

### 11.2 `RegisterPage.tsx`
- form register akun baru
- validasi nama, email, password, konfirmasi password
- request ke `/api/register`
- redirect ke login setelah sukses

### 11.3 `DashboardPage.tsx`
- fetch data kontak
- menghitung statistik
- menampilkan kontak terbaru

### 11.4 `ContactsPage.tsx`
- menampilkan daftar kontak
- fungsi search nama kontak
- delete dengan modal konfirmasi

### 11.5 `ContactFormPage.tsx`
- form create/update kontak
- multiple phone number field
- validasi nomor telepon
- submit data ke API

---

## 12. Hubungan Frontend dan Backend

Hubungannya dapat digambarkan seperti ini:

```text
User action
  ↓
React page/component
  ↓
API service
  ↓
Axios instance
  ↓
Laravel route API
  ↓
Controller
  ↓
Model / Eloquent
  ↓
Database
  ↓
JSON response
  ↓
React state update
  ↓
UI rendered
```

Dari sisi keamanan:
- token disimpan di `localStorage`
- request frontend membawa token di header Authorization
- Laravel mengecek token melalui `auth:sanctum`
- jika token invalid, frontend logout/redirect

---

## 13. Demo Script Presentasi

### 1. Pembukaan
“Selamat pagi, hari ini saya akan mempresentasikan aplikasi KontakApp. Aplikasi ini dibuat dengan teknologi Laravel untuk backend dan React TypeScript untuk frontend. Tujuan aplikasi ini adalah membantu pengelolaan kontak secara modern, aman, dan terstruktur.”

### 2. Penjelasan tujuan aplikasi
“Aplikasi ini dibuat untuk memudahkan user dalam menyimpan, mengelola, dan mencari data kontak. Data kontak bukan hanya nama, tetapi juga alamat, tanggal lahir, dan banyak nomor telepon.”

### 3. Penjelasan teknologi
“Backend dibuat dengan Laravel, frontend dibuat dengan React + TypeScript + Vite, state management menggunakan Zustand, dan autentikasi menggunakan Laravel Sanctum.”

### 4. Penjelasan arsitektur
“Arsitekturnya terpisah antara frontend dan backend. Frontend tidak langsung terhubung ke database; frontend hanya memanggil API Laravel. Laravel bertanggung jawab atas validasi, auth, dan akses database.”

### 5. Demo login
“User membuka halaman login, mengisi email dan password, lalu klik tombol Masuk. Request dikirim ke endpoint `/api/login`, backend memvalidasi data, lalu membuat token Sanctum dan mengirimkannya ke frontend. Token kemudian disimpan serta digunakan untuk permission route berikutnya.”

### 6. Demo dashboard
“Setelah login, user diarahkan ke dashboard. Dashboard memanggil API untuk mengambil semua kontak dan menampilkan ringkasan statisik total kontak dan total nomor telepon.”

### 7. Demo CRUD kontak
“Pada halaman kontak, user bisa menambah, mengedit, dan menghapus data kontak. Saat create, backend memproses `nama`, `alamat`, `tanggal_lahir`, dan `phones` lalu menyimpannya ke table `kontak` dan `kontak_phones`. Saat edit, backend menghapus nomor lama lalu menambahkan nomor baru. Saat delete, kontak dihapus dan nomor telepon terkait ikut terhapus.”

### 8. Penjelasan API
“Semua endpoint API didefinisikan di `routes/api.php`. Ada endpoint publik untuk login/register, dan endpoint protected untuk kontak. Frontend memanggil API menggunakan Axios dengan token bearer.”

### 9. Penjelasan database
“Database terdiri dari table `users`, `kontak`, dan `kontak_phones`. `kontak` menyimpan data utama, sedangkan `kontak_phones` menyimpan nomor telepon. Hubungan one-to-many dibuat dengan `kontak_id`.”

---

## 14. Prediksi Pertanyaan Dosen dan Jawaban Lengkap

### Pertanyaan 1: Dimana implementasi CRUD pada aplikasi?
Jawaban:
CRUD kontak diimplementasikan di `kontak-api/app/Http/Controllers/ContactController.php`.

- `index()` untuk read semua kontak
- `store()` untuk create kontak
- `show()` untuk detail kontak
- `update()` untuk update kontak
- `destroy()` untuk delete kontak

---

### Pertanyaan 2: Dimana API dibuat?
Jawaban:
API dibuat di file `kontak-api/routes/api.php`.

Semua route utama seperti:
- `/api/register`
- `/api/login`
- `/api/logout`
- `/api/kontak`
- `/api/kontak/{id}`

semuanya didefinisikan di file tersebut dan dihubungkan ke controller yang bersesuaian.

---

### Pertanyaan 3: Bagaimana frontend berkomunikasi dengan backend?
Jawaban:
Frontend menggunakan module API seperti:
- `src/api/auth.ts`
- `src/api/contacts.ts`
- `src/api/axios.ts`

Semua request dikirim melalui Axios instance. Axios menambahkan bearer token jika ada, lalu request dikirim ke Laravel. Response JSON diterima oleh frontend dan dikirim ke state management atau halaman yang sedang aktif.

---

### Pertanyaan 4: Bagaimana Laravel melakukan autentikasi?
Jawaban:
Laravel melakukan autentikasi menggunakan `Laravel Sanctum`.

Pada login, backend memvalidasi email dan password. Jika valid, sistem membuat token dengan `createToken()`. Token dikirim ke frontend. Request yang membutuhkan proteksi mengirim token di header `Authorization: Bearer ...`. Route seperti `/kontak` dilindungi oleh middleware `auth:sanctum`.

---

### Pertanyaan 5: Kenapa menggunakan Sanctum?
Jawaban:
Karena aplikasi ini adalah frontend React terpisah dari backend Laravel. Sanctum sangat cocok untuk API SPA karena:
- mudah digunakan
- ringan
- aman untuk API berbasis token
- integrasi langsung dengan Laravel

---

### Pertanyaan 6: Bagaimana data kontak disimpan?
Jawaban:
Data kontak utama disimpan di table `kontak`, sementara nomor telepon disimpan di table `kontak_phones`.

Tabel `kontak` menyimpan:
- nama
- alamat
- tanggal_lahir

Tabel `kontak_phones` menyimpan:
- kontak_id
- jenis nomor
- nomor_telepon

---

### Pertanyaan 7: Bagaimana relasi kontak dan nomor telepon?
Jawaban:
Relasi adalah `one-to-many`.

Satu kontak bisa memiliki banyak nomor telepon. Model `Contact` memiliki method `phones(): HasMany`, sementara `ContactPhone` memiliki `contact(): BelongsTo`.

Artinya:
- `Contact` punya banyak phone
- `ContactPhone` milik satu kontak

---

### Pertanyaan 8: Kenapa React dan Laravel dipisah?
Jawaban:
Karena arsitektur fullstack modern memisahkan tanggung jawab:
- React fokus pada UI dan pengalaman pengguna
- Laravel fokus pada API, validasi, autentikasi, dan database

Dengan pemisahan ini, project menjadi lebih modular, mudah dipelihara, dan dapat dikembangkan lebih lanjut.

---

### Pertanyaan 9: Apa yang terjadi setelah login sukses?
Jawaban:
Setelah login sukses:
1. frontend menerima token dari API
2. token disimpan ke localStorage
3. data user disimpan ke Zustand store
4. route diarahkan ke `/dashboard`
5. dashboard memanggil API kontak untuk menampilkan data

---

### Pertanyaan 10: Apa yang terjadi jika token tidak valid?
Jawaban:
Di file `axios.ts` terdapat interceptor response. Jika server mengembalikan status `401`, frontend akan:
- menghapus token
- menghapus user local storage
- redirect ke halaman login

---

### Pertanyaan 11: Kenapa contact update dilakukan dengan delete + create ulang?
Jawaban:
Karena aplikasi ini menganggap daftar nomor telepon untuk kontak itu bisa diganti seluruhnya dalam satu kali update. Jadi saat `PUT /api/kontak/{id}` dipanggil, nomor lama dihapus dan nomor baru dibuat ulang berdasarkan payload frontend.

---

### Pertanyaan 12: Bagaimana proses delete kontak?
Jawaban:
Pada `destroy()`, backend mencari kontak berdasarkan id. Jika ditemukan, kontak dihapus. Karena foreign key di `kontak_phones` memakai `onDelete('cascade')`, nomor telepon yang terkait ikut terhapus otomatis.

---

## 15. Kesimpulan

KontakApp adalah aplikasi fullstack yang menggabungkan Laravel dan React dengan arsitektur modern. Backend bertanggung jawab pada autentikasi, validasi, routing, dan penyimpanan data. Frontend bertanggung jawab pada interface pengguna, routing, state management, dan komunikasi API. 

Komponen penting pada aplikasi ini adalah:
- Laravel Sanctum untuk autentikasi
- Axios untuk komunikasi HTTP
- Zustand untuk state management
- Eloquent ORM untuk relasi database
- Controller CRUD pada `ContactController`
- Model `Contact` dan `ContactPhone` untuk relasi one-to-many

Dengan desain seperti ini, aplikasi mudah dipelajari, dikelola, dan dikembangkan lebih lanjut.

---

## 16. Catatan Penting untuk Presentasi

- Fokus pada arsitektur frontend-backend terpisah
- Jelaskan route API dan controller yang menangani setiap endpoint
- Tekankan `auth:sanctum` untuk keamanan API
- Jelaskan relasi `kontak` dan `kontak_phones`
- Tunjukkan alur login dari input ke token ke redirect
- Jelaskan CRUD pada `ContactController`
- Tunjukkan differensiasi antara `users`, `kontak`, dan `kontak_phones`

---

## 17. Ringkasan Singkat untuk Dosen

Aplikasi KontakApp adalah implementasi fullstack CRUD sederhana namun solid. Frontend React + TypeScript menangani UI dan interaksi user. Backend Laravel menyiapkan API REST yang aman dengan Sanctum. Data kontak dan nomor telepon disimpan dalam dua table yang terhubung melalui relasi one-to-many. Proses autentikasi, state management, routing, serta proses CRUD dilakukan secara terstruktur dan sesuai standard aplikasi modern.

Dokumen ini dibuat berdasarkan file yang benar-benar ada di project dan dapat digunakan sebagai referensi utama saat presentasi maupun menjawab pertanyaan dosen.

