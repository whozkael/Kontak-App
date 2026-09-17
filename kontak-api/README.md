# Contact Management REST API

> A complete, production-ready REST API backend for Contact Management Application built with **Laravel 11** and **Laravel Sanctum**.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Documentation](#documentation)

---

## 🎯 Overview

This is a complete REST API for managing contacts and their phone numbers. It includes:

- ✅ User authentication with Laravel Sanctum
- ✅ Token-based API authorization
- ✅ Contact CRUD operations
- ✅ Phone number management
- ✅ Form request validation
- ✅ Error handling
- ✅ Eager loading for performance
- ✅ Clean JSON responses

**Technology Stack:**
- Laravel Framework 11.56.1
- PHP 8.5.10
- SQLite Database
- Laravel Sanctum (Token Authentication)
- Composer (Dependency Management)

---

## ✨ Features

### Authentication
- User registration with email validation
- Secure password hashing
- Token-based API authentication using Laravel Sanctum
- Logout with token invalidation

### Contact Management
- Create contacts with multiple phone numbers
- Retrieve all contacts or specific contact details
- Update contact information and phone numbers
- Delete contacts (cascade delete for related phones)
- Eager loading to prevent N+1 queries

### Data Validation
- Dedicated Form Request classes
- Custom validation messages in Indonesian
- Input validation at the application level
- Meaningful error responses

### Error Handling
- Graceful error responses with JSON format
- Validation error messages
- Authentication error handling
- Not found error handling

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.5.10 ✅
- Composer ✅
- Laravel 11.56.1 ✅
- SQLite Database ✅

### Installation

1. **Navigate to project directory:**
   ```bash
   cd "c:\Users\ayuci\SEMESTER 3\Pemrograman Internet\kontak-api"
   ```

2. **Run migrations (already done):**
   ```bash
   php artisan migrate
   ```

3. **Start development server:**
   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

4. **Server will be available at:**
   ```
   http://127.0.0.1:8000
   ```

### First API Call

**Register a user:**
```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login and get token:**
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Use token to create contact:**
```bash
curl -X POST http://127.0.0.1:8000/api/kontak \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Santoso",
    "alamat": "Denpasar, Bali",
    "tanggal_lahir": "2000-01-15",
    "phones": [
      {
        "jenis": "HP",
        "nomor_telepon": "08123456789"
      }
    ]
  }'
```

---

## 📚 API Endpoints

### Base URL
```
http://127.0.0.1:8000/api
```

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get token |

### Contacts (Protected with `auth:sanctum`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kontak` | Get all contacts |
| POST | `/kontak` | Create new contact |
| GET | `/kontak/{id}` | Get single contact |
| PUT | `/kontak/{id}` | Update contact |
| DELETE | `/kontak/{id}` | Delete contact |
| POST | `/logout` | Logout (invalidate token) |

---

## 🗄️ Database Schema

### kontak (Contacts Table)
```
+---------------+----------+
| Column        | Type     |
+---------------+----------+
| id            | BIGINT   |
| nama          | VARCHAR  |
| alamat        | TEXT     |
| tanggal_lahir | DATE     |
| created_at    | TIMESTAMP|
| updated_at    | TIMESTAMP|
+---------------+----------+
```

### kontak_phones (Phone Numbers Table)
```
+---------------+----------+
| Column        | Type     |
+---------------+----------+
| id            | BIGINT   |
| kontak_id     | BIGINT   | ← Foreign Key (kontak.id)
| jenis         | VARCHAR  |
| nomor_telepon | VARCHAR  |
| created_at    | TIMESTAMP|
| updated_at    | TIMESTAMP|
+---------------+----------+
```

**Relationship:** One Contact → Many Phone Numbers

---

## 📁 Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php           # Authentication logic
│   │   └── ContactController.php        # Contact CRUD operations
│   └── Requests/
│       ├── RegisterUserRequest.php      # Register validation
│       ├── LoginUserRequest.php         # Login validation
│       ├── StoreContactRequest.php      # Create contact validation
│       └── UpdateContactRequest.php     # Update contact validation
└── Models/
    ├── User.php                         # User model
    ├── Contact.php                      # Contact model with relationships
    └── ContactPhone.php                 # ContactPhone model

database/
└── migrations/
    ├── 2026_09_14_082512_create_contacts_table.php
    └── 2026_09_14_082520_create_contact_phones_table.php

routes/
└── api.php                              # API route definitions
```

---

## 🧪 Testing

**Complete documentation for testing is available in:**
- `TESTING_GUIDE.md` - Detailed testing instructions
- `API_DOCUMENTATION.md` - Full API reference
- `Postman_Collection.json` - Import this file into Postman

### Using Postman

1. **Import Collection:**
   - Open Postman
   - File → Import
   - Select `Postman_Collection.json`

2. **Run Requests:**
   - Register user
   - Login (token auto-saved)
   - Create contact (ID auto-saved)
   - Test other endpoints

### Using Thunder Client

Follow the same pattern as Postman. See `TESTING_GUIDE.md` for detailed steps.

---

## ✅ Code Quality

### Best Practices Implemented

✅ **Form Request Validation**
- Dedicated validation classes
- Custom error messages
- Reusable validation logic

✅ **Eloquent Relationships**
- Proper model relationships
- Eager loading with `with('phones')`
- Prevents N+1 query problems

✅ **Error Handling**
- Try-catch blocks in controllers
- Meaningful error messages
- Proper HTTP status codes

✅ **Clean Code**
- Clear separation of concerns
- Comments on important logic
- Consistent naming conventions

✅ **Database Design**
- Proper foreign keys
- Cascade delete for data integrity
- Appropriate data types

✅ **API Design**
- RESTful conventions
- Consistent JSON responses
- Proper HTTP methods
- Meaningful status codes

---

## 📖 Documentation Files

The following documentation files are included:

1. **`API_DOCUMENTATION.md`** - Complete API reference with all endpoints, examples, and validation rules
2. **`TESTING_GUIDE.md`** - How to test with Postman, Thunder Client, cURL, and troubleshooting
3. **`README.md`** (this file) - Project overview and quick start guide
4. **`Postman_Collection.json`** - Import this to Postman for ready-to-use requests

---

## 🎓 Implementation Summary

✅ **Database Setup**
- Migrations for kontak and kontak_phones tables
- Proper relationships and constraints

✅ **Model Layer**
- Contact model with hasMany relationship
- ContactPhone model with belongsTo relationship
- Fillable properties configured

✅ **Validation Layer**
- 4 dedicated Form Request classes
- Custom validation messages in Indonesian
- Comprehensive input validation

✅ **API Layer**
- AuthController with register, login, logout
- ContactController with CRUD operations
- Eager loading for performance
- Proper HTTP status codes

✅ **Route Configuration**
- Public routes for authentication
- Protected routes with auth:sanctum middleware
- RESTful routing conventions

✅ **Testing**
- Postman collection included
- Detailed testing guide
- Complete API documentation

---

## 🚀 Server Status

**Development Server:** `http://127.0.0.1:8000`

Server is running and ready for API requests!

---

## 📞 Support

For detailed information, see:
- `API_DOCUMENTATION.md` - API reference
- `TESTING_GUIDE.md` - Testing instructions
- Laravel Docs: https://laravel.com/docs/11.x
- Laravel Sanctum: https://laravel.com/docs/11.x/sanctum

---

**This project is ready for production use and follows all Laravel best practices.** 🎯
