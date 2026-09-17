# Contact Management REST API - Complete Documentation

## Project Overview

A modern Contact Management REST API built with **Laravel 11** using **Laravel Sanctum** for token-based authentication. The application supports complete CRUD operations for managing contacts and their phone numbers.

---

## 🚀 Environment Setup

**Installed Tools:**
- PHP 8.5.10
- Composer
- Laravel Framework 11.56.1
- Laravel Sanctum (Token-based Authentication)
- SQLite Database

**Server Running On:**
- URL: `http://127.0.0.1:8000`
- Base API: `http://127.0.0.1:8000/api`

---

## 📋 Database Structure

### Table: kontak (Contacts)
```sql
- id (Primary Key)
- nama (string) - Contact name
- alamat (text) - Address
- tanggal_lahir (date) - Date of birth
- created_at (timestamp)
- updated_at (timestamp)
```

### Table: kontak_phones (Contact Phone Numbers)
```sql
- id (Primary Key)
- kontak_id (Foreign Key) - References kontak table
- jenis (string) - Type of phone (HP, Rumah, Kantor, etc)
- nomor_telepon (string) - Phone number
- created_at (timestamp)
- updated_at (timestamp)
```

**Relationship:** One Contact has many Phone Numbers (1-to-many)

---

## 🔐 API Endpoints

### Authentication Endpoints (Public)

#### 1. Register User
- **Endpoint:** `POST /api/register`
- **Authentication:** Not required
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-09-14T08:37:46.000000Z",
      "updated_at": "2026-09-14T08:37:46.000000Z"
    }
  }
}
```

- **Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Email sudah terdaftar"],
    "password": ["Password minimal 6 karakter"]
  }
}
```

---

#### 2. Login User
- **Endpoint:** `POST /api/login`
- **Authentication:** Not required
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-09-14T08:37:46.000000Z",
      "updated_at": "2026-09-14T08:37:46.000000Z"
    },
    "token": "3|WXMPPyLBYVYP8LqxLlYq8N7ZXfP6UpTfj1q8bM4a1234abcd"
  }
}
```

- **Error Response (401):**
```json
{
  "success": false,
  "message": "Login failed",
  "errors": {
    "email": ["Email atau password tidak valid."]
  }
}
```

---

#### 3. Logout User
- **Endpoint:** `POST /api/logout`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:** Empty or `{}`

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Contact Management Endpoints (Protected)

All contact endpoints require Bearer token authentication.

#### 4. Get All Contacts
- **Endpoint:** `GET /api/kontak`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **Query Parameters:** None
- **Request Body:** None

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama": "Budi Santoso",
      "alamat": "Denpasar, Bali",
      "tanggal_lahir": "2000-01-15",
      "created_at": "2026-09-14T08:37:46.000000Z",
      "updated_at": "2026-09-14T08:37:46.000000Z",
      "phones": [
        {
          "id": 1,
          "kontak_id": 1,
          "jenis": "HP",
          "nomor_telepon": "08123456789",
          "created_at": "2026-09-14T08:37:46.000000Z",
          "updated_at": "2026-09-14T08:37:46.000000Z"
        },
        {
          "id": 2,
          "kontak_id": 1,
          "jenis": "Rumah",
          "nomor_telepon": "02158123456",
          "created_at": "2026-09-14T08:37:46.000000Z",
          "updated_at": "2026-09-14T08:37:46.000000Z"
        }
      ]
    }
  ]
}
```

---

#### 5. Create New Contact
- **Endpoint:** `POST /api/kontak`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**
```json
{
  "nama": "Budi Santoso",
  "alamat": "Denpasar, Bali",
  "tanggal_lahir": "2000-01-15",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08123456789"
    },
    {
      "jenis": "Rumah",
      "nomor_telepon": "02158123456"
    },
    {
      "jenis": "Kantor",
      "nomor_telepon": "02170123456"
    }
  ]
}
```

- **Success Response (201):**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": 1,
    "nama": "Budi Santoso",
    "alamat": "Denpasar, Bali",
    "tanggal_lahir": "2000-01-15",
    "created_at": "2026-09-14T08:37:46.000000Z",
    "updated_at": "2026-09-14T08:37:46.000000Z",
    "phones": [
      {
        "id": 1,
        "kontak_id": 1,
        "jenis": "HP",
        "nomor_telepon": "08123456789",
        "created_at": "2026-09-14T08:37:46.000000Z",
        "updated_at": "2026-09-14T08:37:46.000000Z"
      },
      {
        "id": 2,
        "kontak_id": 1,
        "jenis": "Rumah",
        "nomor_telepon": "02158123456",
        "created_at": "2026-09-14T08:37:46.000000Z",
        "updated_at": "2026-09-14T08:37:46.000000Z"
      },
      {
        "id": 3,
        "kontak_id": 1,
        "jenis": "Kantor",
        "nomor_telepon": "02170123456",
        "created_at": "2026-09-14T08:37:46.000000Z",
        "updated_at": "2026-09-14T08:37:46.000000Z"
      }
    ]
  }
}
```

- **Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "nama": ["Nama harus diisi"]
  }
}
```

---

#### 6. Get Single Contact
- **Endpoint:** `GET /api/kontak/{id}`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **URL Parameters:** 
  - `id` (integer) - Contact ID

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Contact retrieved successfully",
  "data": {
    "id": 1,
    "nama": "Budi Santoso",
    "alamat": "Denpasar, Bali",
    "tanggal_lahir": "2000-01-15",
    "created_at": "2026-09-14T08:37:46.000000Z",
    "updated_at": "2026-09-14T08:37:46.000000Z",
    "phones": [
      {
        "id": 1,
        "kontak_id": 1,
        "jenis": "HP",
        "nomor_telepon": "08123456789",
        "created_at": "2026-09-14T08:37:46.000000Z",
        "updated_at": "2026-09-14T08:37:46.000000Z"
      }
    ]
  }
}
```

- **Error Response (404):**
```json
{
  "success": false,
  "message": "Contact not found"
}
```

---

#### 7. Update Contact
- **Endpoint:** `PUT /api/kontak/{id}`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **URL Parameters:**
  - `id` (integer) - Contact ID
- **Request Body:**
```json
{
  "nama": "Budi Santoso Updated",
  "alamat": "Jakarta, Indonesia",
  "tanggal_lahir": "2000-01-15",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08987654321"
    }
  ]
}
```

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Contact updated successfully",
  "data": {
    "id": 1,
    "nama": "Budi Santoso Updated",
    "alamat": "Jakarta, Indonesia",
    "tanggal_lahir": "2000-01-15",
    "created_at": "2026-09-14T08:37:46.000000Z",
    "updated_at": "2026-09-14T08:39:12.000000Z",
    "phones": [
      {
        "id": 4,
        "kontak_id": 1,
        "jenis": "HP",
        "nomor_telepon": "08987654321",
        "created_at": "2026-09-14T08:39:12.000000Z",
        "updated_at": "2026-09-14T08:39:12.000000Z"
      }
    ]
  }
}
```

---

#### 8. Delete Contact
- **Endpoint:** `DELETE /api/kontak/{id}`
- **Authentication:** Required (Bearer Token)
- **Headers:** `Authorization: Bearer {token}`
- **URL Parameters:**
  - `id` (integer) - Contact ID
- **Request Body:** None

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

- **Error Response (404):**
```json
{
  "success": false,
  "message": "Contact not found"
}
```

---

## 🧪 Testing with Postman or Thunder Client

### Step 1: Import Collection (Optional)

You can manually add requests or import from collection.

### Step 2: Get Authentication Token

1. **Register a new user:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/api/register`
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login to get token:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/api/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Copy the `token` value from response

### Step 3: Set Authorization Header

For all protected endpoints, add header:
```
Authorization: Bearer <your_token_here>
```

In Postman:
- Go to "Headers" tab
- Add key: `Authorization`
- Add value: `Bearer <your_token_here>`

In Thunder Client:
- Go to "Auth" tab
- Select "Bearer"
- Paste your token

### Step 4: Test Endpoints

#### Test Create Contact
- **Method:** POST
- **URL:** `http://127.0.0.1:8000/api/kontak`
- **Body (JSON):**
```json
{
  "nama": "Ahmad Wijaya",
  "alamat": "Surabaya, Jawa Timur",
  "tanggal_lahir": "1995-05-20",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08523456789"
    },
    {
      "jenis": "Rumah",
      "nomor_telepon": "03122334455"
    }
  ]
}
```

#### Test Get All Contacts
- **Method:** GET
- **URL:** `http://127.0.0.1:8000/api/kontak`
- **Body:** None

#### Test Get Single Contact
- **Method:** GET
- **URL:** `http://127.0.0.1:8000/api/kontak/1`
- **Body:** None

#### Test Update Contact
- **Method:** PUT
- **URL:** `http://127.0.0.1:8000/api/kontak/1`
- **Body (JSON):**
```json
{
  "nama": "Ahmad Wijaya Updated",
  "alamat": "Bandung, Jawa Barat",
  "tanggal_lahir": "1995-05-20",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08523999999"
    }
  ]
}
```

#### Test Delete Contact
- **Method:** DELETE
- **URL:** `http://127.0.0.1:8000/api/kontak/1`
- **Body:** None

#### Test Logout
- **Method:** POST
- **URL:** `http://127.0.0.1:8000/api/logout`
- **Body:** Empty JSON `{}`

---

## 📊 Validation Rules

### Register Request
- `name`: Required, string, max 255 characters
- `email`: Required, email, unique in users table
- `password`: Required, string, minimum 6 characters

### Login Request
- `email`: Required, valid email format
- `password`: Required, string

### Create/Update Contact Request
- `nama`: Required, string, max 255 characters
- `alamat`: Optional, string
- `tanggal_lahir`: Optional, valid date format (YYYY-MM-DD)
- `phones`: Optional, array of phone objects
  - `phones.*.jenis`: Required if phones array provided, string, max 50 characters
  - `phones.*.nomor_telepon`: Required if phones array provided, string, max 20 characters

---

## 🔒 Error Handling

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "message": "The given data was invalid.",
  "errors": { ... }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Login failed",
  "errors": { ... }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Contact not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to [operation]",
  "error": "Error details"
}
```

---

## 💡 Code Quality Features

✅ **Eager Loading** - Prevents N+1 queries using `with('phones')`
✅ **Form Request Validation** - Dedicated validation classes for each request
✅ **Clean JSON Responses** - Consistent response format with success/message/data
✅ **Error Handling** - Try-catch blocks in all controller methods
✅ **Relationship Management** - Proper Eloquent relationships between models
✅ **Cascade Delete** - Foreign key constraint deletes child phones when contact deleted
✅ **Laravel Best Practices** - Follows Laravel conventions and patterns
✅ **Comments** - Important logic documented with comments

---

## 📁 Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php        # Authentication logic
│   │   └── ContactController.php     # Contact CRUD operations
│   └── Requests/
│       ├── RegisterUserRequest.php   # Register validation
│       ├── LoginUserRequest.php      # Login validation
│       ├── StoreContactRequest.php   # Create contact validation
│       └── UpdateContactRequest.php  # Update contact validation
└── Models/
    ├── Contact.php                   # Contact model with relationships
    └── ContactPhone.php              # ContactPhone model
database/
└── migrations/
    ├── 2026_09_14_082512_create_contacts_table.php
    └── 2026_09_14_082520_create_contact_phones_table.php
routes/
└── api.php                           # API route definitions
```

---

## 🎯 Quick Start

1. **Server is already running on:** `http://127.0.0.1:8000`

2. **Register a user:**
   ```
   POST http://127.0.0.1:8000/api/register
   ```

3. **Login to get token:**
   ```
   POST http://127.0.0.1:8000/api/login
   ```

4. **Use token to access protected routes:**
   ```
   GET http://127.0.0.1:8000/api/kontak
   Authorization: Bearer <your_token>
   ```

---

## 📞 Support

For issues or questions, refer to:
- Laravel Documentation: https://laravel.com/docs/11.x
- Laravel Sanctum: https://laravel.com/docs/11.x/sanctum
- Eloquent ORM: https://laravel.com/docs/11.x/eloquent
