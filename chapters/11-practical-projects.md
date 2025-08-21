# Chapter 11: Practical Projects

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Build a complete Todo application with state management
- Create an interactive dashboard with charts and data visualization
- Develop a simplified e-commerce storefront
- Build a professional portfolio with Next.js
- Apply all React concepts learned throughout the book

---

## 📝 Project 1: Todo Application

### Project Overview
A feature-rich todo application with local storage, categories, and filtering.

### Key Features
- Add, edit, delete todos
- Mark todos as complete
- Filter by status and category
- Local storage persistence
- Responsive design

### Implementation

```jsx
// App.jsx
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoFilter from './components/TodoFilter';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  const addTodo = (text, selectedCategory) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      category: selectedCategory,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    
    const matchesCategory = category === 'all' || todo.category === category;
    
    return matchesFilter && matchesCategory;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Active: {stats.active}</span>
          <span>Completed: {stats.completed}</span>
        </div>
      </header>
      
      <main className="app-main">
        <TodoForm onAdd={addTodo} />
        <TodoFilter 
          filter={filter} 
          category={category}
          onFilterChange={setFilter}
          onCategoryChange={setCategory}
        />
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </main>
    </div>
  );
}

export default App;
```

```jsx
// components/TodoForm.jsx
import React, { useState } from 'react';

const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), category);
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
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit" className="add-button">Add</button>
    </form>
  );
}

export default TodoForm;
```

```jsx
// components/TodoList.jsx
import React, { useState } from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return <div className="empty-state">No todos found</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
```

```jsx
// components/TodoItem.jsx
import React, { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyPress}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span 
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      
      <span className="todo-category">{todo.category}</span>
      
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="edit-button"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-button"
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

## 📊 Project 2: Interactive Dashboard

### Project Overview
A data visualization dashboard with charts, filters, and real-time updates.

### Key Features
- Multiple chart types (line, bar, pie)
- Data filtering and date range selection
- Real-time data updates
- Responsive design
- Export functionality

### Implementation

```jsx
// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart } from './charts';
import DataTable from './components/DataTable';
import FilterPanel from './components/FilterPanel';
import StatsCards from './components/StatsCards';
import { useData } from './hooks/useData';
import './Dashboard.css';

function Dashboard() {
  const [filters, setFilters] = useState({
    dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
    category: 'all',
    region: 'all'
  });

  const { data, loading, error } = useData(filters);
  const [selectedChart, setSelectedChart] = useState('line');

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error loading data: {error}</div>;

  const chartData = processChartData(data);
  const stats = calculateStats(data);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <div className="chart-selector">
          <button
            className={selectedChart === 'line' ? 'active' : ''}
            onClick={() => setSelectedChart('line')}
          >
            Line Chart
          </button>
          <button
            className={selectedChart === 'bar' ? 'active' : ''}
            onClick={() => setSelectedChart('bar')}
          >
            Bar Chart
          </button>
          <button
            className={selectedChart === 'pie' ? 'active' : ''}
            onClick={() => setSelectedChart('pie')}
          >
            Pie Chart
          </button>
        </div>
      </header>

      <StatsCards stats={stats} />

      <div className="dashboard-content">
        <aside className="sidebar">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="main-content">
          <div className="chart-container">
            {selectedChart === 'line' && (
              <LineChart data={chartData} title="Revenue Over Time" />
            )}
            {selectedChart === 'bar' && (
              <BarChart data={chartData} title="Revenue by Category" />
            )}
            {selectedChart === 'pie' && (
              <PieChart data={chartData} title="Revenue Distribution" />
            )}
          </div>

          <DataTable data={data} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
```

```jsx
// components/StatsCards.jsx
import React from 'react';

function StatsCards({ stats }) {
  const cards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+12%', positive: true },
    { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+8%', positive: true },
    { title: 'Average Order', value: `$${stats.averageOrder.toFixed(2)}`, change: '-2%', positive: false },
    { title: 'Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%`, change: '+5%', positive: true }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <h3>{card.title}</h3>
          <div className="stat-value">{card.value}</div>
          <div className={`stat-change ${card.positive ? 'positive' : 'negative'}`}>
            {card.change}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
```

---

## 🛒 Project 3: E-commerce Storefront

### Project Overview
A simplified e-commerce application with product catalog, cart, and checkout.

### Key Features
- Product catalog with search and filtering
- Shopping cart functionality
- User authentication
- Checkout process
- Order history

### Implementation

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

```jsx
// pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import { useProducts } from '../hooks/useProducts';
import './ProductList.css';

function ProductList() {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'name'
  });

  const { products, loading, error } = useProducts(filters);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-list-page">
      <aside className="filters-sidebar">
        <ProductFilter filters={filters} onFilterChange={setFilters} />
      </aside>
      
      <main className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>
    </div>
  );
}

export default ProductList;
```

```jsx
// components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-description">{product.description}</p>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-button"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;
```

---

## 🎨 Project 4: Portfolio with Next.js

### Project Overview
A professional portfolio website built with Next.js featuring modern design and performance optimization.

### Key Features
- Server-side rendering
- Blog functionality
- Contact form
- Dark/light theme
- SEO optimization
- Performance monitoring

### Implementation

```jsx
// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Layout from '../components/Layout';

export default function Home() {
  const [theme, setTheme] = useState('light');

  return (
    <Layout theme={theme} onThemeChange={setTheme}>
      <Head>
        <title>Your Name - Full Stack Developer</title>
        <meta name="description" content="Full Stack Developer specializing in React, Node.js, and modern web technologies" />
        <meta name="keywords" content="React, JavaScript, Full Stack, Developer, Portfolio" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Head>

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </Layout>
  );
}
```

```jsx
// components/Layout.jsx
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from '../contexts/ThemeContext';

function Layout({ children, theme, onThemeChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={theme} onThemeChange={onThemeChange}>
      <div className={`layout ${theme}`}>
        <Header />
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
```

```jsx
// components/Hero.jsx
import { motion } from 'framer-motion';

function Hero() {
  return (
    <section className="hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-content"
      >
        <h1 className="hero-title">
          Hi, I'm <span className="highlight">Your Name</span>
        </h1>
        <p className="hero-subtitle">
          Full Stack Developer passionate about creating amazing web experiences
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary">View My Work</button>
          <button className="btn btn-secondary">Get In Touch</button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hero-image"
      >
        <img src="/hero-image.svg" alt="Developer illustration" />
      </motion.div>
    </section>
  );
}

export default Hero;
```

---

## 📝 Chapter Summary

**Projects Completed:**
1. **Todo Application**: State management, local storage, filtering
2. **Interactive Dashboard**: Data visualization, real-time updates
3. **E-commerce Storefront**: Routing, cart management, user auth
4. **Portfolio with Next.js**: SSR, SEO, performance optimization

**Key Skills Applied:**
- Component architecture and composition
- State management with Context API
- Custom hooks and data fetching
- Routing and navigation
- Styling and responsive design
- Performance optimization
- Testing and deployment

**What's Next:**
In the final chapter, we'll explore advanced topics and the future of React development.

---

## 🎯 Practice Exercises

### Exercise 1: Enhance the Todo App
Add advanced features to the todo app:
- Due dates and reminders
- Priority levels
- Tags and search
- Data export/import
- Collaborative features

### Exercise 2: Dashboard Extensions
Extend the dashboard with:
- Real-time notifications
- User management
- Advanced analytics
- Custom widgets
- Mobile app integration

### Exercise 3: E-commerce Features
Add enterprise features:
- Payment processing
- Inventory management
- Order tracking
- Customer reviews
- Admin dashboard

### Exercise 4: Portfolio Enhancements
Build advanced portfolio features:
- Blog with CMS
- Project showcase
- Resume builder
- Contact form with email
- Analytics tracking

---

*Ready for the final chapter? Let's explore advanced topics and the future of React! 🚀*
