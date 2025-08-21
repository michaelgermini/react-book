import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

// Create a new QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrapper component for testing with providers
const TestWrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check if the app renders without throwing errors
    expect(document.body).toBeInTheDocument();
  });

  test('renders header with navigation', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check if header elements are present
    expect(screen.getByText(/React Book/i)).toBeInTheDocument();
  });
});
