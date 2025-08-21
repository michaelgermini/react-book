// examples/chapter-3-state-management/01-context-api.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const UserContext = createContext();
const ThemeContext = createContext();

// Custom hooks for using contexts
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// User Provider Component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 1,
        name: credentials.username,
        email: credentials.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Theme Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Login Component
function LoginForm() {
  const { login, loading } = useUser();
  const [credentials, setCredentials] = useState({
    username: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// User Profile Component
function UserProfile() {
  const { user, logout, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updates, setUpdates] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={updates.name}
              onChange={(e) => setUpdates(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={updates.email}
              onChange={(e) => setUpdates(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-actions">
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className={`app ${useTheme().theme}`}>
          <header>
            <h1>Context API Example</h1>
            <ThemeToggle />
          </header>

          <main>
            <UserProfile />
            <LoginForm />
          </main>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
