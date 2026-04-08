const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'rab_calculator.db');

let db;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        createTables().then(resolve).catch(reject);
      }
    });
  });
}

function createTables() {
  return Promise.all([
    runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar_url TEXT,
        provider TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `),
    runQuery(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        project_name TEXT,
        data JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE(user_id, project_name)
      )
    `)
  ]);
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// User functions
async function findOrCreateUser(profile, provider) {
  const userId = `${provider}_${profile.id}`;
  let user = await getOne('SELECT * FROM users WHERE user_id = ?', [userId]);
  
  if (!user) {
    await runQuery(
      `INSERT INTO users (user_id, email, name, avatar_url, provider, last_login)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        userId,
        profile.emails?.[0]?.value || profile.email || '',
        profile.displayName || profile.name || '',
        profile.photos?.[0]?.value || profile.avatar_url || '',
        provider
      ]
    );
    user = await getOne('SELECT * FROM users WHERE user_id = ?', [userId]);
  } else {
    // Update last_login
    await runQuery('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [userId]);
  }
  
  return user;
}

async function getUserById(userId) {
  return getOne('SELECT * FROM users WHERE user_id = ?', [userId]);
}

// Progress functions
async function saveProgress(userId, projectName, data) {
  const existingProgress = await getOne(
    'SELECT * FROM user_progress WHERE user_id = ? AND project_name = ?',
    [userId, projectName]
  );
  
  if (existingProgress) {
    await runQuery(
      'UPDATE user_progress SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND project_name = ?',
      [JSON.stringify(data), userId, projectName]
    );
  } else {
    await runQuery(
      'INSERT INTO user_progress (user_id, project_name, data) VALUES (?, ?, ?)',
      [userId, projectName, JSON.stringify(data)]
    );
  }
}

async function getProgress(userId, projectName) {
  const record = await getOne(
    'SELECT * FROM user_progress WHERE user_id = ? AND project_name = ?',
    [userId, projectName]
  );
  return record ? JSON.parse(record.data) : null;
}

async function getAllProgress(userId) {
  const records = await getAll(
    'SELECT * FROM user_progress WHERE user_id = ? ORDER BY updated_at DESC',
    [userId]
  );
  return records.map(r => ({
    ...r,
    data: JSON.parse(r.data)
  }));
}

module.exports = {
  initDatabase,
  findOrCreateUser,
  getUserById,
  saveProgress,
  getProgress,
  getAllProgress
};
