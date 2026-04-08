# ⚡ QUICK START - Sistem Login RABPro

Panduan cepat untuk mulai menggunakan sistem login.

## 🎯 3 Langkah Setup

### 1️⃣ Setup OAuth (5 menit)

#### Google OAuth
```
1. Buka: https://console.cloud.google.com/
2. Create Project atau gunakan existing
3. Enable "Google+ API"
4. Credentials → Create → OAuth 2.0 Client ID → Web
5. Authorized redirect URIs:
   http://localhost:3000/auth/google/callback
6. Copy: Client ID & Client Secret
```

#### GitHub OAuth (Optional)
```
1. Buka: https://github.com/settings/developers
2. OAuth Apps → New OAuth App
3. Authorization callback URL:
   http://localhost:3000/auth/github/callback
4. Copy: Client ID & Client Secret
```

### 2️⃣ Update .env File

```bash
# Copy template
cp .env.example .env

# Edit .env file dan isi:
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id (optional)
GITHUB_CLIENT_SECRET=your_github_client_secret (optional)

# Generate random SESSION_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output dan paste ke SESSION_SECRET=...
```

### 3️⃣ Run Server

```bash
# Install dependencies (if not done)
npm install

# Development
npm run dev

# Production
npm start
```

**Server ready:** http://localhost:3000

## 🧪 Test Features

### Test 1: Demo Mode (No Login)
```
1. Go to http://localhost:3000
2. Click "Gunakan Mode Demo"
3. Fill form dan lihat data auto-saving
4. Go to Profile page
5. Lihat progress di localStorage
```

### Test 2: Google Login
```
1. Click "Login dengan Google" 
2. Authorize dengan akun Google Anda
3. You'll see your info di header
4. Fill form dan wait 30 seconds
5. Go to Profile → lihat saved project
6. Logout dan login ulang → data preserved
```

### Test 3: GitHub Login
```
1. Click "Login dengan GitHub"
2. Authorize dengan akun GitHub Anda
3. Same test steps seperti Google Login
```

## 📖 Dokumentasi

| File | Untuk |
|------|-------|
| `LOGIN_SETUP.md` | Setup guide lengkap |
| `TECHNICAL_ARCHITECTURE.md` | Dokumentasi teknis & API |
| `README.md` | Overview & features |
| `SETUP_SUMMARY.md` | Penjelasan lengkap semua file |

## 🚀 Production Deployment

Saat siap deploy:

```bash
# 1. Setup environment di hosting
NODE_ENV=production
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...

# 2. Update OAuth redirect URLs di console
https://yourdomain.com/auth/google/callback
https://yourdomain.com/auth/github/callback

# 3. Setup HTTPS (required)
# 4. Use production database (PostgreSQL)
# 5. npm start
```

## 📋 File Structure

```
project/
├── server.js              ← Main server
├── db.js                  ← Database
├── js/
│   └── auth.js           ← Auth helper
├── pages/
│   ├── login.html        ← Login page
│   ├── home.html         ← Dashboard (updated)
│   ├── profile.html      ← User profile
│   └── ... (other pages)
├── .env                  ← Your credentials
├── package.json          ← Dependencies
└── docs...
```

## ✅ What's Included

✓ Google OAuth login  
✓ GitHub OAuth login  
✓ Auto-save every 30s  
✓ User profiles  
✓ Project history  
✓ Session management  
✓ Database (SQLite)  
✓ Responsive UI  

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid Client ID" | Check .env file has correct values |
| "Redirect URL mismatch" | Verify callback URL matches in OAuth console |
| "Module not found" | Run `npm install` |
| "Address already in use" | Port 3000 busy, kill process or change PORT in .env |
| "Data not saving" | Check browser console for errors, verify user is logged in |

## 💡 Tips

- Always use HTTPS in production
- Change SESSION_SECRET in production
- Regular database backups
- Monitor error logs
- Test all OAuth flows before deployment

## 🎓 API Quick Reference

```
POST /api/progress/save          - Save project
GET /api/progress/:projectName   - Load project
GET /api/user                    - Get user info
GET /auth/logout                 - Logout
```

---

**Ready to go!** 🚀

Next: Setup OAuth credentials → Update .env → Run `npm run dev` → Test it!
