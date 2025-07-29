import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Custom matchers
export const expectElementToBeInTheDocument = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
};

export const expectElementToHaveTextContent = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text);
};

export const expectElementToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  user_type: 'freelancer' as const,
  is_beta_tester: false,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

export const createMockJob = (overrides = {}) => ({
  id: 'test-job-id',
  title: 'Test Job',
  description: 'This is a test job description',
  budget: 1000,
  category: 'web-development',
  status: 'open' as const,
  created_by: 'test-user-id',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

// Mock handlers for MSW
export const mockHandlers = {
  auth: {
    signIn: {
      success: { data: { user: createMockUser() }, error: null },
      failure: { data: { user: null }, error: { message: 'Invalid credentials' } },
    },
    signUp: {
      success: { data: { user: createMockUser() }, error: null },
      failure: { data: { user: null }, error: { message: 'Email already exists' } },
    },
  },
  jobs: {
    list: {
      success: { data: [createMockJob()], error: null },
      empty: { data: [], error: null },
    },
    create: {
      success: { data: createMockJob(), error: null },
      failure: { data: null, error: { message: 'Failed to create job' } },
    },
  },
}; 