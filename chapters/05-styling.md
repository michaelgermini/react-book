# Chapter 5: Styling React Applications

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand different styling approaches in React
- Master CSS Modules for component-scoped styling
- Use Styled Components for CSS-in-JS
- Implement Tailwind CSS for utility-first styling
- Build scalable design systems
- Choose the right styling solution for your project

---

## 🎨 Styling Approaches Overview

React applications can be styled using various approaches, each with its own advantages and use cases:

### Traditional CSS
- Global stylesheets
- CSS classes and selectors
- Potential naming conflicts
- No component encapsulation

### CSS Modules
- Scoped CSS classes
- Component-level styling
- No naming conflicts
- Build-time processing

### Styled Components (CSS-in-JS)
- JavaScript-based styling
- Dynamic styles based on props
- Component encapsulation
- Runtime processing

### Utility-First CSS (Tailwind)
- Pre-built utility classes
- Rapid development
- Consistent design system
- Build-time optimization

---

## 📦 CSS Modules: Component-Scoped Styling

CSS Modules provide a way to write CSS that's scoped to individual components, preventing naming conflicts.

### Basic Setup

CSS Modules work out of the box with Create React App and Vite. Just name your CSS files with `.module.css`:

```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #545b62;
}

.large {
  padding: 16px 32px;
  font-size: 18px;
}

.small {
  padding: 8px 16px;
  font-size: 14px;
}
```

### Using CSS Modules in Components

```jsx
// components/Button.jsx
import styles from './Button.module.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick,
  disabled = false 
}) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size]
  ].join(' ');
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

// Usage
function App() {
  return (
    <div>
      <Button variant="primary" size="large">
        Primary Large Button
      </Button>
      <Button variant="secondary" size="small">
        Secondary Small Button
      </Button>
    </div>
  );
}
```

### Dynamic Classes

```jsx
// components/Card.module.css
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.outlined {
  border: 2px solid #007bff;
  background: transparent;
}

.compact {
  padding: 12px;
}

.large {
  padding: 32px;
}

/* Status variants */
.success {
  border-left: 4px solid #28a745;
}

.warning {
  border-left: 4px solid #ffc107;
}

.error {
  border-left: 4px solid #dc3545;
}
```

```jsx
// components/Card.jsx
import styles from './Card.module.css';

function Card({ 
  children, 
  variant = 'default',
  size = 'medium',
  status,
  className = '',
  ...props 
}) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    status && styles[status],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export default Card;

// Usage
function Dashboard() {
  return (
    <div>
      <Card variant="elevated" size="large">
        <h2>Welcome to Dashboard</h2>
        <p>This is an elevated card with large padding.</p>
      </Card>
      
      <Card variant="outlined" status="success">
        <h3>Success Message</h3>
        <p>Operation completed successfully!</p>
      </Card>
      
      <Card status="warning">
        <h3>Warning</h3>
        <p>Please review your settings.</p>
      </Card>
    </div>
  );
}
```

### Composition and Inheritance

```css
/* Base.module.css */
.base {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.flex {
  display: flex;
}

.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
  gap: 20px;
}

.grid2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid3 {
  grid-template-columns: repeat(3, 1fr);
}
```

```jsx
// components/Layout.jsx
import baseStyles from './Base.module.css';
import styles from './Layout.module.css';

function Layout({ children, columns = 1 }) {
  const gridClass = columns === 2 ? baseStyles.grid2 : 
                   columns === 3 ? baseStyles.grid3 : 
                   baseStyles.grid;
  
  return (
    <div className={`${baseStyles.container} ${styles.layout}`}>
      <div className={`${baseStyles.grid} ${gridClass}`}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
```

---

## 🎭 Styled Components: CSS-in-JS

Styled Components is a popular CSS-in-JS library that allows you to write CSS directly in your JavaScript components.

### Installation

```bash
npm install styled-components
```

### Basic Usage

```jsx
// components/Button.jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : '#007bff'};
  color: white;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#545b62' : '#0056b3'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.size === 'large' && `
    padding: 16px 32px;
    font-size: 18px;
  `}
  
  ${props => props.size === 'small' && `
    padding: 8px 16px;
    font-size: 14px;
  `}
`;

function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
```

### Extending Components

```jsx
// components/Card.jsx
import styled from 'styled-components';

const BaseCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ElevatedCard = styled(BaseCard)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const OutlinedCard = styled(BaseCard)`
  border: 2px solid #007bff;
  background: transparent;
`;

const CompactCard = styled(BaseCard)`
  padding: 12px;
`;

const LargeCard = styled(BaseCard)`
  padding: 32px;
`;

function Card({ children, variant = 'default', size = 'medium', ...props }) {
  const CardComponent = 
    variant === 'elevated' ? ElevatedCard :
    variant === 'outlined' ? OutlinedCard :
    size === 'compact' ? CompactCard :
    size === 'large' ? LargeCard :
    BaseCard;
  
  return <CardComponent {...props}>{children}</CardComponent>;
}

export default Card;
```

### Theming with Styled Components

```jsx
// theme/theme.js
export const lightTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#333333',
    textSecondary: '#6c757d',
    border: '#e0e0e0'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.2)'
  }
};

export const darkTheme = {
  colors: {
    primary: '#4dabf7',
    secondary: '#868e96',
    success: '#51cf66',
    warning: '#ffd43b',
    error: '#ff6b6b',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#404040'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)'
  }
};
```

```jsx
// components/ThemeProvider.jsx
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../theme/theme';

function ThemeProvider({ children, theme = 'light' }) {
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <StyledThemeProvider theme={currentTheme}>
      {children}
    </StyledThemeProvider>
  );
}

export default ThemeProvider;
```

```jsx
// components/ThemedButton.jsx
import styled from 'styled-components';

const ThemedButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default ThemedButton;
```

### Global Styles

```jsx
// styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 ${props => props.theme.spacing.md} 0;
    font-weight: 600;
  }
  
  p {
    margin: 0 0 ${props => props.theme.spacing.md} 0;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    font-family: inherit;
  }
`;

export default GlobalStyles;
```

```jsx
// App.jsx
import { useState } from 'react';
import styled from 'styled-components';
import ThemeProvider from './components/ThemeProvider';
import GlobalStyles from './styles/GlobalStyles';
import ThemedButton from './components/ThemedButton';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
`;

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <ThemedButton onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </ThemedButton>
        
        <h1>Welcome to My App</h1>
        <p>This app demonstrates styled-components theming.</p>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
```

---

## 🎨 Tailwind CSS: Utility-First Styling

Tailwind CSS is a utility-first CSS framework that provides pre-built classes for rapid UI development.

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
```

### CSS Setup

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: Inter, system-ui, sans-serif;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  
  .btn-secondary {
    @apply bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2;
  }
  
  .btn-outline {
    @apply border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}
```

### Using Tailwind Classes

```jsx
// components/Button.jsx
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'btn font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
```

### Responsive Design

```jsx
// components/Card.jsx
function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 
        p-4 sm:p-6 lg:p-8
        hover:shadow-lg transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

// components/Grid.jsx
function Grid({ children, columns = 1, gap = 4, className = '' }) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };
  
  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };
  
  return (
    <div 
      className={`
        grid ${gridClasses[columns]} ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Grid;
```

### Dark Mode Support

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ... rest of config
}
```

```jsx
// components/ThemeToggle.jsx
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-800 dark:text-gray-200
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors duration-200
      "
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
```

```jsx
// components/DarkModeCard.jsx
function DarkModeCard({ children, className = '' }) {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        rounded-lg shadow-md
        p-6
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default DarkModeCard;
```

---

## 🎨 Design Systems

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.

### Design Tokens

```js
// design-tokens/colors.js
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

// design-tokens/spacing.js
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

// design-tokens/typography.js
export const typography = {
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};
```

### Component Library

```jsx
// components/ui/Button.jsx
import styled from 'styled-components';
import { colors, spacing, typography } from '../../design-tokens';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  border: none;
  border-radius: 6px;
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.medium};
  line-height: ${typography.lineHeights.normal};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'primary' && `
    background-color: ${colors.primary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${colors.primary[600]};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: ${colors.secondary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${colors.secondary[600]};
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: ${colors.primary[500]};
    border: 1px solid ${colors.primary[500]};
    
    &:hover:not(:disabled) {
      background-color: ${colors.primary[500]};
      color: white;
    }
  `}
  
  ${props => props.size === 'small' && `
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${typography.fontSizes.sm};
  `}
  
  ${props => props.size === 'large' && `
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.fontSizes.lg};
  `}
`;

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  ...props 
}) {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
```

```jsx
// components/ui/Input.jsx
import styled from 'styled-components';
import { colors, spacing, typography } from '../../design-tokens';

const StyledInput = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.neutral[300]};
  border-radius: 6px;
  font-size: ${typography.fontSizes.base};
  line-height: ${typography.lineHeights.normal};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${colors.neutral[100]};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${colors.neutral[400]};
  }
`;

function Input({ error, ...props }) {
  return (
    <StyledInput 
      {...props}
      style={{
        borderColor: error ? colors.error[500] : undefined,
        boxShadow: error ? `0 0 0 3px ${colors.error[100]}` : undefined
      }}
    />
  );
}

export default Input;
```

### Storybook Integration

```jsx
// stories/Button.stories.js
import Button from '../components/ui/Button';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary'
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary'
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline Button',
  variant: 'outline'
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large Button',
  size: 'large'
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  disabled: true
};
```

---

## 🎯 Choosing the Right Styling Solution

### When to Use CSS Modules

**Use CSS Modules when:**
- You want component-scoped styles
- You prefer traditional CSS syntax
- You need build-time optimization
- You want to avoid external dependencies

**Pros:**
- Scoped styles prevent conflicts
- Familiar CSS syntax
- Good performance
- No runtime overhead

**Cons:**
- Limited dynamic styling
- No theme support out of the box
- Requires build configuration

### When to Use Styled Components

**Use Styled Components when:**
- You want dynamic styles based on props
- You need theme support
- You prefer CSS-in-JS approach
- You want component encapsulation

**Pros:**
- Dynamic styling with props
- Built-in theme support
- Component encapsulation
- Great developer experience

**Cons:**
- Runtime overhead
- Larger bundle size
- Learning curve for CSS-in-JS

### When to Use Tailwind CSS

**Use Tailwind CSS when:**
- You want rapid development
- You need consistent design system
- You prefer utility-first approach
- You want responsive design utilities

**Pros:**
- Rapid development
- Consistent design system
- Excellent responsive utilities
- Small production bundle

**Cons:**
- Learning curve for utility classes
- HTML can become verbose
- Less component encapsulation

### Hybrid Approach

Many projects use a combination of these approaches:

```jsx
// Example: Using Tailwind for layout + Styled Components for complex components
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StyledCard variant="primary">
            <h2>Revenue</h2>
            <p>$12,345</p>
          </StyledCard>
          
          <StyledCard variant="secondary">
            <h2>Users</h2>
            <p>1,234</p>
          </StyledCard>
          
          <StyledCard variant="success">
            <h2>Growth</h2>
            <p>+12.5%</p>
          </StyledCard>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **CSS Modules**: Component-scoped styling with traditional CSS
2. **Styled Components**: CSS-in-JS with dynamic styling and theming
3. **Tailwind CSS**: Utility-first approach for rapid development
4. **Design Systems**: Creating consistent, reusable component libraries
5. **Decision Making**: Choosing the right styling solution for your project

**What's Next:**
In the next chapter, we'll explore routing and navigation in React applications, including React Router and Next.js routing.

---

## 🎯 Practice Exercises

### Exercise 1: CSS Modules - Component Library
Create a component library using CSS Modules:
- Button component with multiple variants
- Card component with different styles
- Form components (Input, Select, Textarea)
- Navigation components
- Responsive grid system

### Exercise 2: Styled Components - Theme System
Build a complete theme system with Styled Components:
- Light and dark themes
- Custom color palettes
- Typography scale
- Spacing system
- Component variants based on theme

### Exercise 3: Tailwind CSS - Dashboard
Create a responsive dashboard using Tailwind CSS:
- Sidebar navigation
- Header with user menu
- Dashboard cards and widgets
- Data tables
- Responsive design for mobile

### Exercise 4: Design System - Component Library
Build a comprehensive design system:
- Design tokens (colors, spacing, typography)
- Component library with Storybook
- Documentation and usage guidelines
- Accessibility considerations
- Performance optimization

---

*Ready to explore routing and navigation? Let's move to Chapter 6! 🚀*
