# Kalkulator-RAB-Rumah

Kalkulator RAB Rumah adalah alat sederhana namun akurat untuk membantu perencanaan estimasi biaya pembangunan rumah. Proyek ini dirancang untuk memberikan gambaran detail mulai dari biaya material, upah tukang, hingga biaya tak terduga (contingency), sehingga proses bangun rumah jadi lebih terukur dan transparan.

## Fitur Utama

- 📊 **Dashboard Interaktif** - Visualisasi real-time estimasi biaya
- 🔐 **Sistem Login Aman** - Login dengan Google atau GitHub OAuth
- 💾 **Simpan Progres** - Auto-save data kalkulator setiap 30 detik
- 📱 **Responsive Design** - Akses dari desktop, tablet, atau mobile
- 📥 **Export PDF** - Download laporan RAB dalam format PDF
- 🌐 **Multi-project** - Kelola multiple proyek sekaligus

## Teknologi

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive Design
- HTML2PDF untuk export

**Backend:**
- Node.js + Express.js
- Passport.js untuk authentication
- SQLite untuk database lokal

**Authentication:**
- Google OAuth 2.0
- GitHub OAuth 2.0

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan credentials OAuth Anda

# Jalankan server
npm run dev

# Akses di http://localhost:3000
```

### Production

```bash
npm start
```

## Setup OAuth Credentials

Lihat [LOGIN_SETUP.md](./LOGIN_SETUP.md) untuk panduan lengkap setup Google OAuth dan GitHub OAuth.

## Struktur Project

```
├── server.js              # Main server file
├── db.js                  # Database initialization
├── package.json           # Dependencies
├── .env                   # Environment variables (local)
├── LOGIN_SETUP.md        # Setup guide untuk OAuth
├── index.html            # Home redirect
├── pages/
│   ├── home.html         # Dashboard utama
│   ├── login.html        # Halaman login
│   ├── profile.html      # Profil user & riwayat proyek
│   ├── pekerjaan.html    # Detail uraian pekerjaan
│   ├── upah.html         # Kalkulasi biaya upah
│   ├── print.html        # Print/Export RAB
│   └── about.html        # Informasi aplikasi
├── js/
│   └── auth.js          # Client-side authentication helper
└── README.md            # File ini
```

## Penggunaan

### Sebagai User Baru

1. **Akses aplikasi** di `http://localhost:3000`
2. **Pilih login method:**
   - Klik "Google" untuk login dengan Google
   - Klik "GitHub" untuk login dengan GitHub
   - Klik "Mode Demo" untuk mencoba tanpa login
3. **Isi data proyek** di Dashboard
4. **Data otomatis tersimpan** setiap 30 detik
5. **Lihat riwayat proyek** di halaman Profil

### Demo Content

Aplikasi dilengkapi dengan data demo:
- 11 kategori pekerjaan SNI standar
- Estimasi upah tukang by wilayah
- Template default untuk quick start

## API Endpoints

### Authentication
- `GET /auth/google` - Login dengan Google
- `GET /auth/github` - Login dengan GitHub  
- `GET /auth/logout` - Logout
- `GET /api/user` - Get user info

### Progress Management
- `POST /api/progress/save` - Simpan progres
- `GET /api/progress/:projectName` - Load progres
- `GET /api/progress` - Get semua progres user

## Database Schema

### Table: `users`
```sql
id (INTEGER PRIMARY KEY)
user_id (TEXT UNIQUE)
email (TEXT UNIQUE)
name (TEXT)
avatar_url (TEXT)
provider (TEXT) -- 'google' atau 'github'
created_at (DATETIME)
last_login (DATETIME)
```

### Table: `user_progress`
```sql
id (INTEGER PRIMARY KEY)
user_id (TEXT) -- FK ke users
project_name (TEXT)
data (JSON) -- Project data
created_at (DATETIME)
updated_at (DATETIME)
UNIQUE(user_id, project_name)
```

## Important Notes

### Demo Mode
- Cocok untuk testing tanpa setup OAuth
- Data disimpan di localStorage (tidak persistent)
- Hilang saat clear browser cache

### Production Deployment
- Ubah `NODE_ENV` ke `production`
- Setup HTTPS
- Update OAuth redirect URLs
- Gunakan database production-ready
- Setup environment variables dengan aman

### Security
- Jangan commit `.env` file
- Gunakan SESSION_SECRET yang kuat
- HTTPS required untuk production
- Regular backup database

## Troubleshooting

### Server tidak start
```bash
# Cek port 3000 sudah bebas
lsof -i :3000

# Kill process jika ada
kill -9 <PID>
```

### Database error
```bash
# Reset database
rm rab_calculator.db

# Restart server
npm run dev
```

### OAuth tidak berfungsi
- Pastikan credentials sudah di `.env`
- Cek redirect URL sesuai di OAuth console
- Pastikan server running di `http://localhost:3000`

Lihat [LOGIN_SETUP.md](./LOGIN_SETUP.md) untuk troubleshooting lengkap.

## Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

ISC - Lihat LICENSE file untuk details

## Author

**dwisihombing** - [GitHub](https://github.com/dwisihombing)

---

**Terakhir diupdate:** 2024
