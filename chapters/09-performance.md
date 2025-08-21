# Chapter 9: Performance and Optimization

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand React performance bottlenecks and optimization strategies
- Implement lazy loading and code splitting
- Use memoization techniques (useMemo, useCallback, React.memo)
- Optimize bundle size and loading performance
- Profile and measure React application performance
- Build high-performance React applications

---

## ⚡ Understanding React Performance

Performance optimization is crucial for creating fast, responsive React applications. Understanding how React works helps identify and fix performance bottlenecks.

### Common Performance Issues

1. **Unnecessary Re-renders**: Components re-rendering when props haven't changed
2. **Large Bundle Sizes**: Slow initial page loads
3. **Expensive Calculations**: Running heavy computations on every render
4. **Memory Leaks**: Not cleaning up effects and event listeners
5. **Inefficient Data Fetching**: Multiple API calls or unnecessary requests

### React's Rendering Process

1. **State/Props Change**: Component receives new props or state updates
2. **Reconciliation**: React compares new and old virtual DOM trees
3. **Diffing**: Identifies what needs to change in the actual DOM
4. **Commit**: Applies changes to the real DOM

---

## 🔄 Preventing Unnecessary Re-renders

### React.memo for Component Memoization

```jsx
// components/ExpensiveComponent.jsx
import React from 'react';

const ExpensiveComponent = React.memo(({ data, onItemClick }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <div className="expensive-component">
      {data.map(item => (
        <div 
          key={item.id} 
          onClick={() => onItemClick(item.id)}
          className="item"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
});

export default ExpensiveComponent;

// Parent component
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);

  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      
      {/* This component will only re-render when data or handleItemClick changes */}
      <ExpensiveComponent 
        data={data} 
        onItemClick={handleItemClick} 
      />
    </div>
  );
}
```

### Custom Comparison Function

```jsx
// components/UserCard.jsx
import React from 'react';

const UserCard = React.memo(({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={() => onEdit(user.id)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  // Return true if props are equal (no re-render needed)
  // Return false if props are different (re-render needed)
  
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});

export default UserCard;
```

---

## 🧮 Memoization with useMemo and useCallback

### useMemo for Expensive Calculations

```jsx
// components/DataTable.jsx
import React, { useState, useMemo } from 'react';

function DataTable({ data, filters, sortBy }) {
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Memoize expensive filtering and sorting operation
  const processedData = useMemo(() => {
    console.log('Processing data...'); // This will only run when dependencies change
    
    let result = [...data];
    
    // Apply filters
    if (filters.search) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'date') {
          return new Date(b.date) - new Date(a.date);
        }
        return 0;
      });
    }
    
    return result;
  }, [data, filters, sortBy]); // Dependencies array

  // Memoize computed values
  const totalItems = useMemo(() => processedData.length, [processedData]);
  const selectedCount = useMemo(() => selectedRows.size, [selectedRows]);

  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="data-table">
      <div className="table-header">
        <span>Total: {totalItems}</span>
        <span>Selected: {selectedCount}</span>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.has(item.id)}
                  onChange={() => handleRowSelect(item.id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
```

### useCallback for Function Memoization

```jsx
// components/UserList.jsx
import React, { useState, useCallback } from 'react';
import UserCard from './UserCard';

function UserList({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  // Memoize event handlers to prevent child re-renders
  const handleEdit = useCallback((userId) => {
    console.log('Editing user:', userId);
    setSelectedUser(users.find(user => user.id === userId));
  }, [users]);

  const handleDelete = useCallback((userId) => {
    console.log('Deleting user:', userId);
    // API call to delete user
  }, []);

  const handleSave = useCallback((userData) => {
    console.log('Saving user:', userData);
    // API call to save user
  }, []);

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default UserList;
```

### Complex Memoization Example

```jsx
// components/Dashboard.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, BarChart, PieChart } from './charts';

function Dashboard({ data, dateRange, filters }) {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const date = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      return date >= startDate && date <= endDate;
    });
  }, [data, dateRange]);

  // Memoize aggregated metrics
  const metrics = useMemo(() => {
    const aggregated = filteredData.reduce((acc, item) => {
      acc.revenue += item.revenue;
      acc.users += item.users;
      acc.orders += item.orders;
      return acc;
    }, { revenue: 0, users: 0, orders: 0 });

    return {
      revenue: aggregated.revenue.toFixed(2),
      users: aggregated.users.toLocaleString(),
      orders: aggregated.orders.toLocaleString()
    };
  }, [filteredData]);

  // Memoize chart data
  const chartData = useMemo(() => {
    const grouped = filteredData.reduce((acc, item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, users: 0, orders: 0 };
      }
      acc[date].revenue += item.revenue;
      acc[date].users += item.users;
      acc[date].orders += item.orders;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [filteredData]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    revenue: {
      color: '#4CAF50',
      label: 'Revenue ($)'
    },
    users: {
      color: '#2196F3',
      label: 'Users'
    },
    orders: {
      color: '#FF9800',
      label: 'Orders'
    }
  }), []);

  // Memoize event handlers
  const handleMetricChange = useCallback((metric) => {
    setSelectedMetric(metric);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    // Update date range
  }, []);

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Revenue</h3>
          <p>${metrics.revenue}</p>
        </div>
        <div className="metric-card">
          <h3>Users</h3>
          <p>{metrics.users}</p>
        </div>
        <div className="metric-card">
          <h3>Orders</h3>
          <p>{metrics.orders}</p>
        </div>
      </div>

      <div className="chart-controls">
        <select 
          value={selectedMetric} 
          onChange={(e) => handleMetricChange(e.target.value)}
        >
          <option value="revenue">Revenue</option>
          <option value="users">Users</option>
          <option value="orders">Orders</option>
        </select>
      </div>

      <div className="charts">
        <LineChart 
          data={chartData}
          metric={selectedMetric}
          config={chartConfig[selectedMetric]}
        />
        <BarChart 
          data={chartData}
          metric={selectedMetric}
          config={chartConfig[selectedMetric]}
        />
      </div>
    </div>
  );
}

export default Dashboard;
```

---

## 📦 Code Splitting and Lazy Loading

### React.lazy for Component Lazy Loading

```jsx
// App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

### Dynamic Imports with Error Boundaries

```jsx
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced lazy loading with error boundary
function lazyLoad(importFunc) {
  const LazyComponent = lazy(importFunc);
  
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Usage
const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const UserProfile = lazyLoad(() => import('./pages/UserProfile'));
```

### Route-Based Code Splitting

```jsx
// routes/index.js
import { lazy } from 'react';

// Public routes
export const publicRoutes = [
  {
    path: '/',
    component: lazy(() => import('../pages/Home')),
    exact: true
  },
  {
    path: '/about',
    component: lazy(() => import('../pages/About'))
  },
  {
    path: '/contact',
    component: lazy(() => import('../pages/Contact'))
  }
];

// Protected routes
export const protectedRoutes = [
  {
    path: '/dashboard',
    component: lazy(() => import('../pages/Dashboard')),
    exact: true
  },
  {
    path: '/dashboard/users',
    component: lazy(() => import('../pages/UserManagement'))
  },
  {
    path: '/dashboard/settings',
    component: lazy(() => import('../pages/Settings'))
  },
  {
    path: '/profile',
    component: lazy(() => import('../pages/UserProfile'))
  }
];

// components/Router.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from '../routes';
import LoadingSpinner from './LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map(({ path, component: Component, exact }) => (
          <Route
            key={path}
            path={path}
            element={<Component />}
            exact={exact}
          />
        ))}
        
        {/* Protected routes */}
        {protectedRoutes.map(({ path, component: Component, exact }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
            exact={exact}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
```

---

## 🎯 Bundle Optimization

### Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```js
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // ... other config
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

### Tree Shaking and Dead Code Elimination

```jsx
// utils/index.js - Good for tree shaking
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Usage - only imports what's needed
import { formatDate, debounce } from './utils';
```

### Dynamic Imports for Heavy Libraries

```jsx
// components/Chart.jsx
import React, { useState, useEffect } from 'react';

function Chart({ data, type }) {
  const [ChartComponent, setChartComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      setLoading(true);
      
      try {
        let chartModule;
        
        switch (type) {
          case 'line':
            chartModule = await import('recharts/lib/chart/LineChart');
            break;
          case 'bar':
            chartModule = await import('recharts/lib/chart/BarChart');
            break;
          case 'pie':
            chartModule = await import('recharts/lib/chart/PieChart');
            break;
          default:
            chartModule = await import('recharts/lib/chart/LineChart');
        }
        
        setChartComponent(() => chartModule.default);
      } catch (error) {
        console.error('Failed to load chart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChart();
  }, [type]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (!ChartComponent) {
    return <div>Failed to load chart</div>;
  }

  return <ChartComponent data={data} />;
}

export default Chart;
```

---

## 📊 Performance Monitoring and Profiling

### React DevTools Profiler

```jsx
// components/PerformanceMonitor.jsx
import React, { Profiler } from 'react';

function PerformanceMonitor({ children }) {
  const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    });
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}

// Usage in App.jsx
function App() {
  return (
    <PerformanceMonitor>
      <div className="App">
        {/* Your app components */}
      </div>
    </PerformanceMonitor>
  );
}
```

### Custom Performance Hooks

```jsx
// hooks/usePerformance.js
import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    console.log(`${componentName} rendered ${renderCount.current} times`);
    console.log(`Time since last render: ${timeSinceLastRender.toFixed(2)}ms`);
    
    lastRenderTime.current = currentTime;
  });

  return {
    renderCount: renderCount.current
  };
}

// hooks/useRenderTime.js
import { useEffect, useRef } from 'react';

export function useRenderTime(componentName) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (renderTime > 16) { // Longer than one frame (16.67ms)
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
    
    startTime.current = performance.now();
  });
}

// Usage in components
function ExpensiveComponent({ data }) {
  usePerformanceMonitor('ExpensiveComponent');
  useRenderTime('ExpensiveComponent');
  
  // Component logic
  return <div>{/* JSX */}</div>;
}
```

### Bundle Size Monitoring

```js
// scripts/analyze-bundle.js
const { execSync } = require('child_process');
const fs = require('fs');

function analyzeBundle() {
  try {
    // Build the project
    execSync('npm run build', { stdio: 'inherit' });
    
    // Run bundle analyzer
    execSync('npx webpack-bundle-analyzer build/static/js/*.js', { 
      stdio: 'inherit' 
    });
    
    // Generate bundle size report
    const stats = JSON.parse(
      fs.readFileSync('build/static/js/bundle-stats.json', 'utf8')
    );
    
    console.log('Bundle Analysis:');
    console.log(`Total size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Gzipped size: ${(stats.gzippedSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Check for large dependencies
    stats.modules.forEach(module => {
      if (module.size > 100 * 1024) { // Larger than 100KB
        console.warn(`Large module: ${module.name} (${(module.size / 1024).toFixed(2)} KB)`);
      }
    });
    
  } catch (error) {
    console.error('Bundle analysis failed:', error);
  }
}

analyzeBundle();
```

---

## 🚀 Advanced Optimization Techniques

### Virtual Scrolling for Large Lists

```jsx
// components/VirtualList.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';

function VirtualList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [items, visibleRange]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                height: itemHeight,
                padding: '10px',
                borderBottom: '1px solid #eee'
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;
```

### Intersection Observer for Lazy Loading

```jsx
// hooks/useIntersectionObserver.js
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return [ref, isIntersecting, hasIntersected];
}

// components/LazyImage.jsx
import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

function LazyImage({ src, alt, placeholder, ...props }) {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  return (
    <img
      ref={ref}
      src={hasIntersected ? src : placeholder}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}

export default LazyImage;
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Performance Fundamentals**: Understanding React rendering and optimization strategies
2. **Memoization**: Using React.memo, useMemo, and useCallback to prevent unnecessary re-renders
3. **Code Splitting**: Lazy loading components and routes for better performance
4. **Bundle Optimization**: Tree shaking, dynamic imports, and bundle analysis
5. **Performance Monitoring**: Profiling and measuring React application performance
6. **Advanced Techniques**: Virtual scrolling, intersection observers, and custom optimizations

**What's Next:**
In the next chapter, we'll explore deployment and CI/CD for React applications, including hosting platforms and automation pipelines.

---

## 🎯 Practice Exercises

### Exercise 1: Performance Audit
Conduct a performance audit of a React application:
- Identify performance bottlenecks
- Implement memoization strategies
- Optimize bundle size
- Measure performance improvements

### Exercise 2: Virtual Scrolling
Build a virtual scrolling implementation:
- Handle large datasets efficiently
- Implement smooth scrolling
- Add dynamic item heights
- Optimize for mobile devices

### Exercise 3: Lazy Loading System
Create a comprehensive lazy loading system:
- Component lazy loading
- Image lazy loading
- Route-based code splitting
- Error boundaries and fallbacks

### Exercise 4: Performance Monitoring
Set up performance monitoring:
- Custom performance hooks
- Bundle size tracking
- Render time monitoring
- Performance alerts and reporting

---

*Ready to explore deployment and CI/CD? Let's move to Chapter 10! 🚀*
