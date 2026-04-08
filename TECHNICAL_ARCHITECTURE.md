# Sistem Login RABPro - Dokumentasi Teknis

## Overview

Sistem login baru untuk RABPro Kalkulator menggunakan OAuth 2.0 dengan Google dan GitHub sebagai authentication providers. User dapat menyimpan dan melanjutkan progres perhitungan RAB mereka.

## File-File yang Ditambahkan

### Backend

#### 1. `server.js` (Main Server)
- **Fungsi**: Express.js server dengan Passport OAuth integration
- **Port**: 3000 (default)
- **Dependencies**: 
  - `express` - Web framework
  - `express-session` - Session management
  - `passport` - Authentication middleware
  - `passport-google-oauth20` - Google OAuth strategy
  - `passport-github2` - GitHub OAuth strategy
  - `sqlite3` - Database driver
  - `dotenv` - Environment variables
  - `cors` - Cross-Origin Resource Sharing

**Fitur:**
- ✅ Middleware setup (CORS, JSON, static files, session)
- ✅ Passport OAuth strategies (Google & GitHub)
- ✅ Authentication endpoints (`/auth/google`, `/auth/github`, `/auth/logout`)
- ✅ API endpoints untuk progress management
- ✅ User serialization/deserialization
- ✅ Health check endpoint

#### 2. `db.js` (Database Layer)
- **Lokasi Database**: `rab_calculator.db` (SQLite)
- **Tables**: 
  - `users` - Menyimpan informasi user
  - `user_progress` - Menyimpan progress proyek per user

**Fungsi Utama:**
- `initDatabase()` - Initialize database dan create tables
- `findOrCreateUser(profile, provider)` - Find atau create user dari OAuth profile
- `saveProgress(userId, projectName, data)` - Save/update progress proyek
- `getProgress(userId, projectName)` - Load progress proyek
- `getAllProgress(userId)` - Get semua progress user

### Frontend

#### 3. `pages/login.html` (Halaman Login)
- **UI**: Modern card-based design
- **Fitur**:
  - ✅ Google OAuth button
  - ✅ GitHub OAuth button
  - ✅ Demo mode option (untuk testing)
  - ✅ Auto-redirect ke home jika sudah login
  - ✅ Responsive design untuk mobile

#### 4. `pages/profile.html` (Halaman Profil User)
- **Menampilkan**:
  - Informasi user (nama, email, provider)
  - Tanggal registrasi dan last login
  - Daftar proyek yang tersimpan
  - Option untuk membuka proyek lama
  - Logout button

#### 5. `js/auth.js` (Client-Side Auth Helper)
- **Class**: `AuthManager`
- **Fungsi**:
  - `isAuthenticated()` - Check if user logged in
  - `getUser()` - Get current user
  - `saveProgress(projectName, data)` - Save progress
  - `loadProgress(projectName)` - Load progress
  - `getAllProgress()` - Get all progress
  - `logout()` - Logout user
  
**Smart Features:**
- Demo mode support (localStorage fallback)
- Automatic session management
- Error handling dan retry logic

#### 6. Update `pages/home.html`
**Tambahan:**
- User info di header (avatar, nama, email)
- Dropdown menu untuk profile & logout
- Auto-save ke backend setiap kali `saveGeneralData()` dipanggil
- Auto-save setiap 30 detik (interval)
- Load last project saat page load
- Integration dengan `auth.js`

### Konfigurasi

#### 7. `.env` (Environment Variables - LOCAL)
Berisi sensitive data:
- Google OAuth credentials
- GitHub OAuth credentials
- Session secret
- Database path
- App URL

**⚠️ JANGAN COMMIT FILE INI KE GIT!**

#### 8. `.env.example` (Template)
- Template untuk `.env`
- Menunjukkan struktur variables yang diperlukan
- Safe untuk di-commit

#### 9. Dokumentasi

**LOGIN_SETUP.md**
- Panduan lengkap setup Google OAuth
- Panduan setup GitHub OAuth
- Step-by-step instructions
- Troubleshooting guide
- Production deployment tips

**README.md** (Updated)
- Penjelasan fitur baru
- Quick start guide
- API documentation
- Database schema
- Struktur project

**TECHNICAL_ARCHITECTURE.md** (File ini)
- Overview teknis
- File descriptions
- API specification
- Data flow
- Security considerations

### File Konfigurasi

#### 10. `package.json` (Updated)
Ditambahkan dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-github2": "^0.1.12",
    "sqlite3": "^5.1.6",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  }
}
```

#### 11. `.gitignore` (Updated)
Ditambahkan:
- `rab_calculator.db` (database file)
- `*.db` (semua database files)

## Authentication Flow

### Google OAuth Flow

```
1. User klik "Login dengan Google"
   ↓
2. Redirect ke /auth/google
   ↓
3. Passport trigger Google OAuth dialog
   ↓
4. User authorize di Google
   ↓
5. Redirect ke /auth/google/callback
   ↓
6. Verify token di server
   ↓
7. findOrCreateUser() create/get user di database
   ↓
8. Set session
   ↓
9. Redirect ke /pages/home.html
```

### Demo Mode Flow

```
1. User klik "Gunakan Mode Demo"
   ↓
2. Set localStorage:
   - demoMode: true
   - demoUser: {...}
   ↓
3. Redirect ke /pages/home.html
   ↓
4. auth.isDemo = true
   ↓
5. Data disimpan ke localStorage (bukan server)
```

## API Specification

### Authentication Endpoints

#### 1. GET /auth/google
Redirect ke Google OAuth dialog
```
Response: Redirect to Google OAuth consent screen
```

#### 2. GET /auth/google/callback
Callback dari Google setelah user authorize
```
Response: Redirect to /pages/home.html atau /pages/login.html (jika gagal)
```

#### 3. GET /auth/github
Redirect ke GitHub OAuth dialog
```
Response: Redirect to GitHub OAuth authorization
```

#### 4. GET /auth/github/callback
Callback dari GitHub setelah user authorize
```
Response: Redirect to /pages/home.html atau /pages/login.html (jika gagal)
```

#### 5. GET /auth/logout
Logout user dan destroy session
```
Response: Redirect to /pages/login.html
```

#### 6. GET /api/user
Get current logged in user info
```
Response (200 OK):
{
  "id": 1,
  "user_id": "google_123456",
  "email": "user@example.com",
  "name": "User Name",
  "avatar_url": "https://...",
  "provider": "google",
  "created_at": "2024-01-01T00:00:00Z",
  "last_login": "2024-01-02T00:00:00Z"
}

Response (401 Unauthorized):
{
  "error": "Not authenticated"
}
```

### Progress Management Endpoints

#### 1. POST /api/progress/save
Simpan progress proyek

```
Request:
POST /api/progress/save
Content-Type: application/json

{
  "projectName": "Rumah Tinggal Type 36",
  "data": {
    "projectName": "Rumah Tinggal Type 36",
    "projectLocation": "Jakarta",
    "projectOwner": "PT ABC",
    "projectDate": "2024-01-01",
    "buildingArea": 36,
    "overheadProfit": 15,
    "ppnPercentage": 11
  }
}

Response (200 OK):
{
  "success": true,
  "message": "Progress saved"
}

Response (401 Unauthorized):
{
  "error": "Unauthorized"
}

Response (500 Server Error):
{
  "error": "Failed to save progress"
}
```

#### 2. GET /api/progress/:projectName
Load progress untuk proyek tertentu

```
Request:
GET /api/progress/Rumah%20Tinggal%20Type%2036

Response (200 OK):
{
  "data": {
    "projectName": "Rumah Tinggal Type 36",
    "projectLocation": "Jakarta",
    "projectOwner": "PT ABC",
    "projectDate": "2024-01-01",
    "buildingArea": 36,
    "overheadProfit": 15,
    "ppnPercentage": 11
  }
}

Response (401 Unauthorized):
{
  "error": "Unauthorized"
}
```

#### 3. GET /api/progress
Get semua progress untuk user

```
Request:
GET /api/progress

Response (200 OK):
{
  "progress": [
    {
      "id": 1,
      "user_id": "google_123456",
      "project_name": "Rumah Tinggal Type 36",
      "data": {...},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    },
    ...
  ]
}

Response (401 Unauthorized):
{
  "error": "Unauthorized"
}
```

## Data Models

### User

```javascript
{
  id: number,              // Database ID
  user_id: string,         // Unique: ${provider}_${oauth_id}
  email: string,           // User email
  name: string,            // User display name
  avatar_url: string,      // User avatar URL dari provider
  provider: string,        // 'google' atau 'github'
  created_at: string,      // ISO 8601 timestamp
  last_login: string       // ISO 8601 timestamp
}
```

### User Progress

```javascript
{
  id: number,              // Database ID
  user_id: string,         // FK to users.user_id
  project_name: string,    // Project identifier
  data: object,            // JSON data dikonversi ke string
  created_at: string,      // ISO 8601 timestamp
  updated_at: string       // ISO 8601 timestamp
}
```

## Security Considerations

### Session Security
- ✅ Secure session cookies (HttpOnly)
- ✅ 30 days session expiry
- ✅ CSRF protection (built-in express-session)
- ✅ Session secret should be strong (32+ chars)

### OAuth Security
- ✅ OAuth 2.0 protocol
- ✅ Redirect URL validation
- ✅ Token verification pada backend
- ✅ No token storage di client

### Database Security
- ✅ Prepared statements (SQLite parameter binding)
- ✅ No raw SQL strings dengan user input
- ✅ User data isolation per user_id

### HTTPS in Production
- ⚠️ REQUIRED untuk production
- ⚠️ Secure cookies hanya kirim via HTTPS
- ⚠️ Update redirect URLs ke HTTPS

## Implementasi Progress Saving

### Auto Save Strategy

1. **On Input Change**
   ```javascript
   oninput="saveGeneralData()"  // Triggered on each field change
   → saveRabData() ke localStorage
   → auto-save ke server (jika authenticated)
   ```

2. **Interval Auto Save (30 detik)**
   ```javascript
   setInterval(saveCurrentProject, 30000)  // Every 30 seconds
   → Call auth.saveProgress()
   → POST /api/progress/save
   ```

3. **On Page Unload** (Optional)
   ```javascript
   window.addEventListener('beforeunload', () => {
     // Ensure data is saved before leaving page
   })
   ```

### Load Strategy

1. **Check for saved project**
   ```javascript
   // Check if user selected project from profile
   const projectToLoad = localStorage.getItem('loadProject')
   if (projectToLoad) {
     await loadProjectData(projectToLoad)  // GET /api/progress/:projectName
   }
   ```

2. **Populate form**
   ```javascript
   // Fill input fields dengan data dari server
   $('pn').value = data.projectName
   $('pl').value = data.projectLocation
   // etc...
   ```

## Performance Notes

### Database Optimization
- ✅ UNIQUE constraint on (user_id, project_name) untuk prevent duplicates
- ✅ Foreign key relationship untuk data integrity
- ✅ Indexed columns (primary keys)

### Caching Strategy
- Client-side: localStorage untuk local caching
- Server-side: In-memory session management
- No database connection pool needed untuk SQLite

## Future Enhancements

1. **Database Migration**
   - Move dari SQLite ke PostgreSQL untuk production
   - Add database connection pooling
   - Add migration scripts

2. **Advanced Authentication**
   - Two-factor authentication (2FA)
   - Email verification
   - Password reset flow

3. **Data Sync**
   - Real-time sync dengan multiple devices
   - Conflict resolution untuk concurrent edits
   - Data versioning / history

4. **Social Features**
   - Share projects
   - Collaborate on projects
   - Comments/annotations

5. **Analytics**
   - Track user behavior
   - Project statistics
   - Usage metrics

## Maintenance

### Regular Tasks
- [ ] Monitor error logs (`/api/health`)
- [ ] Database backup (production)
- [ ] Update dependencies (`npm audit`)
- [ ] Check OAuth credential expiry

### Debugging
```bash
# Enable verbose logging
NODE_DEBUG=* npm run dev

# Check database
sqlite3 rab_calculator.db ".tables"

# View sessions
sqlite3 rab_calculator.db "SELECT * FROM users LIMIT 10;"
```

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready (dengan setup OAuth credentials)
