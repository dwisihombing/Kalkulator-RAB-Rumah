/**
 * Auth utility untuk menangani autentikasi user
 */

class AuthManager {
  constructor() {
    this.user = null;
    this.isDemo = localStorage.getItem('demoMode') === 'true';
  }

  // Check if user is authenticated
  async isAuthenticated() {
    if (this.user) {
      return true;
    }

    if (this.isDemo) {
      this.user = JSON.parse(localStorage.getItem('demoUser') || '{}');
      return true;
    }

    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        this.user = await response.json();
        return true;
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }

    return false;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Get user ID for API calls
  getUserId() {
    if (this.isDemo) {
      return 'demo_' + new Date().getTime();
    }
    return this.user?.user_id;
  }

  // Save progress to server
  async saveProgress(projectName, data) {
    if (this.isDemo) {
      // Save to localStorage in demo mode
      const progressKey = `progress_${projectName}`;
      localStorage.setItem(progressKey, JSON.stringify(data));
      return { success: true, message: 'Progress saved (demo mode)' };
    }

    try {
      const response = await fetch('/api/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName, data })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to save progress');
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      throw err;
    }
  }

  // Load progress from server
  async loadProgress(projectName) {
    if (this.isDemo) {
      // Load from localStorage in demo mode
      const progressKey = `progress_${projectName}`;
      const data = localStorage.getItem(progressKey);
      return data ? JSON.parse(data) : null;
    }

    try {
      const response = await fetch(`/api/progress/${projectName}`);
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('Error loading progress:', err);
      return null;
    }
  }

  // Get all progress
  async getAllProgress() {
    if (this.isDemo) {
      // Return sample data in demo mode
      return [];
    }

    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const result = await response.json();
        return result.progress || [];
      }
      return [];
    } catch (err) {
      console.error('Error getting progress:', err);
      return [];
    }
  }

  // Logout
  async logout() {
    if (this.isDemo) {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoUser');
      window.location.href = '/pages/login.html';
      return;
    }

    try {
      await fetch('/auth/logout');
      window.location.href = '/pages/login.html';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }
}

// Create global instance
const auth = new AuthManager();

/**
 * Ensure user is authenticated before loading page
 * Call this at the start of any protected page
 */
async function ensureAuthenticated() {
  const isAuth = await auth.isAuthenticated();
  if (!isAuth) {
    window.location.href = '/pages/login.html';
  }
  return isAuth;
}

// Show user info in header
async function updateUserInfo() {
  const isAuth = await auth.isAuthenticated();
  if (!isAuth) return;

  const user = auth.getUser();
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userNameEl = document.getElementById('userName');
  const userEmailEl = document.getElementById('userEmail');
  const userAvatarEl = document.getElementById('userAvatar');

  if (userMenuBtn) {
    userMenuBtn.style.display = 'flex';
  }

  if (userNameEl) {
    userNameEl.textContent = user?.name || 'User';
  }

  if (userEmailEl) {
    userEmailEl.textContent = user?.email || '';
  }

  if (userAvatarEl && user?.avatar_url) {
    userAvatarEl.src = user.avatar_url;
  }
}

// Setup logout button
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }
}
