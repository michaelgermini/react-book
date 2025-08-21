# Chapter 4: State Management Strategies

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand when to use local vs. global state
- Master the Context API for simple global state
- Implement Redux with Redux Toolkit for complex applications
- Use Zustand for lightweight state management
- Leverage React Query for server state management
- Choose the right state management solution for your project

---

## 🎯 When to Use Local vs. Global State

Before diving into specific state management libraries, it's crucial to understand when to use local component state versus global application state.

### Local State (useState)

**Use local state when:**
- Data is only needed within a single component
- Data doesn't need to be shared between components
- The component is self-contained

```jsx
// ✅ Good use of local state
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Global State

**Use global state when:**
- Data needs to be shared between multiple components
- User authentication status
- Application theme or language preferences
- Shopping cart data
- Form data that spans multiple steps

```jsx
// ❌ Bad - prop drilling
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
      <Sidebar user={user} />
      <Footer user={user} />
    </div>
  );
}

// ✅ Good - global state
function App() {
  return (
    <UserProvider>
      <div>
        <Header />
        <Main />
        <Sidebar />
        <Footer />
      </div>
    </UserProvider>
  );
}
```

---

## 🌐 Context API: Built-in Global State

The Context API is React's built-in solution for sharing data across components without prop drilling.

### Basic Context Setup

```jsx
// contexts/UserContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('token', userData.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);
  
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Update failed');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Update error:', error);
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

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
```

### Using Context in Components

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useUser();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(credentials);
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          email: e.target.value
        }))}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// components/UserProfile.jsx
import { useUser } from '../contexts/UserContext';

function UserProfile() {
  const { user, logout, updateProfile } = useUser();
  
  if (!user) {
    return <div>Please log in to view your profile</div>;
  }
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// components/Header.jsx
import { useUser } from '../contexts/UserContext';
import LoginForm from './LoginForm';

function Header() {
  const { user } = useUser();
  
  return (
    <header className="header">
      <h1>My App</h1>
      <nav>
        {user ? (
          <div className="user-nav">
            <span>Hello, {user.name}</span>
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
          </div>
        ) : (
          <LoginForm />
        )}
      </nav>
    </header>
  );
}
```

### Multiple Contexts

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);
  
  const value = {
    theme,
    language,
    toggleTheme,
    changeLanguage
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// App.jsx
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <div className="App">
          <Header />
          <Main />
          <Footer />
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}
```

---

## 🔄 Redux: Predictable State Container

Redux is a predictable state container for JavaScript apps. It's particularly useful for large applications with complex state logic.

### Redux Toolkit Setup

```bash
npm install @reduxjs/toolkit react-redux
```

### Store Configuration

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Creating Slices

```jsx
// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      localStorage.setItem('token', userData.token);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, updateProfile } = userSlice.actions;
export default userSlice.reducer;
```

```jsx
// store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Using Redux in Components

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/userSlice';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(credentials));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          email: e.target.value
        }))}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// components/Cart.jsx
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  
  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  if (items.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }
  
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>${item.price}</p>
          </div>
          <div className="quantity-controls">
            <button 
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button 
            onClick={() => handleRemoveItem(item.id)}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      ))}
      
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={handleClearCart}>Clear Cart</button>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}
```

### Redux Hooks

```jsx
// hooks/redux.js
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => 
  useSelector<RootState, T>(selector);

// Custom hooks for specific slices
export const useUser = () => {
  return useAppSelector(state => state.user);
};

export const useCart = () => {
  return useAppSelector(state => state.cart);
};

export const useUI = () => {
  return useAppSelector(state => state.ui);
};
```

---

## ⚡ Zustand: Lightweight State Management

Zustand is a small, fast, and scalable state management solution with a minimal API.

### Installation

```bash
npm install zustand
```

### Basic Store

```jsx
// stores/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      
      login: async (credentials) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const userData = await response.json();
          set({ user: userData, loading: false });
          localStorage.setItem('token', userData.token);
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      logout: () => {
        set({ user: null, error: null });
        localStorage.removeItem('token');
      },
      
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;
        
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updates)
          });
          
          if (!response.ok) {
            throw new Error('Update failed');
          }
          
          const updatedUser = await response.json();
          set({ user: updatedUser });
        } catch (error) {
          set({ error: error.message });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({ user: state.user }) // only persist user data
    }
  )
);

export default useUserStore;
```

### Cart Store

```jsx
// stores/cartStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useCartStore = create(
  devtools(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...item, quantity: 1 }]
          }));
        }
        
        get().calculateTotal();
      },
      
      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
        get().calculateTotal();
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
        get().calculateTotal();
      },
      
      calculateTotal: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ total });
      },
      
      clearCart: () => set({ items: [], total: 0 })
    }),
    {
      name: 'cart-store' // name for Redux DevTools
    }
  )
);

export default useCartStore;
```

### Using Zustand in Components

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import useUserStore from '../stores/userStore';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, loading, error, clearError } = useUserStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(credentials);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          email: e.target.value
        }))}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// components/Cart.jsx
import useCartStore from '../stores/cartStore';

function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  
  if (items.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }
  
  return (
    <div className="cart">
      <h2>Shopping Cart ({items.length} items)</h2>
      
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>${item.price}</p>
          </div>
          <div className="quantity-controls">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button 
            onClick={() => removeItem(item.id)}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      ))}
      
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={clearCart}>Clear Cart</button>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}
```

---

## 🔄 React Query: Server State Management

React Query (now TanStack Query) is specifically designed for managing server state, caching, and synchronization.

### Installation

```bash
npm install @tanstack/react-query
```

### Setup

```jsx
// App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Header />
        <Main />
        <Footer />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### API Functions

```jsx
// api/users.js
const API_BASE = '/api';

export const userApi = {
  // Get user profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },
  
  // Update user profile
  updateProfile: async (updates) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },
  
  // Get user posts
  getPosts: async (userId) => {
    const response = await fetch(`${API_BASE}/users/${userId}/posts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  }
};

export const postApi = {
  // Get all posts
  getPosts: async ({ page = 1, limit = 10, category }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await fetch(`${API_BASE}/posts?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  },
  
  // Get single post
  getPost: async (postId) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    
    return response.json();
  },
  
  // Create post
  createPost: async (postData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    return response.json();
  },
  
  // Update post
  updatePost: async ({ postId, updates }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    
    return response.json();
  },
  
  // Delete post
  deletePost: async (postId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    
    return response.json();
  }
};
```

### Using React Query

```jsx
// components/UserProfile.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/users';

function UserProfile() {
  const queryClient = useQueryClient();
  
  // Fetch user profile
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update the cache with new data
      queryClient.setQueryData(['user', 'profile'], updatedUser);
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });
  
  const handleUpdateProfile = (updates) => {
    updateProfileMutation.mutate(updates);
  };
  
  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user data</div>;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      
      <button 
        onClick={() => handleUpdateProfile({ name: 'New Name' })}
        disabled={updateProfileMutation.isPending}
      >
        {updateProfileMutation.isPending ? 'Updating...' : 'Update Name'}
      </button>
    </div>
  );
}

// components/PostList.jsx
import { useQuery } from '@tanstack/react-query';
import { postApi } from '../api/posts';

function PostList({ category, page = 1 }) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['posts', { category, page }],
    queryFn: () => postApi.getPosts({ page, category }),
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
  
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="post-list">
      {isFetching && <div className="refetching">Refreshing...</div>}
      
      {data?.posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <span>By {post.author.name}</span>
        </div>
      ))}
      
      <div className="pagination">
        <button disabled={page <= 1}>Previous</button>
        <span>Page {page}</span>
        <button disabled={!data?.hasMore}>Next</button>
      </div>
    </div>
  );
}

// components/CreatePost.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/posts';

function CreatePost() {
  const [postData, setPostData] = useState({ title: '', content: '' });
  const queryClient = useQueryClient();
  
  const createPostMutation = useMutation({
    mutationFn: postApi.createPost,
    onSuccess: (newPost) => {
      // Add the new post to the cache
      queryClient.setQueryData(['posts'], (oldData) => ({
        ...oldData,
        posts: [newPost, ...oldData.posts]
      }));
      
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Reset form
      setPostData({ title: '', content: '' });
    },
    onError: (error) => {
      console.error('Create failed:', error);
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate(postData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Post title"
        value={postData.title}
        onChange={(e) => setPostData(prev => ({
          ...prev,
          title: e.target.value
        }))}
        required
      />
      
      <textarea
        placeholder="Post content"
        value={postData.content}
        onChange={(e) => setPostData(prev => ({
          ...prev,
          content: e.target.value
        }))}
        required
      />
      
      <button 
        type="submit" 
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## 🎯 Choosing the Right Solution

### When to Use Context API

**Use Context API when:**
- Simple global state (theme, language, user auth)
- Small to medium applications
- You want to avoid external dependencies
- State is mostly static or changes infrequently

**Pros:**
- Built into React
- No external dependencies
- Simple to understand and implement

**Cons:**
- Can cause unnecessary re-renders
- No built-in performance optimizations
- Limited to React components

### When to Use Redux

**Use Redux when:**
- Large applications with complex state
- Multiple teams working on the same codebase
- You need powerful dev tools and debugging
- Complex state logic with many actions and reducers
- Time-travel debugging is important

**Pros:**
- Predictable state updates
- Excellent dev tools
- Large ecosystem and community
- Great for complex applications

**Cons:**
- Steep learning curve
- Boilerplate code
- Overkill for simple applications

### When to Use Zustand

**Use Zustand when:**
- You want Redux-like features with less boilerplate
- Simple to medium complexity applications
- You prefer a more modern, hooks-based approach
- You want TypeScript support out of the box

**Pros:**
- Minimal boilerplate
- Easy to learn
- Great TypeScript support
- Small bundle size

**Cons:**
- Smaller ecosystem compared to Redux
- Less mature than Redux
- Fewer dev tools

### When to Use React Query

**Use React Query when:**
- Managing server state (API calls, caching)
- You need automatic background updates
- Optimistic updates are important
- You want built-in caching and synchronization

**Pros:**
- Excellent for server state
- Built-in caching and synchronization
- Automatic background updates
- Optimistic updates support

**Cons:**
- Only for server state (not client state)
- Learning curve for advanced features
- May be overkill for simple API calls

### Hybrid Approach

Many applications use a combination of these solutions:

```jsx
// Example: E-commerce app
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider> {/* Context for user auth */}
        <CartProvider> {/* Zustand for cart */}
          <div className="App">
            <Header />
            <Main />
            <Footer />
          </div>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Local vs Global State**: Understanding when to use each approach
2. **Context API**: Built-in React solution for simple global state
3. **Redux**: Powerful state container for complex applications
4. **Zustand**: Lightweight alternative to Redux with less boilerplate
5. **React Query**: Specialized solution for server state management
6. **Decision Making**: How to choose the right tool for your project

**What's Next:**
In the next chapter, we'll explore different styling approaches in React, including CSS Modules, Styled Components, and Tailwind CSS.

---

## 🎯 Practice Exercises

### Exercise 1: Context API - Theme Switcher
Create a theme context that manages:
- Light/dark theme toggle
- Custom color schemes
- Theme persistence in localStorage
- Smooth transitions between themes

### Exercise 2: Redux - Shopping Cart
Build a complete shopping cart with Redux Toolkit:
- Add/remove items
- Update quantities
- Calculate totals
- Persist cart data
- Handle checkout process

### Exercise 3: Zustand - Todo App
Create a todo application using Zustand:
- Add, edit, delete todos
- Mark todos as complete
- Filter by status
- Search functionality
- Categories/tags

### Exercise 4: React Query - Blog Platform
Build a blog platform using React Query:
- Fetch and display posts
- Create new posts
- Edit existing posts
- Comments system
- User authentication integration

---

*Ready to explore styling solutions? Let's move to Chapter 5! 🚀*
