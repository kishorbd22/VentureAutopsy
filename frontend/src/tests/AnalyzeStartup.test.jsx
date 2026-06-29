import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AnalyzeStartup from '../pages/AnalyzeStartup'

// Mock hooks to avoid API mock shape issues
vi.mock('../hooks/useIndustries', () => ({
  useIndustries: () => ({
    data: ['Technology', 'Healthcare', 'FinTech', 'E-Commerce', 'SaaS', 'EdTech', 'Real Estate', 'CleanTech'],
    isLoading: false,
    error: null
  })
}))

vi.mock('../hooks/useDeathCauses', () => ({
  useDeathCauses: () => ({
    data: ['Cash Flow Problems', 'Market Competition', 'Poor Management', 'Product-Market Fit', 'Legal Issues'],
    isLoading: false,
    error: null
  })
}))

// Mock API client
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('AnalyzeStartup Page', () => {
  it('renders page title', () => {
    render(<AnalyzeStartup />, { wrapper: createWrapper() })
    expect(screen.getByText('Startup Analysis')).toBeDefined()
    expect(screen.getByText(/Analyze your startup's risk profile based on historical data from failed startups/)).toBeDefined()
  })

  it('renders form fields', () => {
    render(<AnalyzeStartup />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Startup Name')).toBeDefined()
    expect(screen.getByText('Industry')).toBeDefined()
    expect(screen.getByText('Country')).toBeDefined()
    expect(screen.getByText('Stage at Risk')).toBeDefined()
    expect(screen.getByText('Primary Risk Factor')).toBeDefined()
    expect(screen.getByText('Total Funding (USD)')).toBeDefined()
    expect(screen.getByText('Employees')).toBeDefined()
  })

  it('has Analyze Startup button', () => {
    render(<AnalyzeStartup />, { wrapper: createWrapper() })
    expect(screen.getByText('Analyze Startup')).toBeDefined()
  })

  it('button is enabled with industry data loaded', () => {
    render(<AnalyzeStartup />, { wrapper: createWrapper() })
    const button = screen.getByText('Analyze Startup')
    expect(button).not.toHaveProperty('disabled', true)
  })
})