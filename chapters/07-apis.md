# Chapter 7: Working with APIs

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand different approaches to data fetching in React
- Master the Fetch API and Axios for HTTP requests
- Handle loading and error states effectively
- Use React Query for server state management
- Implement REST and GraphQL integration
- Build robust data fetching patterns

---

## 🌐 Understanding Data Fetching in React

Modern React applications need to communicate with backend services to fetch, create, update, and delete data. There are several approaches to handle this:

### Data Fetching Approaches

1. **Fetch API**: Built-in browser API for HTTP requests
2. **Axios**: Popular HTTP client library
3. **React Query**: Specialized library for server state management
4. **SWR**: Lightweight alternative to React Query
5. **GraphQL**: Query language for APIs

### When to Fetch Data

- **Component Mount**: Initial data loading
- **User Interaction**: Form submissions, button clicks
- **Route Changes**: Different data for different pages
- **Real-time Updates**: WebSocket connections, polling
- **Background Sync**: Keeping data fresh

---

## 🔗 Fetch API: Built-in HTTP Client

The Fetch API is a modern, built-in way to make HTTP requests in JavaScript.

### Basic GET Request

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;

// Usage in component
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!users) return <div>No users found</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### POST Request with Form Data

```jsx
// components/UserForm.jsx
import { useState } from 'react';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const newUser = await response.json();
      setSuccess(true);
      setFormData({ name: '', email: '', role: 'user' });
      
      // Optionally trigger a refresh of user list
      // onUserCreated(newUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">User created successfully!</div>}

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
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}

export default UserForm;
```

### File Upload

```jsx
// components/FileUpload.jsx
import { useState } from 'react';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Reset form
      setFile(null);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
        disabled={uploading}
      />

      {file && (
        <div className="file-info">
          <p>Selected: {file.name}</p>
          <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
          <span>{progress}%</span>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
}

export default FileUpload;
```

---

## 📡 Axios: Enhanced HTTP Client

Axios is a popular HTTP client that provides a more convenient API than the Fetch API.

### Installation

```bash
npm install axios
```

### Basic Setup

```jsx
// api/axios.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Functions

```jsx
// api/users.js
import api from './axios';

export const userApi = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  }
};

// api/posts.js
import api from './axios';

export const postApi = {
  // Get posts with pagination
  getPosts: async (page = 1, limit = 10, category = null) => {
    const params = { page, limit };
    if (category) params.category = category;
    
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like/unlike post
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (id, comment) => {
    const response = await api.post(`/posts/${id}/comments`, { comment });
    return response.data;
  }
};
```

### Using Axios in Components

```jsx
// components/UserList.jsx
import { useState, useEffect } from 'react';
import { userApi } from '../api/users';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userApi.searchUsers(searchTerm);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <div className="user-actions">
              <button onClick={() => handleDeleteUser(user.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
```

---

## 🔄 React Query: Server State Management

React Query is a powerful library for managing server state in React applications.

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
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/* Your app components */}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Custom Hooks with React Query

```jsx
// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/users';

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id, // Only run if id exists
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (newUser) => {
      // Update users list
      queryClient.setQueryData(['users'], (oldData) => {
        return oldData ? [...oldData, newUser] : [newUser];
      });
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update specific user
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      
      // Update user in users list
      queryClient.setQueryData(['users'], (oldData) => {
        return oldData?.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (_, deletedUserId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['user', deletedUserId] });
      
      // Update users list
      queryClient.setQueryData(['users'], (oldData) => {
        return oldData?.filter(user => user.id !== deletedUserId);
      });
      
      // Invalidate users query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// hooks/usePosts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/posts';

export function usePosts(page = 1, limit = 10, category = null) {
  return useQuery({
    queryKey: ['posts', { page, limit, category }],
    queryFn: () => postApi.getPosts(page, limit, category),
    keepPreviousData: true, // Keep previous data while fetching new data
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: (newPost) => {
      // Add to posts list
      queryClient.setQueryData(['posts'], (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });
      
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => postApi.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // Update specific post
      queryClient.setQueryData(['post', updatedPost.id], updatedPost);
      
      // Update post in posts list
      queryClient.setQueryData(['posts'], (oldData) => {
        return oldData?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

### Using React Query in Components

```jsx
// components/UserList.jsx
import { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading, error } = useUsers({ search: searchTerm });
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="user-list">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="users-grid">
        {users?.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button 
              onClick={() => handleDeleteUser(user.id)}
              disabled={deleteUserMutation.isLoading}
            >
              {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// components/UserForm.jsx
import { useState } from 'react';
import { useCreateUser } from '../hooks/useUsers';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', role: 'user' });
        alert('User created successfully!');
      },
      onError: (error) => {
        alert(`Failed to create user: ${error.message}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <button type="submit" disabled={createUserMutation.isLoading}>
        {createUserMutation.isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Data Fetching Approaches**: Understanding when and how to fetch data
2. **Fetch API**: Built-in browser API for HTTP requests
3. **Axios**: Enhanced HTTP client with interceptors
4. **React Query**: Powerful server state management
5. **Custom Hooks**: Reusable data fetching logic
6. **Error Handling**: Robust error management patterns

**What's Next:**
In the next chapter, we'll explore testing and code quality in React applications, including Jest, React Testing Library, and end-to-end testing.

---

## 🎯 Practice Exercises

### Exercise 1: CRUD Operations
Build a complete CRUD application:
- Create, read, update, delete operations
- Form validation and error handling
- Optimistic updates
- Loading states and user feedback

### Exercise 2: Real-time Data
Implement real-time features:
- WebSocket connections
- Polling for updates
- Real-time notifications
- Live data synchronization

### Exercise 3: Advanced React Query
Build advanced React Query patterns:
- Infinite queries for pagination
- Optimistic updates
- Background refetching
- Query invalidation strategies

### Exercise 4: API Integration
Create a full-stack application:
- REST API integration
- GraphQL queries and mutations
- File upload functionality
- Authentication and authorization

---

*Ready to explore testing and code quality? Let's move to Chapter 8! 🚀*
