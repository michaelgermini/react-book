# Chapter 6: Navigation and Routing

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand client-side routing concepts
- Master React Router for navigation
- Implement nested routes and dynamic parameters
- Use Next.js file-based routing
- Create protected routes and authentication flows
- Handle route transitions and loading states

---

## 🧭 Understanding Client-Side Routing

Client-side routing allows React applications to navigate between different views without full page reloads, providing a smoother user experience.

### Traditional vs Client-Side Routing

**Traditional Server-Side Routing:**
- Full page reloads
- Server handles routing
- Slower navigation
- SEO-friendly by default

**Client-Side Routing:**
- No page reloads
- JavaScript handles routing
- Faster navigation
- Requires additional setup for SEO

### Benefits of Client-Side Routing

- **Better Performance**: No full page reloads
- **Smoother UX**: Instant navigation between views
- **State Preservation**: Maintains application state
- **Offline Support**: Can work without server requests

---

## 🛣️ React Router: Client-Side Routing

React Router is the most popular routing library for React applications.

### Installation

```bash
npm install react-router-dom
```

### Basic Setup

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### Navigation Components

```jsx
// components/Header.jsx
import { Link, NavLink, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          My App
        </Link>
        
        <nav className="nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            About
          </NavLink>
          
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Contact
          </NavLink>
        </nav>
        
        <div className="current-path">
          Current: {location.pathname}
        </div>
      </div>
    </header>
  );
}

export default Header;
```

### Page Components

```jsx
// pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My App</h1>
      <p>This is the home page of our application.</p>
      
      <div className="cta-buttons">
        <Link to="/about" className="btn btn-primary">
          Learn More
        </Link>
        <Link to="/contact" className="btn btn-secondary">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}

export default Home;

// pages/About.jsx
function About() {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>Learn more about our company and mission.</p>
      
      <section className="mission">
        <h2>Our Mission</h2>
        <p>To provide the best user experience possible.</p>
      </section>
      
      <section className="team">
        <h2>Our Team</h2>
        <p>Meet the people behind our success.</p>
      </section>
    </div>
  );
}

export default About;

// pages/Contact.jsx
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <p>Get in touch with our team.</p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;

// pages/NotFound.jsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
```

---

## 🔗 Dynamic Routes and Parameters

React Router allows you to create dynamic routes with parameters.

### URL Parameters

```jsx
// App.jsx with dynamic routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Using URL Parameters

```jsx
// pages/UserList.jsx
import { Link } from 'react-router-dom';

function UserList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  return (
    <div className="user-list">
      <h1>Users</h1>
      
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <Link to={`/users/${user.id}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;

// pages/UserDetail.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        navigate('/users');
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="user-detail">
      <div className="user-header">
        <h1>{user.name}</h1>
        <div className="user-actions">
          <Link to={`/users/${userId}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
      
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Location:</strong> {user.location}</p>
      </div>
      
      <div className="user-posts">
        <h2>Posts by {user.name}</h2>
        <Link to={`/users/${userId}/posts`} className="btn btn-primary">
          View All Posts
        </Link>
      </div>
      
      <Link to="/users" className="btn btn-outline">
        ← Back to Users
      </Link>
    </div>
  );
}

export default UserDetail;
```

### Search Parameters

```jsx
// pages/PostList.jsx
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PostList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', page.toString());
        
        const response = await fetch(`/api/posts?${params}`);
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [category, search, page]);
  
  const handleCategoryChange = (newCategory) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newCategory) {
        newParams.set('category', newCategory);
      } else {
        newParams.delete('category');
      }
      newParams.set('page', '1'); // Reset to first page
      return newParams;
    });
  };
  
  const handleSearch = (searchTerm) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (searchTerm) {
        newParams.set('search', searchTerm);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1'); // Reset to first page
      return newParams;
    });
  };
  
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };
  
  if (loading) return <div>Loading posts...</div>;
  
  return (
    <div className="post-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search posts..."
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        
        <select
          value={category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
      </div>
      
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="post-meta">
              <span className="category">{post.category}</span>
              <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <Link to={`/posts/${post.id}`} className="btn btn-primary">
              Read More
            </Link>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-outline"
        >
          Previous
        </button>
        
        <span className="page-info">Page {page}</span>
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={posts.length < 10} // Assuming 10 posts per page
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PostList;
```

---

## 🏗️ Nested Routes

React Router supports nested routes for complex application structures.

### Layout Components

```jsx
// layouts/DashboardLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Overview
          </NavLink>
          
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Profile
          </NavLink>
          
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Settings
          </NavLink>
          
          <NavLink 
            to="/dashboard/posts" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            My Posts
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
```

### Nested Route Configuration

```jsx
// App.jsx with nested routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard routes with nested structure */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts" element={<PostList />} />
          <Route path="posts/:postId" element={<PostDetail />} />
        </Route>
        
        {/* Public routes */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="/posts" element={<PublicPostList />} />
        <Route path="/posts/:postId" element={<PublicPostDetail />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Dashboard Pages

```jsx
// pages/Dashboard.jsx
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-number">24</p>
          <Link to="/dashboard/posts" className="stat-link">
            View All Posts →
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Views</h3>
          <p className="stat-number">1,234</p>
        </div>
        
        <div className="stat-card">
          <h3>Comments</h3>
          <p className="stat-number">56</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2 hours ago</span>
            <span className="activity-text">Published "Getting Started with React"</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">1 day ago</span>
            <span className="activity-text">Updated profile information</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="profile">
      <h1>Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
```

---

## 🔒 Protected Routes and Authentication

Implementing authentication and route protection is crucial for secure applications.

### Authentication Context

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { user: userData, token } = await response.json();
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const updateProfile = async (updates) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Update failed');
    }
    
    const updatedUser = await response.json();
    setUser(updatedUser);
    return updatedUser;
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Protected Route Component

```jsx
// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAuth = true }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (requireAuth && !user) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!requireAuth && user) {
    // Redirect authenticated users away from login/register
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

### Updated App with Protected Routes

```jsx
// App.jsx with protected routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth routes - redirect if already logged in */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="posts" element={<PostList />} />
            <Route path="posts/:postId" element={<PostDetail />} />
          </Route>
          
          {/* Public content routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route path="/posts" element={<PublicPostList />} />
          <Route path="/posts/:postId" element={<PublicPostDetail />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Login Component with Redirect

```jsx
// pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

---

## ⚡ Next.js File-Based Routing

Next.js provides a file-system based router that's intuitive and powerful.

### Basic File Structure

```
pages/
├── index.js          # / (home page)
├── about.js          # /about
├── contact.js        # /contact
├── users/
│   ├── index.js      # /users
│   └── [id].js       # /users/[id]
├── posts/
│   ├── index.js      # /posts
│   └── [id].js       # /posts/[id]
└── dashboard/
    ├── index.js      # /dashboard
    ├── profile.js    # /dashboard/profile
    ├── settings.js   # /dashboard/settings
    └── posts/
        ├── index.js  # /dashboard/posts
        └── [id].js   # /dashboard/posts/[id]
```

### Dynamic Routes

```jsx
// pages/users/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);
  
  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="user-detail">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Location: {user.location}</p>
      
      <Link href="/users">
        <a className="btn btn-outline">← Back to Users</a>
      </Link>
    </div>
  );
}
```

### Catch-All Routes

```jsx
// pages/posts/[...slug].js
import { useRouter } from 'next/router';

export default function PostCatchAll() {
  const router = useRouter();
  const { slug } = router.query;
  
  // slug will be an array: ['category', 'subcategory', 'post-id']
  
  return (
    <div>
      <h1>Post Route</h1>
      <p>Slug: {slug?.join('/')}</p>
    </div>
  );
}
```

### API Routes

```jsx
// pages/api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  const { method } = req;
  
  switch (method) {
    case 'GET':
      // Handle GET request
      res.status(200).json({ id, name: 'John Doe', email: 'john@example.com' });
      break;
      
    case 'PUT':
      // Handle PUT request
      res.status(200).json({ message: 'User updated' });
      break;
      
    case 'DELETE':
      // Handle DELETE request
      res.status(200).json({ message: 'User deleted' });
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

---

## 🎯 Route Transitions and Loading States

Smooth transitions and loading states improve user experience.

### Loading Components

```jsx
// components/LoadingSpinner.jsx
function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
    </div>
  );
}

export default LoadingSpinner;

// components/PageLoader.jsx
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default PageLoader;
```

### Suspense and Lazy Loading

```jsx
// App.jsx with lazy loading
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./pages/UserList'));
const UserDetail = lazy(() => import('./pages/UserDetail'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner size="large" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Client-Side Routing**: Understanding the benefits and implementation
2. **React Router**: Basic setup, navigation, and dynamic routes
3. **Nested Routes**: Complex routing structures with layouts
4. **Protected Routes**: Authentication and route protection
5. **Next.js Routing**: File-based routing system
6. **Route Transitions**: Loading states and smooth navigation

**What's Next:**
In the next chapter, we'll explore working with APIs in React applications, including data fetching, error handling, and state management.

---

## 🎯 Practice Exercises

### Exercise 1: E-commerce Routing
Build an e-commerce application with routing:
- Product listing and detail pages
- Shopping cart with persistent state
- User authentication and protected checkout
- Order history and tracking
- Search and filtering with URL parameters

### Exercise 2: Blog Platform
Create a blog platform with advanced routing:
- Article listing with pagination
- Category and tag filtering
- Author profiles and posts
- Comment system
- Admin dashboard for content management

### Exercise 3: Dashboard with Nested Routes
Build a comprehensive dashboard:
- Multiple nested route levels
- Breadcrumb navigation
- Role-based route protection
- Settings and profile management
- Data visualization pages

### Exercise 4: Next.js App Router
Convert a React Router app to Next.js:
- File-based routing structure
- API routes for backend functionality
- Server-side rendering
- Static site generation
- Image optimization

---

*Ready to explore API integration? Let's move to Chapter 7! 🚀*
