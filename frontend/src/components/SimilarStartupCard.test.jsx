import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SimilarStartupCard from './SimilarStartupCard'

describe('SimilarStartupCard', () => {
  const mockStartup = {
    name: 'WeWork',
    industry: 'Real Estate',
    sub_industry: 'Coworking',
    death_cause: 'Cash Flow Problems',
    lifespan_days: 5000,
    total_funding_usd: 12000000000,
    stage_at_death: 'Series G',
    number_of_employees: 12000,
    similarity_score: 6
  }

  it('renders startup name and industry', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('WeWork')).toBeDefined()
    expect(screen.getByText(/Real Estate/)).toBeDefined()
  })

  it('displays match badge', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('High Match')).toBeDefined()
  })

  it('displays medium match for score 4-5', () => {
    const startup = { ...mockStartup, similarity_score: 4 }
    render(<SimilarStartupCard startup={startup} index={0} />)
    expect(screen.getByText('Medium Match')).toBeDefined()
  })

  it('displays low match for score 1-3', () => {
    const startup = { ...mockStartup, similarity_score: 2 }
    render(<SimilarStartupCard startup={startup} index={0} />)
    expect(screen.getByText('Low Match')).toBeDefined()
  })

  it('shows formatted funding amount', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText(/\$12,?000\.0M/)).toBeDefined()
  })

  it('shows formatted lifespan', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('5,000 days')).toBeDefined()
  })

  it('displays death cause', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('Cash Flow Problems')).toBeDefined()
  })

  it('displays stage at death', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('Series G')).toBeDefined()
  })

  it('displays employee count', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText('12,000')).toBeDefined()
  })

  it('shows similarity score bar', () => {
    const { container } = render(<SimilarStartupCard startup={mockStartup} index={0} />)
    const progressBar = container.querySelector('.from-red-500')
    expect(progressBar).toBeDefined()
  })

  it('handles missing optional fields', () => {
    const minimalStartup = {
      name: 'TestStartup',
      industry: 'Tech',
      similarity_score: 3
    }
    render(<SimilarStartupCard startup={minimalStartup} index={0} />)
    expect(screen.getByText('TestStartup')).toBeDefined()
  })

  it('renders sub_industry when provided', () => {
    render(<SimilarStartupCard startup={mockStartup} index={0} />)
    expect(screen.getByText(/Coworking/)).toBeDefined()
  })

  it('shows N/A for missing death cause', () => {
    const startup = { ...mockStartup, death_cause: null }
    render(<SimilarStartupCard startup={startup} index={0} />)
    expect(screen.getByText('N/A')).toBeDefined()
  })
})