# Testing Guide - Contact Management REST API

## 🚀 Quick Start Testing

**Server URL:** `http://127.0.0.1:8000/api`

**Environment:** Laravel 11 with Laravel Sanctum authentication

---

## 📋 Prerequisites

Before testing, ensure:
1. ✅ Laravel development server is running on `http://127.0.0.1:8000`
2. ✅ Database migrations have been executed
3. ✅ You have Postman or Thunder Client installed

---

## 🔧 Option 1: Using Postman

### Step 1: Import Collection

1. Open Postman
2. Click **"File"** → **"Import"**
3. Select **`Postman_Collection.json`** from the project root
4. Click **"Import"**

The collection will be imported with:
- ✅ All endpoints pre-configured
- ✅ Environment variables for token management
- ✅ Automatic token extraction after login
- ✅ Proper headers and authentication setup

### Step 2: Create Environment (Optional but Recommended)

1. Click **"Environments"** in left sidebar
2. Click **"+"** to create new environment
3. Add variables:
   ```
   token: (empty - will be auto-filled after login)
   contact_id: (empty - will be auto-filled after create)
   user_id: (empty - will be auto-filled after login)
   ```
4. Click **"Save"**
5. Select this environment from the dropdown in top-right

### Step 3: Run Tests in Order

#### Test Sequence:

**1. Register User**
- Go to **Authentication → Register User**
- Click **Send**
- Response shows: User ID, name, email

**2. Login User**
- Go to **Authentication → Login User**
- Update email/password if needed (must match registered user)
- Click **Send**
- ✅ Token is automatically saved to environment variable `{{token}}`
- Response shows: User data and access token

**3. Create Contact**
- Go to **Contacts → Create Contact**
- Review/modify the request body with contact details
- Click **Send**
- ✅ Contact ID is automatically saved to `{{contact_id}}`
- Response shows: New contact with ID and phone numbers

**4. Get All Contacts**
- Go to **Contacts → Get All Contacts**
- Click **Send**
- Response shows: Array of all contacts with their phones

**5. Get Single Contact**
- Go to **Contacts → Get Single Contact**
- Uses `{{contact_id}}` from step 3
- Click **Send**
- Response shows: Single contact details

**6. Update Contact**
- Go to **Contacts → Update Contact**
- Modify request body as needed
- Click **Send**
- Response shows: Updated contact

**7. Delete Contact**
- Go to **Contacts → Delete Contact**
- Click **Send**
- Response shows: Success message

**8. Logout User**
- Go to **Authentication → Logout User**
- Click **Send**
- Token is invalidated

---

## 🔨 Option 2: Using Thunder Client

### Step 1: Import Collection

Thunder Client doesn't have a built-in import from JSON, so we'll create requests manually:

### Step 2: Create Requests

Follow the structure in [Complete API Endpoint List](#complete-api-endpoint-list) section below.

### Step 3: Test Workflow

1. **Register first** - Create an account
2. **Login** - Get token
3. **Copy token** - You'll need it for protected routes
4. **Add Authorization header** to all protected routes:
   ```
   Authorization: Bearer <your_token_here>
   ```

---

## 📝 Complete API Endpoint List

### PUBLIC ROUTES (No Authentication Required)

#### 1. Register User
```
POST http://127.0.0.1:8000/api/register

Headers:
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
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

#### 2. Login User
```
POST http://127.0.0.1:8000/api/login

Headers:
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
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

⚠️ COPY THE TOKEN FROM THIS RESPONSE - YOU'LL NEED IT FOR ALL PROTECTED ROUTES
```

---

### PROTECTED ROUTES (Requires Bearer Token Authentication)

**All requests below require this header:**
```
Authorization: Bearer <token_from_login>
```

#### 3. Get All Contacts
```
GET http://127.0.0.1:8000/api/kontak

Headers:
  Authorization: Bearer <your_token>
  Accept: application/json

Body: (empty)

Response (200):
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

#### 4. Create Contact
```
POST http://127.0.0.1:8000/api/kontak

Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
  Accept: application/json

Body (JSON):
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
    },
    {
      "jenis": "Kantor",
      "nomor_telepon": "03122334466"
    }
  ]
}

Response (201):
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": 2,
    "nama": "Ahmad Wijaya",
    "alamat": "Surabaya, Jawa Timur",
    "tanggal_lahir": "1995-05-20",
    "created_at": "2026-09-14T08:40:30.000000Z",
    "updated_at": "2026-09-14T08:40:30.000000Z",
    "phones": [
      {
        "id": 5,
        "kontak_id": 2,
        "jenis": "HP",
        "nomor_telepon": "08523456789",
        "created_at": "2026-09-14T08:40:30.000000Z",
        "updated_at": "2026-09-14T08:40:30.000000Z"
      },
      {
        "id": 6,
        "kontak_id": 2,
        "jenis": "Rumah",
        "nomor_telepon": "03122334455",
        "created_at": "2026-09-14T08:40:30.000000Z",
        "updated_at": "2026-09-14T08:40:30.000000Z"
      },
      {
        "id": 7,
        "kontak_id": 2,
        "jenis": "Kantor",
        "nomor_telepon": "03122334466",
        "created_at": "2026-09-14T08:40:30.000000Z",
        "updated_at": "2026-09-14T08:40:30.000000Z"
      }
    ]
  }
}
```

#### 5. Get Single Contact
```
GET http://127.0.0.1:8000/api/kontak/1

Headers:
  Authorization: Bearer <your_token>
  Accept: application/json

Body: (empty)

Response (200):
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

#### 6. Update Contact
```
PUT http://127.0.0.1:8000/api/kontak/1

Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "nama": "Budi Santoso Updated",
  "alamat": "Bandung, Jawa Barat",
  "tanggal_lahir": "2000-01-15",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08999888777"
    }
  ]
}

Response (200):
{
  "success": true,
  "message": "Contact updated successfully",
  "data": {
    "id": 1,
    "nama": "Budi Santoso Updated",
    "alamat": "Bandung, Jawa Barat",
    "tanggal_lahir": "2000-01-15",
    "created_at": "2026-09-14T08:37:46.000000Z",
    "updated_at": "2026-09-14T08:41:15.000000Z",
    "phones": [
      {
        "id": 8,
        "kontak_id": 1,
        "jenis": "HP",
        "nomor_telepon": "08999888777",
        "created_at": "2026-09-14T08:41:15.000000Z",
        "updated_at": "2026-09-14T08:41:15.000000Z"
      }
    ]
  }
}
```

#### 7. Delete Contact
```
DELETE http://127.0.0.1:8000/api/kontak/1

Headers:
  Authorization: Bearer <your_token>
  Accept: application/json

Body: (empty)

Response (200):
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

#### 8. Logout User
```
POST http://127.0.0.1:8000/api/logout

Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{}

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🧪 Common Test Scenarios

### Scenario 1: Full Contact Workflow

1. **Register** → Get user ID
2. **Login** → Get token
3. **Create Contact** → Add multiple phones
4. **Get All Contacts** → Verify contact exists
5. **Get Single Contact** → View details
6. **Update Contact** → Modify data
7. **Delete Contact** → Remove from database
8. **Logout** → Invalidate token

### Scenario 2: Error Handling Tests

**Test validation errors:**
```
POST http://127.0.0.1:8000/api/kontak
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": ""  // Empty string - should fail validation
}

Expected Response (422):
{
  "message": "The given data was invalid.",
  "errors": {
    "nama": ["Nama harus diisi"]
  }
}
```

**Test authentication errors:**
```
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}

Expected Response (401):
{
  "success": false,
  "message": "Login failed",
  "errors": {
    "email": ["Email atau password tidak valid."]
  }
}
```

**Test not found errors:**
```
GET http://127.0.0.1:8000/api/kontak/999
Authorization: Bearer <token>

Expected Response (404):
{
  "success": false,
  "message": "Contact not found"
}
```

### Scenario 3: Multiple Phones Test

```
POST http://127.0.0.1:8000/api/kontak
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "Multi Phone Test",
  "alamat": "Test Address",
  "tanggal_lahir": "1990-01-01",
  "phones": [
    {
      "jenis": "HP",
      "nomor_telepon": "08111111111"
    },
    {
      "jenis": "Rumah",
      "nomor_telepon": "02111111111"
    },
    {
      "jenis": "Kantor",
      "nomor_telepon": "02222222222"
    },
    {
      "jenis": "Fax",
      "nomor_telepon": "02233333333"
    }
  ]
}

Response will contain all 4 phone numbers associated with the contact
```

---

## ✅ Validation Rules Reference

### Register/Login Validation
- `name`: Required, string, max 255 chars
- `email`: Required, valid email, unique (for registration)
- `password`: Required, min 6 chars

### Contact Validation
- `nama`: Required, string, max 255 chars
- `alamat`: Optional, string, any length
- `tanggal_lahir`: Optional, valid date (YYYY-MM-DD)
- `phones`: Optional, array of phone objects
  - `jenis`: Required if phones provided, string, max 50 chars
  - `nomor_telepon`: Required if phones provided, string, max 20 chars

---

## 🐛 Troubleshooting

### Issue: "Unauthenticated" error on protected routes
**Solution:** 
- Make sure you've logged in and got a token
- Add `Authorization: Bearer <token>` header
- Check token is valid (not expired/invalidated by logout)

### Issue: Validation errors 422
**Solution:**
- Check request body matches validation rules
- Ensure required fields are present
- Verify data types (strings, dates, etc.)

### Issue: "Contact not found" 404
**Solution:**
- Make sure contact ID exists
- Check you're using the correct contact ID
- Try listing all contacts to see valid IDs

### Issue: Connection refused
**Solution:**
- Verify server is running: `php artisan serve`
- Check URL is correct: `http://127.0.0.1:8000`
- Check port 8000 is available (not in use)

---

## 📚 Additional Resources

- Full API Documentation: See `API_DOCUMENTATION.md`
- Laravel Sanctum: https://laravel.com/docs/11.x/sanctum
- Postman Docs: https://learning.postman.com/
- Thunder Client: https://www.thunderclient.com/

