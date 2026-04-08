require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((userId, done) => {
  db.getUserById(userId)
    .then(user => done(null, user))
    .catch(err => done(err));
});

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await db.findOrCreateUser(profile, 'google');
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await db.findOrCreateUser(profile, 'github');
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Routes

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/pages/login.html' }),
  (req, res) => {
    res.redirect('/pages/home.html');
  }
);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/pages/login.html' }),
  (req, res) => {
    res.redirect('/pages/home.html');
  }
);

// Get current user
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/pages/login.html');
  });
});

// Progress API Routes
app.post('/api/progress/save', isAuthenticated, async (req, res) => {
  try {
    const { projectName, data } = req.body;
    await db.saveProgress(req.user.user_id, projectName, data);
    res.json({ success: true, message: 'Progress saved' });
  } catch (err) {
    console.error('Error saving progress:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:projectName', isAuthenticated, async (req, res) => {
  try {
    const { projectName } = req.params;
    const data = await db.getProgress(req.user.user_id, projectName);
    res.json({ data });
  } catch (err) {
    console.error('Error getting progress:', err);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

app.get('/api/progress', isAuthenticated, async (req, res) => {
  try {
    const progress = await db.getAllProgress(req.user.user_id);
    res.json({ progress });
  } catch (err) {
    console.error('Error getting progress:', err);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/pages/home.html');
});

// Initialize database and start server
db.initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
