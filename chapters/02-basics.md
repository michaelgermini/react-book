# Chapter 2: The Basics

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Set up a React development environment
- Understand JSX syntax and its rules
- Create functional components
- Work with props and state
- Handle events and conditional rendering
- Build your first React application

---

## 🛠️ Installation & Setup

### Prerequisites
Before starting with React, ensure you have:
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- A code editor (VS Code recommended)

### Method 1: Vite (Recommended for 2025)

Vite is the fastest and most modern build tool for React development.

```bash
# Create a new React project with Vite
npm create vite@latest my-react-app -- --template react

# Navigate to the project directory
cd my-react-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Project Structure:**
```
my-react-app/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

### Method 2: Create React App (Legacy)

```bash
# Create a new React app
npx create-react-app my-react-app

# Navigate to the project directory
cd my-react-app

# Start the development server
npm start
```

### Method 3: Next.js (Full-Stack)

```bash
# Create a new Next.js app
npx create-next-app@latest my-next-app

# Navigate to the project directory
cd my-next-app

# Start the development server
npm run dev
```

---

## 📝 JSX: JavaScript XML

JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.

### Basic JSX Syntax

```jsx
// Basic JSX element
const element = <h1>Hello, React!</h1>;

// JSX with attributes
const button = <button className="btn" onClick={handleClick}>Click me</button>;

// JSX with children
const div = (
  <div className="container">
    <h1>Welcome</h1>
    <p>This is a paragraph</p>
  </div>
);
```

### JSX Rules

**1. Must Return a Single Root Element**
```jsx
// ❌ Wrong - multiple root elements
function Component() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Correct - single root element
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}

// ✅ Also correct - using React Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

**2. All Tags Must Be Closed**
```jsx
// Self-closing tags
<img src="image.jpg" alt="Description" />
<input type="text" />
<br />

// Regular tags
<div>Content</div>
<span>Text</span>
```

**3. Use camelCase for Attributes**
```jsx
// ❌ Wrong - HTML attributes
<div class="container" onclick={handleClick}>

// ✅ Correct - JSX attributes
<div className="container" onClick={handleClick}>
```

**4. JavaScript Expressions in Curly Braces**
```jsx
const name = "John";
const age = 25;

function Greeting() {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
      <p>Next year you'll be {age + 1}</p>
      <p>{age >= 18 ? "You're an adult" : "You're a minor"}</p>
    </div>
  );
}
```

**5. Conditional Rendering**
```jsx
function ConditionalComponent({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {username}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}
```

---

## 🧩 Functional Components

Components are the building blocks of React applications. They are reusable pieces of UI.

### Basic Component Structure

```jsx
// Simple functional component
function Welcome() {
  return <h1>Welcome to React!</h1>;
}

// Component with arrow function syntax
const Welcome = () => {
  return <h1>Welcome to React!</h1>;
};

// Component with implicit return
const Welcome = () => <h1>Welcome to React!</h1>;
```

### Using Components

```jsx
// App.jsx
import Welcome from './Welcome';

function App() {
  return (
    <div className="App">
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}
```

### Component Organization

```jsx
// components/Header.jsx
function Header({ title }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}

// components/Footer.jsx
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 My React App. All rights reserved.</p>
    </footer>
  );
}

// App.jsx
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header title="My React App" />
      <main>
        <h2>Main Content</h2>
        <p>This is the main content area.</p>
      </main>
      <Footer />
    </div>
  );
}
```

---

## 📦 Props: Passing Data to Components

Props (properties) are how you pass data from parent components to child components.

### Basic Props Usage

```jsx
// Parent component
function App() {
  return (
    <div>
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
      <Greeting name="Charlie" age={22} />
    </div>
  );
}

// Child component receiving props
function Greeting({ name, age }) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
}
```

### Props Destructuring

```jsx
// Different ways to access props
function UserCard(props) {
  return (
    <div>
      <h3>{props.name}</h3>
      <p>{props.email}</p>
    </div>
  );
}

// Destructuring in function parameters (recommended)
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Destructuring inside the function
function UserCard(props) {
  const { name, email, avatar } = props;
  
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

### Default Props

```jsx
function Button({ text, onClick, variant = "primary" }) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
}

// Usage
<Button text="Save" onClick={handleSave} />
<Button text="Cancel" onClick={handleCancel} variant="secondary" />
```

### Children Props

```jsx
// Container component that accepts children
function Card({ title, children }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="User Information">
      <p>Name: John Doe</p>
      <p>Email: john@example.com</p>
      <button>Edit Profile</button>
    </Card>
  );
}
```

---

## 🔄 State: Component Memory

State allows components to remember information and re-render when that information changes.

### useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  // State declaration: [currentValue, setterFunction]
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>Count: {count}</h2>
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

### Multiple State Variables

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, age });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Object State

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };
  
  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => updateUser('name', e.target.value)}
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => updateUser('email', e.target.value)}
        />
      </div>
      
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={user.age}
          onChange={(e) => updateUser('age', parseInt(e.target.value))}
        />
      </div>
      
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
```

---

## 🎯 Events and Event Handling

React events are similar to DOM events but with some key differences.

### Basic Event Handling

```jsx
function EventExample() {
  const handleClick = () => {
    alert('Button clicked!');
  };
  
  const handleMouseOver = () => {
    console.log('Mouse over the button');
  };
  
  return (
    <button 
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      Click me
    </button>
  );
}
```

### Event Object

```jsx
function FormExample() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    console.log('Form submitted');
  };
  
  const handleChange = (event) => {
    console.log('Input value:', event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Type something..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Passing Parameters to Event Handlers

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  
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
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span
            style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🔀 Conditional Rendering

Conditional rendering allows you to show different content based on certain conditions.

### if/else Statements

```jsx
function ConditionalComponent({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return <h1>Welcome back, {username}!</h1>;
  } else {
    return <h1>Please log in</h1>;
  }
}
```

### Ternary Operator

```jsx
function ConditionalComponent({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {username}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}
```

### Logical AND Operator

```jsx
function Notification({ message, show }) {
  return (
    <div>
      {show && <div className="notification">{message}</div>}
    </div>
  );
}
```

### Multiple Conditions

```jsx
function StatusIndicator({ status }) {
  return (
    <div>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'success' && <div>Success!</div>}
      {status === 'error' && <div>Error occurred</div>}
      {status === 'idle' && <div>Ready</div>}
    </div>
  );
}
```

---

## 🎨 Complete Example: Todo App

Let's build a complete Todo application using all the concepts we've learned.

```jsx
// App.jsx
import { useState } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
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
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  return (
    <div className="App">
      <h1>Todo App</h1>
      
      <TodoForm onAddTodo={addTodo} />
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({todos.filter(t => !t.completed).length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>
      
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

export default App;
```

```jsx
// components/TodoForm.jsx
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="todo-input"
      />
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
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos yet. Add one above!</p>;
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className="todo-item">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <span
            className={`todo-text ${todo.completed ? 'completed' : ''}`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="todo-delete"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
```

```css
/* App.css */
.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.todo-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.todo-button:hover {
  background-color: #0056b3;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.filters button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.todo-checkbox {
  margin: 0;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #888;
}

.todo-delete {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.empty-state {
  text-align: center;
  color: #888;
  font-style: italic;
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Setup**: Vite, Create React App, and Next.js
2. **JSX**: Syntax rules and best practices
3. **Components**: Functional components and organization
4. **Props**: Passing data between components
5. **State**: Managing component data with useState
6. **Events**: Handling user interactions
7. **Conditional Rendering**: Showing different content based on conditions

**What's Next:**
In the next chapter, we'll explore React Hooks in detail, including useState, useEffect, useContext, and custom hooks.

---

## 🎯 Practice Exercises

### Exercise 1: Counter Component
Create a counter component with the following features:
- Display current count
- Increment, decrement, and reset buttons
- Color changes based on count value (red for negative, green for positive, black for zero)

### Exercise 2: User Profile Form
Build a user profile form with:
- Name, email, age, and bio fields
- Form validation (all fields required, valid email format)
- Submit button that logs the form data
- Reset button to clear all fields

### Exercise 3: Shopping Cart
Create a simple shopping cart with:
- Product list with add to cart buttons
- Cart display showing items and total
- Remove items from cart functionality
- Quantity controls for each item

### Exercise 4: Weather Widget
Build a weather widget that:
- Shows current weather information
- Has a toggle between Celsius and Fahrenheit
- Displays different icons based on weather conditions
- Updates every 5 minutes (simulated)

---

*Ready to dive deeper into React Hooks? Let's move to Chapter 3! 🚀*
