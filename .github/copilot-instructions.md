# Copilot Instructions for Pastebin Project

## Project Overview
A full-stack Django REST Framework + React web application for sharing code snippets. The backend provides APIs for CRUD operations on snippets with syntax highlighting and user authentication. The frontend is a React + Vite SPA with session-based authentication and real-time snippet management.

## Architecture

### Backend Stack
- **Django 5.2** with Django REST Framework (DRF)
- **SQLite** database (development)
- **Session-based authentication** via DRF's built-in `/api-auth/` endpoints
- **CORS enabled** for localhost:3000 and localhost:5173 (Vite default)
- **Routing**: Defined in `config/urls.py` → includes `snippets/urls.py` with DefaultRouter

### Frontend Stack
- **React 19** + **Vite** (fast dev server with HMR)
- **Axios** for HTTP requests with centralized client in `api/client.js`
- **React Router v7** for navigation
- **React Context API** for auth state management (no Redux)
- **Session cookies** automatically managed by browser; CSRF tokens handled by Axios interceptor

## Data Flow

### Authentication Flow
1. User submits login form → `login()` in `api/auth.js`
2. POST to `/api-auth/login/` with form-encoded credentials
3. Django validates and creates session cookie
4. Axios client has `withCredentials: true` → cookie auto-attached to future requests
5. Frontend checks session via `getCurrentUser()` on app load to restore auth state
6. Protected routes check `isAuthenticated` flag from AuthContext

### Snippet CRUD Flow
1. Frontend fetches snippets via Axios to `/snippets/` (GET)
2. `SnippetViewSet` applies `IsOwnerOrReadOnly` permission + `IsAuthenticatedOrReadOnly`
3. On create: POST triggers `perform_create()` which sets `owner=request.user`
4. Snippet model's `save()` method auto-generates highlighted HTML via Pygments
5. Highlight endpoint at `/snippets/{id}/highlight/` returns pre-rendered HTML

## Key Patterns & Conventions

### Backend (Django/DRF)

**Permissions**: Custom `IsOwnerOrReadOnly` in `snippets/permissions.py`
- SAFE_METHODS (GET, HEAD, OPTIONS): Allow all authenticated users
- Write methods: Owner only

**ViewSet Pattern**: `SnippetViewSet` extends `ModelViewSet`
- Auto-generates routes: `/snippets/`, `/snippets/{id}/`, `/snippets/{id}/highlight/`
- Custom action `@action(detail=True)` for `/highlight/` endpoint
- `perform_create()` override sets owner automatically

**Serializers**: Use `HyperlinkedModelSerializer` for consistency
- Read-only fields: `owner` (serialized as username), `highlight` (hyperlinked)
- Foreign key relationships use `HyperlinkedRelatedField` for cleaner API

**Model Patterns**: 
- Models auto-set timestamps: `created = models.DateTimeField(auto_now_add=True)`
- FK to User: `owner = models.ForeignKey('auth.User', ...)`
- Override `save()` for side effects (e.g., Pygments highlighting)

### Frontend (React)

**Auth Context**: `context/AuthContext.jsx` + provider in `main.jsx`
- Exposes: `user`, `isAuthenticated`, `loading`, `error`
- Methods: `login(username, password)`, `logout()`, `checkAuthStatus()`
- Runs `checkAuthStatus()` on app mount to restore session

**Custom Hook**: `useAuth()` in `hooks/useAuth.js`
- Provides auth state/methods to any component: `const { user, login, logout } = useAuth()`

**Axios Interceptors**: `api/client.js`
- Automatically adds CSRF token to POST/PUT/PATCH/DELETE requests
- `withCredentials: true` ensures session cookies sent with every request
- One-time CSRF fetch on first non-GET request

**Protected Routes**: `ProtectedRoute.jsx`
- Checks `isAuthenticated` before rendering
- Redirects to `/login` if not authenticated

**API Layer**: Separate files per resource
- `api/auth.js`: login, logout, getCurrentUser, register
- `api/snippet.js`: snippet CRUD operations
- `api/users.js`: user data operations
- All use centralized `client` instance

## Development Workflow

### Starting the Project
```bash
# Backend
python manage.py migrate              # Initialize DB
python manage.py runserver            # Runs on http://localhost:8000

# Frontend (in /frontend directory)
npm install                           # Install deps once
npm run dev                           # Runs on http://localhost:5173
```

### Database Operations
- Migrations: `python manage.py makemigrations snippets` → `migrate`
- Shell access: `python manage.py shell`
- Admin: Create superuser with `createsuperuser`, access at `/admin/`

### Adding API Endpoints
1. Update `Snippet` model in `snippets/models.py` if needed
2. Add serializer fields in `snippets/serializers.py`
3. Add ViewSet method/action in `snippets/views.py`
4. Routes auto-register via `DefaultRouter` in `snippets/urls.py`

### Adding Frontend Pages
1. Create component in `components/`
2. Import in `App.jsx` and add Route
3. Use `useAuth()` hook to access auth state
4. Use Axios client from `api/` for API calls

## Common Pitfalls

- **CSRF Failures**: Ensure `fetchCsrfToken()` is called before POST/PUT/PATCH/DELETE. Interceptor handles this, but only on non-GET methods.
- **Missing CORS**: Frontend URLs must be in `CORS_ALLOWED_ORIGINS` in settings.py
- **Session Not Persisting**: Must set `withCredentials: true` in Axios (already done in `client.js`)
- **Redirects on Login**: `/api-auth/login/` returns 302 redirect on success; wrapped in `try/catch` to handle as success
- **Highlighted Field Read-Only**: `highlighted` is auto-generated in `Snippet.save()`; don't try to set it directly

## Testing & Debugging

**Django Admin**: http://localhost:8000/admin/
- Create users, view snippets, test permissions

**DRF Browsable API**: http://localhost:8000/
- Test endpoints directly with forms
- See response details and permissions

**React DevTools**: Check auth state in context, component tree
- Verify `isAuthenticated` flag updates on login/logout

**Network Tab**: Inspect session cookie
- Look for `sessionid` in cookies tab
- Verify CSRF token in request headers (X-CSRFToken)

## File Structure Reference

```
Backend:
  snippets/
    models.py         → Snippet model, Pygments highlighting
    serializers.py    → HyperlinkedModelSerializer for Snippet/User
    views.py          → SnippetViewSet (main API logic)
    permissions.py    → IsOwnerOrReadOnly custom permission
    urls.py           → DefaultRouter registration
  config/
    settings.py       → CORS, REST_FRAMEWORK config, auth backends

Frontend:
  src/
    context/
      AuthContext.jsx → Auth state & methods provider
    hooks/
      useAuth.js      → Custom hook to access auth
    api/
      client.js       → Axios instance with interceptors
      auth.js         → login, logout, getCurrentUser
    components/
      ProtectedRoute.jsx → Auth check wrapper
```

## External Dependencies

**Backend**: Django, Django REST Framework, django-cors-headers, Pygments
**Frontend**: React, React Router, Axios

Review `pyproject.toml` and `frontend/package.json` for exact versions and new additions.
