# KontakApp - Frontend React Application

Modern SaaS-style contact management dashboard built with React, TypeScript, and Tailwind CSS. A premium interface for the Laravel Contact Management REST API.

## 🎨 Features

- **Modern SaaS Dashboard**: Clean, professional interface inspired by Linear, Notion, and Vercel
- **Authentication**: Secure login and registration with token-based auth
- **Contact Management**: Create, read, update, and delete contacts with multiple phone numbers
- **Real-time Search**: Filter contacts by name instantly
- **Responsive Design**: Mobile-first approach, works seamlessly on all devices
- **Dark Mode Ready**: Tailwind CSS foundation for easy theme switching
- **Smooth Animations**: Professional transitions and loading states
- **Type-Safe**: Full TypeScript support for enhanced developer experience

## 🚀 Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.3.6
- **Routing**: React Router v6.20.0
- **State Management**: Zustand 4.4.0
- **HTTP Client**: Axios 1.6.0
- **Icons**: Lucide React 0.290.0
- **Notifications**: React Hot Toast 2.4.1

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Laravel backend running on `http://127.0.0.1:8000`

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd kontak-app

# Install dependencies
npm install
```

### 2. Configure Environment (Optional)

The application is pre-configured to connect to `http://127.0.0.1:8000/api`. If your Laravel backend is on a different port, update the API configuration:

Edit [src/api/axios.ts](src/api/axios.ts):
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api'  // Change this if needed
```

## 🏃 Running the Application

### Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Output files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
kontak-app/
├── public/              # Static assets
│   └── index.html      # HTML entry point
├── src/
│   ├── api/            # API integration layer
│   │   ├── axios.ts    # Axios instance with interceptors
│   │   ├── auth.ts     # Authentication endpoints
│   │   └── contacts.ts # Contact management endpoints
│   ├── components/     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.tsx # Authentication hook
│   │   └── useContacts.ts # Contacts management hook
│   ├── layouts/        # Layout components
│   │   └── MainLayout.tsx # Navigation and layout wrapper
│   ├── pages/          # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ContactsPage.tsx
│   │   └── ContactFormPage.tsx
│   ├── store/          # Zustand stores
│   │   ├── authStore.ts
│   │   └── contactsStore.ts
│   ├── utils/          # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx         # Main App component with routing
│   ├── main.tsx        # React DOM render entry point
│   └── index.css       # Global styles and Tailwind
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔗 API Connection

The frontend connects to the Laravel backend API at `http://127.0.0.1:8000/api`.

### Authentication Flow

1. **Register**: `POST /api/register`
   - Creates new user account
   - Returns user data and authentication token

2. **Login**: `POST /api/login`
   - Authenticates user with email and password
   - Returns user data and authentication token

3. **Token Management**:
   - Token is stored in localStorage
   - Automatically added to Authorization header for all requests
   - If token expires (401), user is redirected to login

### Contact Operations

- **Get All**: `GET /api/kontak`
- **Get One**: `GET /api/kontak/{id}`
- **Create**: `POST /api/kontak`
- **Update**: `PUT /api/kontak/{id}`
- **Delete**: `DELETE /api/kontak/{id}`

All contact operations require authentication token.

## 🎯 Pages Overview

### Login Page
- Email and password input
- Toggle password visibility
- Demo credentials display
- Link to registration
- Split layout with brand story

### Register Page
- Name, email, password inputs
- Password confirmation
- Form validation
- Link to login
- Features showcase

### Dashboard Page
- Welcome message with user name
- Statistics cards (total contacts, total phones)
- Recent contacts section (3 most recent)
- Quick action buttons
- Responsive grid layout

### Contacts Management Page
- List all contacts in responsive grid
- Real-time search/filter by name
- Contact cards with:
  - Name, address, birth date
  - All phone numbers with types
  - Edit/Delete buttons
- Empty state with call-to-action
- Delete confirmation modal

### Contact Form Page
- Create new or edit existing contact
- Fields:
  - Name (required)
  - Address (optional)
  - Birth Date (optional)
  - Multiple phone numbers with types
- Dynamic phone field management
- Form validation with error messages
- Loading and saving states

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Background**: Slate (#f1f5f9)

### Components
- **Button**: 4 variants (primary, secondary, danger, ghost), 3 sizes (sm, md, lg)
- **Input**: Text fields with labels, error states, and helper text
- **Card**: Base card, StatCard for metrics, ContactCard for contacts
- **Modal**: Confirmation dialogs with loading and danger states
- **Alert**: Info, success, error, and warning messages
- **Spinner**: Loading indicators with multiple sizes

### Animations
- **Fade In**: Element entrance animation
- **Slide Up**: Modal appearance animation
- **Smooth Transitions**: Hover states and interactions

## 🔐 Authentication & Authorization

### Protected Routes
All routes except `/login` and `/register` require authentication.

Protected routes:
- `/` - Dashboard
- `/contacts` - Contact list
- `/contacts/new` - Create contact form
- `/contacts/:id/edit` - Edit contact form

### Token-Based Auth
- Tokens stored in localStorage
- Automatically attached to all API requests
- Auto-logout on token expiration (401 response)

### User Context
- User data available through `useAuth()` hook
- Persistent across page refreshes
- Displayed in navigation bar

## 🧪 Testing the App

### Demo Credentials
```
Email: john@example.com
Password: password123
```

### Test Flow
1. Navigate to http://localhost:5173
2. Register a new account or login with demo credentials
3. View dashboard with statistics
4. Add a new contact with multiple phone numbers
5. Edit or delete existing contacts
6. Search contacts by name
7. Logout

## 🛠️ Development

### Code Style
- ESLint configured for TypeScript
- Prettier setup for consistent formatting
- Tailwind CSS for styling

### Type Safety
- Full TypeScript strict mode
- Typed API responses
- Typed component props

### Path Aliases
```typescript
@ = ./src/  // Import paths like @/components/Button
```

### Hot Module Replacement
Vite provides instant HMR for fast development workflow

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# The build output will be in the dist/ directory
# Deploy the dist/ folder to your hosting provider
```

## 🚀 Deployment

### Prerequisites
- Frontend: Node.js and npm on the server
- Backend: Laravel API accessible from the frontend domain

### Steps
1. Build the project: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure web server to serve SPA (single page application)
4. Update API URL if backend is on different domain

### Example: Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/kontak-app/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🤝 Connection with Laravel Backend

The frontend is designed to work seamlessly with the Laravel Contact Management API:

### Setup Checklist
- [ ] Laravel backend running on http://127.0.0.1:8000
- [ ] Database migrations executed
- [ ] CORS configured in Laravel (allow frontend origin)
- [ ] Environment variables configured

### CORS Configuration (Laravel)
If frontend is on different domain, ensure Laravel has proper CORS setup in `config/cors.php`:

```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

## 📚 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### API Connection Issues
- Verify Laravel backend is running on http://127.0.0.1:8000
- Check CORS settings in Laravel
- Check browser console for error messages
- Verify token is in localStorage (check browser DevTools > Application > Local Storage)

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

## 📖 Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

## 📄 License

This project is part of the Internet Programming course (Semester 3).

## 🎓 Course Information

- **Course**: Pemrograman Internet
- **Semester**: 3
- **Institution**: Bali State Polytechnic
- **Project Type**: Practical Exercise

---

**Made with ❤️ for modern web development**
