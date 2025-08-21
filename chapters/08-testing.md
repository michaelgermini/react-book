# Chapter 8: Testing and Code Quality

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Understand testing fundamentals and best practices
- Write unit tests with Jest and React Testing Library
- Implement integration and end-to-end tests
- Use code quality tools like ESLint and Prettier
- Set up testing workflows and CI/CD pipelines
- Build maintainable and testable React applications

---

## 🧪 Testing Fundamentals

Testing is crucial for building reliable, maintainable React applications. It helps catch bugs early, ensures code quality, and provides confidence when making changes.

### Types of Testing

1. **Unit Tests**: Test individual functions or components in isolation
2. **Integration Tests**: Test how components work together
3. **End-to-End Tests**: Test complete user workflows
4. **Visual Regression Tests**: Test UI changes and visual consistency

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    
 /      \   Integration Tests (Some)
/________\  Unit Tests (Many)
```

### Testing Best Practices

- **Test behavior, not implementation**
- **Write tests that are easy to understand**
- **Keep tests independent and isolated**
- **Use descriptive test names**
- **Follow the AAA pattern (Arrange, Act, Assert)**

---

## 🃏 Jest: JavaScript Testing Framework

Jest is a popular testing framework that comes pre-configured with Create React App.

### Basic Setup

```jsx
// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct CSS classes based on variant', () => {
    render(<Button variant="primary">Primary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Testing Async Operations

```jsx
// UserProfile.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

// Mock the API
jest.mock('../api/users', () => ({
  getUser: jest.fn()
}));

const mockGetUser = require('../api/users').getUser;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    mockGetUser.mockImplementation(() => new Promise(() => {}));
    
    renderWithQueryClient(<UserProfile userId="123" />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays user data when API call succeeds', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    mockGetUser.mockResolvedValue(mockUser);
    
    renderWithQueryClient(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    mockGetUser.mockRejectedValue(new Error('User not found'));
    
    renderWithQueryClient(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Custom Hooks

```jsx
// hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter Hook', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  test('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('decrements counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  test('resets counter', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

---

## 🧪 React Testing Library: Component Testing

React Testing Library provides utilities for testing React components in a way that resembles how users interact with your app.

### Testing User Interactions

```jsx
// LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  test('renders login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<LoginForm />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('shows loading state during submission', async () => {
    const mockOnSubmit = jest.fn(() => new Promise(() => {}));
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(loginButton);
    
    expect(loginButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });

  test('displays error message on submission failure', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### Testing with Context

```jsx
// UserProfile.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import UserProfile from './UserProfile';

const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('UserProfile Component', () => {
  test('displays user information when authenticated', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    // Mock the auth context
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue({
      user: mockUser,
      loading: false
    });
    
    renderWithAuth(<UserProfile />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('shows login prompt when not authenticated', () => {
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue({
      user: null,
      loading: false
    });
    
    renderWithAuth(<UserProfile />);
    
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });
});
```

### Testing with Router

```jsx
// Navigation.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders navigation links', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  test('highlights active link', () => {
    // Mock useLocation to return current path
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/about'
    });
    
    renderWithRouter(<Navigation />);
    
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('active');
  });
});
```

---

## 🔧 Jest Configuration and Setup

### Jest Configuration

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};
```

### Setup Files

```js
// src/setupTests.js
import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Custom Test Utilities

```js
// src/test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 🎭 End-to-End Testing with Cypress

Cypress is a powerful end-to-end testing framework for web applications.

### Installation

```bash
npm install --save-dev cypress
npx cypress open
```

### Basic E2E Tests

```js
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="email-error"]').should('contain', 'Email is required');
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required');
  });

  it('should successfully log in with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});

// cypress/e2e/user-management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('admin@example.com', 'admin123');
    cy.visit('/users');
  });

  it('should display user list', () => {
    cy.get('[data-testid="user-list"]').should('be.visible');
    cy.get('[data-testid="user-card"]').should('have.length.greaterThan', 0);
  });

  it('should create a new user', () => {
    cy.get('[data-testid="add-user-button"]').click();
    
    cy.get('[data-testid="user-form"]').within(() => {
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="email-input"]').type('john@example.com');
      cy.get('[data-testid="role-select"]').select('user');
      cy.get('[data-testid="submit-button"]').click();
    });
    
    cy.get('[data-testid="success-message"]').should('contain', 'User created successfully');
    cy.get('[data-testid="user-card"]').should('contain', 'John Doe');
  });

  it('should delete a user', () => {
    cy.get('[data-testid="user-card"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });
    
    cy.get('[data-testid="confirm-dialog"]').within(() => {
      cy.get('[data-testid="confirm-button"]').click();
    });
    
    cy.get('[data-testid="success-message"]').should('contain', 'User deleted successfully');
  });

  it('should search users', () => {
    cy.get('[data-testid="search-input"]').type('John');
    cy.get('[data-testid="search-button"]').click();
    
    cy.get('[data-testid="user-card"]').should('contain', 'John');
  });
});
```

### Custom Commands

```js
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('createUser', (userData) => {
  cy.request({
    method: 'POST',
    url: '/api/users',
    body: userData,
    headers: {
      'Authorization': `Bearer ${Cypress.env('authToken')}`
    }
  });
});

Cypress.Commands.add('deleteUser', (userId) => {
  cy.request({
    method: 'DELETE',
    url: `/api/users/${userId}`,
    headers: {
      'Authorization': `Bearer ${Cypress.env('authToken')}`
    }
  });
});
```

---

## 🔍 Code Quality Tools

### ESLint Configuration

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/react',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier Configuration

```js
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

### Husky and lint-staged

```json
// package.json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "e2e": "cypress run",
    "e2e:open": "cypress open"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

---

## 📊 Testing Coverage and Reports

### Coverage Configuration

```js
// jest.config.js
module.exports = {
  // ... other config
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Coverage Scripts

```json
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage --watchAll=false",
    "test:coverage:watch": "jest --coverage --watch",
    "test:coverage:ci": "jest --coverage --ci --watchAll=false --coverageReporters=lcov"
  }
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Testing Fundamentals**: Understanding testing types and best practices
2. **Jest**: JavaScript testing framework setup and configuration
3. **React Testing Library**: Component testing with user-centric approach
4. **End-to-End Testing**: Cypress for complete workflow testing
5. **Code Quality Tools**: ESLint, Prettier, and automated workflows
6. **Testing Coverage**: Measuring and maintaining test coverage

**What's Next:**
In the next chapter, we'll explore performance optimization in React applications, including lazy loading, memoization, and bundle optimization.

---

## 🎯 Practice Exercises

### Exercise 1: Component Testing
Write comprehensive tests for React components:
- Form validation and submission
- User interactions and state changes
- Error handling and loading states
- Accessibility testing

### Exercise 2: Custom Hooks Testing
Test custom hooks thoroughly:
- State management and updates
- Side effects and cleanup
- Error handling
- Edge cases and boundary conditions

### Exercise 3: E2E Testing
Build end-to-end test suites:
- Complete user workflows
- Cross-browser testing
- Performance testing
- Visual regression testing

### Exercise 4: Testing Infrastructure
Set up comprehensive testing infrastructure:
- CI/CD pipeline integration
- Coverage reporting and monitoring
- Test automation and scheduling
- Performance and load testing

---

*Ready to explore performance optimization? Let's move to Chapter 9! 🚀*
