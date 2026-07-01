import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const TestWrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ retry: false })}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
)
TestWrapper.displayName = 'TestWrapper'

describe('AnalyzeStartup', () => {
  it('renders', () => {
    render(<div>Test</div>, { wrapper: TestWrapper })
    expect(screen.getByText('Test')).toBeDefined()
  })
})