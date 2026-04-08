# Setup Sistem Login RABPro

Panduan lengkap untuk setup sistem login dengan Google OAuth dan GitHub OAuth.

## Prasyarat

- Node.js 14+ dan npm
- Akun Google dengan Google Cloud Console
- Akun GitHub (opsional)

## Instalasi Dependensi

```bash
npm install
```

## Setup Google OAuth

### 1. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google+ API:
   - Klik "Enable APIs and Services"
   - Cari "Google+ API"
   - Klik "Enable"

### 2. Buat OAuth Credentials

1. Di sidebar, klik "Credentials"
2. Klik "Create Credentials" > "OAuth Client ID"
3. Pilih "Web Application"
4. Di "Authorized redirect URIs", tambahkan:
   ```
   http://localhost:3000/auth/google/callback
   ```
5. Klik "Create"
6. Copy **Client ID** dan **Client Secret**

### 3. Update `.env`

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Setup GitHub OAuth (Opsional)

### 1. Buat GitHub OAuth App

1. Buka pengaturan akun GitHub: https://github.com/settings/developers
2. Klik "OAuth Apps" > "New OAuth App"
3. Isi form:
   - **Application name**: RABPro Calculator
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/auth/github/callback
4. Klik "Register application"

### 2. Update `.env`

```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

## Konfigurasi Session Secret

Update `SESSION_SECRET` di `.env`:

```bash
SESSION_SECRET=generate_random_secure_string_here
```

Untuk generate string aman:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Menjalankan Server

### Mode Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Mode Production

```bash
npm start
```

## Database

Database SQLite akan otomatis dibuat saat server pertama kali dijalankan:
- File: `rab_calculator.db`
- Berisi 2 tabel: `users` dan `user_progress`

Untuk reset database:
```bash
rm rab_calculator.db
# Jalankan server lagi
```

## Fitur Login

### Google Login
1. Klik tombol "Google" di halaman login
2. Masuk dengan akun Google Anda
3. Data user dan progress akan tersimpan di database

### GitHub Login
1. Klik tombol "GitHub" di halaman login
2. Masuk dengan akun GitHub Anda
3. Sama seperti Google, data akan tersimpan

### Demo Mode
- Tanpa login, gunakan "Mode Demo"
- Data disimpan di localStorage (tidak ke database)
- Data hilang saat membersihkan cache browser

## API Endpoints

### Authentication
- `GET /auth/google` - Redirect ke Google login
- `GET /auth/google/callback` - Callback dari Google
- `GET /auth/github` - Redirect ke GitHub login
- `GET /auth/github/callback` - Callback dari GitHub
- `GET /auth/logout` - Logout user
- `GET /api/user` - Get currrent user info

### Progress
- `POST /api/progress/save` - Simpan progress proyek
- `GET /api/progress/:projectName` - Load progress proyek
- `GET /api/progress` - Get all progress untuk user

## Struktur Data User

```javascript
{
  id: 1,
  user_id: "google_123456",
  email: "user@example.com",
  name: "User Name",
  avatar_url: "https://...",
  provider: "google", // atau "github"
  created_at: "2024-01-01T00:00:00Z",
  last_login: "2024-01-02T00:00:00Z"
}
```

## Struktur Data Progress

```javascript
{
  projectName: "Rumah Tinggal Type 36",
  projectLocation: "Jakarta",
  projectOwner: "PT ABC",
  projectDate: "2024-01-01",
  buildingArea: 36,
  overheadProfit: 15,
  ppnPercentage: 11
}
```

## Troubleshooting

### Error: "Passport is not initialized"
- Pastikan urutan middleware: express.static → session → passport

### Error: "Invalid client id"
- Cek ulang GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di .env
- Pastikan redirect URL sesuai di Google Console

### Error: Database locked
- Jangan buka rab_calculator.db dengan aplikasi lain
- Restart server

### Data tidak tersimpan
- Cek console server untuk error messages
- Pastikan user sudah authenticated (`/api/user` returns data)
- Di demo mode, data hanya di localStorage

## Deployment ke Production

Saat deploy:

1. Update environment variables di hosting:
   ```
   NODE_ENV=production
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   SESSION_SECRET=...
   APP_URL=https://yourdomain.com
   ```

2. Update OAuth redirect URLs di Google Console dan GitHub:
   ```
   https://yourdomain.com/auth/google/callback
   https://yourdomain.com/auth/github/callback
   ```

3. Gunakan database yang lebih robust (PostgreSQL/MySQL) untuk production.
   Edit file `db.js` untuk menggunakan driver database lain.

4. Setup HTTPS (required untuk production)

## Support

Untuk masalah atau pertanyaan, lihat dokumentasi:
- [Passport.js](http://www.passportjs.org/)
- [Express.js](https://expressjs.com/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
