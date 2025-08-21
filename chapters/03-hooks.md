# Chapter 3: Mastering Hooks

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand the fundamentals of React Hooks
- Master useState and useEffect for state and lifecycle management
- Use useContext for global state management
- Optimize performance with useMemo and useCallback
- Access DOM elements with useRef
- Create custom hooks for reusable logic
- Build complex applications using hooks effectively

---

## 🔗 What Are Hooks?

Hooks are functions that allow you to "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 to solve several problems:

- **No more class components**: Write everything as functions
- **Reusable stateful logic**: Share logic between components
- **Better code organization**: Related logic stays together
- **Easier testing**: Functions are easier to test than classes

### Hook Rules

**1. Only Call Hooks at the Top Level**
```jsx
// ❌ Wrong - inside loops, conditions, or nested functions
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0); // This breaks the rules!
  }
  
  for (let i = 0; i < 10; i++) {
    useEffect(() => {}); // This also breaks the rules!
  }
}

// ✅ Correct - always at the top level
function GoodComponent() {
  const [state, setState] = useState(0);
  const [otherState, setOtherState] = useState('');
  
  useEffect(() => {
    // Effect logic here
  });
  
  if (condition) {
    // Use the state here, don't declare it here
    return <div>{state}</div>;
  }
}
```

**2. Only Call Hooks from React Functions**
```jsx
// ❌ Wrong - don't call hooks in regular JavaScript functions
function regularFunction() {
  const [state, setState] = useState(0); // This won't work!
}

// ✅ Correct - only in React function components or custom hooks
function ReactComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ Also correct - custom hooks
function useCustomHook() {
  const [state, setState] = useState(0);
  return [state, setState];
}
```

---

## 🎯 useState: Managing State

The `useState` hook is the most fundamental hook for managing state in functional components.

### Basic Usage

```jsx
import { useState } from 'react';

function Counter() {
  // useState returns an array: [currentState, setterFunction]
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
```

### State with Objects

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  // ❌ Wrong - this will overwrite other properties
  const updateName = (name) => {
    setUser({ name }); // This removes email and age!
  };
  
  // ✅ Correct - spread operator to preserve other properties
  const updateName = (name) => {
    setUser(prevUser => ({
      ...prevUser,
      name
    }));
  };
  
  // ✅ Also correct - using the spread operator directly
  const updateEmail = (email) => {
    setUser({
      ...user,
      email
    });
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => updateEmail(e.target.value)}
      />
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### State with Arrays

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const addTodo = () => {
    if (inputValue.trim()) {
      // ✅ Correct - create new array with new item
      setTodos(prevTodos => [
        ...prevTodos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };
  
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Functional Updates

When the new state depends on the previous state, use the functional form:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ Wrong - can lead to stale closures
  const incrementWrong = () => {
    setCount(count + 1);
    setCount(count + 1); // This won't work as expected!
  };
  
  // ✅ Correct - functional updates
  const incrementCorrect = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1); // This works correctly!
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCorrect}>Increment Twice</button>
    </div>
  );
}
```

---

## ⚡ useEffect: Side Effects and Lifecycle

The `useEffect` hook lets you perform side effects in function components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

### Basic Usage

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Effect runs after every render (componentDidMount + componentDidUpdate)
  useEffect(() => {
    console.log('Effect ran');
  });
  
  // Effect runs only once (componentDidMount)
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty dependency array
  
  // Effect runs when userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]); // Dependency array with userId
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Cleanup Function

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Setup subscription
    const subscription = subscribeToRoom(roomId, (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Cleanup function (componentWillUnmount)
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}
```

### Multiple Effects

```jsx
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState('offline');
  
  // Effect for fetching user data
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // Effect for fetching user posts
  useEffect(() => {
    if (user) {
      fetchUserPosts(userId).then(setPosts);
    }
  }, [userId, user]);
  
  // Effect for online status
  useEffect(() => {
    const interval = setInterval(() => {
      checkOnlineStatus(userId).then(setOnlineStatus);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [userId]);
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Status: {onlineStatus}</p>
      <h2>Posts ({posts.length})</h2>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Effect Dependencies

```jsx
function SearchResults({ query, filters }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Effect with multiple dependencies
  useEffect(() => {
    const searchData = async () => {
      setLoading(true);
      try {
        const data = await searchAPI(query, filters);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      searchData();
    }
  }, [query, filters]); // Re-run when query or filters change
  
  return (
    <div>
      {loading ? (
        <div>Searching...</div>
      ) : (
        <div>
          {results.map(result => (
            <div key={result.id}>{result.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🌐 useContext: Global State Management

The `useContext` hook provides a way to share data between components without explicitly passing props through every level.

### Creating Context

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

// Create the context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
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

// Custom hook to use the context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### Using Context

```jsx
// App.jsx
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Main from './components/Main';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  );
}

// components/Header.jsx
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`header ${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
}

// components/Main.jsx
import { useTheme } from '../contexts/ThemeContext';

function Main() {
  const { theme } = useTheme();
  
  return (
    <main className={`main ${theme}`}>
      <p>Current theme: {theme}</p>
      <p>This content adapts to the theme!</p>
    </main>
  );
}
```

### User Authentication Context

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus().then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []);
  
  const login = async (credentials) => {
    const userData = await loginAPI(credentials);
    setUser(userData);
    return userData;
  };
  
  const logout = () => {
    logoutAPI();
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    loading
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

// components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          email: e.target.value
        }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
      />
      <button type="submit">Login</button>
    </form>
  );
}

// components/UserProfile.jsx
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎯 useRef: Accessing DOM Elements

The `useRef` hook creates a mutable reference that persists across re-renders. It's commonly used to access DOM elements directly.

### Basic DOM Access

```jsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
  }, []);
  
  const handleClick = () => {
    // Focus the input when button is clicked
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="This will be focused"
      />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

### Storing Mutable Values

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setCount(0);
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <h2>Timer: {count}</h2>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

### Previous Value Tracking

```jsx
function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    // Store the previous count
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <h2>Current: {count}</h2>
      <h3>Previous: {prevCount}</h3>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

---

## ⚡ useMemo: Memoizing Values

The `useMemo` hook memoizes expensive calculations to avoid recalculating them on every render.

### Basic Usage

```jsx
import { useState, useMemo } from 'react';

function ExpensiveCalculation({ numbers }) {
  const [filter, setFilter] = useState('');
  
  // Expensive calculation that only runs when numbers or filter changes
  const filteredNumbers = useMemo(() => {
    console.log('Calculating filtered numbers...');
    return numbers
      .filter(num => num.toString().includes(filter))
      .map(num => num * 2);
  }, [numbers, filter]);
  
  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter numbers"
      />
      <ul>
        {filteredNumbers.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Complex Object Creation

```jsx
function UserList({ users, sortBy, filterBy }) {
  // Memoize the sorted and filtered users
  const processedUsers = useMemo(() => {
    console.log('Processing users...');
    
    let result = [...users];
    
    // Apply filter
    if (filterBy) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(filterBy.toLowerCase())
      );
    }
    
    // Apply sort
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'age') {
          return a.age - b.age;
        }
        return 0;
      });
    }
    
    return result;
  }, [users, sortBy, filterBy]);
  
  return (
    <div>
      <ul>
        {processedUsers.map(user => (
          <li key={user.id}>
            {user.name} - {user.age}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎯 useCallback: Memoizing Functions

The `useCallback` hook memoizes functions to prevent unnecessary re-renders of child components.

### Basic Usage

```jsx
import { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // This function is recreated on every render
  const handleClickWithoutCallback = () => {
    console.log('Button clicked');
  };
  
  // This function is memoized and only recreated when count changes
  const handleClickWithCallback = useCallback(() => {
    console.log('Button clicked, count:', count);
  }, [count]);
  
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
      
      <ChildComponent 
        onButtonClick={handleClickWithCallback}
        title="Memoized Function"
      />
    </div>
  );
}

// Child component that receives a function prop
function ChildComponent({ onButtonClick, title }) {
  console.log(`${title} component rendered`);
  
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={onButtonClick}>
        Click me
      </button>
    </div>
  );
}
```

### API Call Functions

```jsx
function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Memoize the fetch function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state
  
  // Memoize the delete function
  const deleteUser = useCallback(async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }, []); // Empty dependency array
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return (
    <div>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <UserList users={users} onDeleteUser={deleteUser} />
      )}
    </div>
  );
}

function UserList({ users, onDeleteUser }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDeleteUser(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🛠️ Custom Hooks

Custom hooks are functions that use other hooks and allow you to extract component logic into reusable functions.

### Basic Custom Hook

```jsx
// hooks/useCounter.js
import { useState, useCallback } from 'react';

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return {
    count,
    increment,
    decrement,
    reset
  };
}

// Usage in component
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0, 5);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment by 5</button>
      <button onClick={decrement}>Decrement by 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### API Data Hook

```jsx
// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
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
  }, [url, options]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch
  };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useApi(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Form Hook

```jsx
// hooks/useForm.js
import { useState, useCallback } from 'react';

function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);
  
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const value = values[field];
      const rules = validationRules[field];
      
      if (rules.required && !value) {
        newErrors[field] = `${field} is required`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${field} is invalid`;
      } else if (rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset
  };
}

// Usage
function LoginForm() {
  const { values, errors, touched, handleChange, handleBlur, validate, reset } = useForm(
    { email: '', password: '' },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email'
      },
      password: {
        required: true,
        minLength: 6
      }
    }
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form is valid:', values);
      // Submit form
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button type="submit">Login</button>
      <button type="button" onClick={reset}>Reset</button>
    </form>
  );
}
```

### Local Storage Hook

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className={`app ${theme}`}>
      <h1>Theme: {theme}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

## 🎨 Complete Example: Advanced Todo App

Let's build a comprehensive Todo application using all the hooks we've learned.

```jsx
// App.jsx
import { useState, useMemo } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoStats from './components/TodoStats';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="App">
        <h1>Advanced Todo App</h1>
        <TodoForm />
        <TodoStats />
        <TodoFilters />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App;
```

```jsx
// contexts/TodoContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';

const TodoContext = createContext();

// Reducer for complex state management
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false,
          createdAt: new Date(),
          priority: 'medium'
        }]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };
    
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
    sortBy: 'createdAt'
  });
  
  const addTodo = useCallback((text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  }, []);
  
  const toggleTodo = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);
  
  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);
  
  const updateTodo = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  }, []);
  
  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);
  
  const setSort = useCallback((sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);
  
  const value = {
    ...state,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSort
  };
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
```

```jsx
// components/TodoForm.jsx
import { useState, useCallback } from 'react';
import { useTodo } from '../contexts/TodoContext';

function TodoForm() {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const { addTodo } = useTodo();
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText('');
      setPriority('medium');
    }
  }, [text, addTodo]);
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="todo-input"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <button type="submit" className="todo-button">
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
```

```jsx
// components/TodoList.jsx
import { useMemo } from 'react';
import { useTodo } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

function TodoList() {
  const { todos, filter, sortBy } = useTodo();
  
  // Memoize filtered and sorted todos
  const processedTodos = useMemo(() => {
    let result = [...todos];
    
    // Apply filter
    switch (filter) {
      case 'active':
        result = result.filter(todo => !todo.completed);
        break;
      case 'completed':
        result = result.filter(todo => todo.completed);
        break;
      default:
        // 'all' - no filtering
        break;
    }
    
    // Apply sort
    switch (sortBy) {
      case 'createdAt':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'text':
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      default:
        break;
    }
    
    return result;
  }, [todos, filter, sortBy]);
  
  if (processedTodos.length === 0) {
    return <p className="empty-state">No todos found. Add one above!</p>;
  }
  
  return (
    <ul className="todo-list">
      {processedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
```

```jsx
// components/TodoItem.jsx
import { useState, useCallback, useRef } from 'react';
import { useTodo } from '../contexts/TodoContext';

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);
  const { toggleTodo, deleteTodo, updateTodo } = useTodo();
  
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
    // Focus the input after the component re-renders
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [todo.text]);
  
  const handleSave = useCallback(() => {
    if (editText.trim() && editText !== todo.text) {
      updateTodo(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
  }, [editText, todo.text, todo.id, updateTodo]);
  
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
  }, [todo.text]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);
  
  return (
    <li className={`todo-item priority-${todo.priority}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="todo-edit-input"
        />
      ) : (
        <span
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={handleEdit}
        >
          {todo.text}
        </span>
      )}
      
      <div className="todo-actions">
        <button onClick={handleEdit} className="edit-btn">
          Edit
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Hook Rules**: Always call hooks at the top level and only from React functions
2. **useState**: Managing component state with objects, arrays, and functional updates
3. **useEffect**: Handling side effects, cleanup, and dependencies
4. **useContext**: Global state management without prop drilling
5. **useRef**: Accessing DOM elements and storing mutable values
6. **useMemo**: Memoizing expensive calculations
7. **useCallback**: Memoizing functions to prevent unnecessary re-renders
8. **Custom Hooks**: Extracting reusable logic into custom functions

**What's Next:**
In the next chapter, we'll explore advanced state management strategies, including Context API, Redux, Zustand, and React Query.

---

## 🎯 Practice Exercises

### Exercise 1: Custom Hook - useLocalStorage
Create a custom hook that syncs state with localStorage:
- Accepts a key and initial value
- Returns current value and setter function
- Handles JSON serialization/deserialization
- Includes error handling for localStorage failures

### Exercise 2: Custom Hook - useDebounce
Create a custom hook that debounces a value:
- Accepts a value and delay (in milliseconds)
- Returns the debounced value
- Useful for search inputs and API calls
- Cleans up timeouts properly

### Exercise 3: Custom Hook - useWindowSize
Create a custom hook that tracks window dimensions:
- Returns current window width and height
- Updates when window is resized
- Includes cleanup to remove event listeners
- Handles SSR (server-side rendering) gracefully

### Exercise 4: Advanced Todo App Enhancement
Enhance the Todo app with these features:
- Add due dates to todos
- Implement todo categories/tags
- Add search functionality
- Include todo statistics (completion rate, average time to complete)
- Add keyboard shortcuts for common actions

---

*Ready to explore advanced state management? Let's move to Chapter 4! 🚀*
