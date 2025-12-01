# Step 2: Authentication Flow - Implementation Guide

## What We've Built

### 1. **AuthContext** (`context/AuthContext.jsx`)
- Centralized authentication state management using React Context API
- Tracks: `user`, `loading`, `error`, `isAuthenticated`
- Methods:
  - `login(username, password)` - Authenticates user
  - `logout()` - Logs out user
  - `checkAuthStatus()` - Runs on app load to check existing session

### 2. **Custom Hook** (`hooks/useAuth.js`)
- `useAuth()` - Access auth state and methods from any component
- Usage: `const { user, login, logout, isAuthenticated } = useAuth()`

### 3. **Login Component** (`components/Login.jsx`)
- Form to collect username and password
- Validates inputs before submission
- Shows loading state during login
- Displays error messages
- Redirects to home page on success

### 4. **Protected Route Component** (`components/ProtectedRoute.jsx`)
- Wraps routes that require authentication
- Redirects to login if user not authenticated
- Shows loading state during auth check

### 5. **User Profile Component** (`components/UserProfile.jsx`)
- Displays logged-in username
- Logout button
- Only shown when authenticated

### 6. **Updated App.jsx**
- Integrated React Router for navigation
- Setup routing structure:
  - `/login` - Public login page
  - `/` - Protected home page

### 7. **Updated main.jsx**
- Wrapped app with `AuthProvider` to enable auth context globally

## How the Authentication Flow Works

```
User Visit App
      ↓
AuthProvider initializes → Checks if session exists
      ↓
If session exists → Load user data → Show app
If no session → Show login page
      ↓
User enters credentials
      ↓
Login request sent to /api-auth/login/
      ↓
Django validates credentials + creates session cookie
      ↓
Axios automatically sends session cookie with future requests (withCredentials: true)
      ↓
User redirected to home page
      ↓
Home page is protected - only accessible if isAuthenticated = true
```

## Key Learning Points: Decoupled Architecture

### Backend (Django) Responsibilities
- Authenticate users (validate credentials)
- Create/manage sessions
- Protect API endpoints with permissions

### Frontend (React) Responsibilities
- Collect user input (login form)
- Store auth state (user info, loading, errors)
- Control navigation (show login vs app based on auth)
- Attach credentials to requests (handled by Axios)

### Communication (HTTP Requests)
- Login: POST `/api-auth/login/` with username/password
- Session: Sent automatically in cookies (withCredentials: true)
- Logout: POST `/api-auth/logout/`

## Testing the Setup

### Prerequisites
1. Django server running: `python manage.py runserver`
2. React dev server running: `npm run dev`
3. CORS configured on backend (already done ✓)

### Testing Steps
1. Open http://localhost:5173 in browser
2. You should be redirected to `/login`
3. Create a test user in Django admin or via Django shell:
   ```bash
   python manage.py createsuperuser
   # or
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> User.objects.create_user('testuser', 'test@example.com', 'password123')
   ```
4. Login with credentials
5. You should see the home page with snippet list
6. Check browser DevTools → Application → Cookies to see session cookie
7. Click Logout to test logout flow

## Common Issues & Solutions

### Issue: Login fails with "Login failed"
- **Cause**: Django server not running or CORS not configured
- **Solution**: 
  1. Start Django: `python manage.py runserver`
  2. Check `settings.py` CORS_ALLOWED_ORIGINS includes your React URL

### Issue: Can't reach /api-auth/login/
- **Cause**: Login endpoint requires Django REST Framework browsable API
- **Solution**: Check that `rest_framework` is in INSTALLED_APPS

### Issue: Session not persisting after page refresh
- **Cause**: Session cookie not being sent with requests
- **Solution**: Axios client has `withCredentials: true` (already set ✓)

## Next: Step 3 - Create Snippet List Page with Pagination
- Fetch and display snippets with pagination controls
- Implement search/filter functionality
- Add buttons for CRUD operations

## File Structure
```
frontend/src/
├── api/
│   ├── auth.js          (auth endpoints)
│   ├── client.js        (axios instance)
│   ├── snippet.js       (snippet endpoints)
│   └── users.js         (user endpoints)
├── components/
│   ├── Login.jsx        (login form)
│   ├── Auth.css         (auth styling)
│   ├── ProtectedRoute.jsx (route protection)
│   ├── UserProfile.jsx  (user profile & logout)
│   └── UserProfile.css  (profile styling)
├── context/
│   └── AuthContext.jsx  (auth state management)
├── hooks/
│   └── useAuth.js       (auth custom hook)
├── App.jsx              (router setup)
├── main.jsx             (app entry point)
└── App.css              (app styling)
```
