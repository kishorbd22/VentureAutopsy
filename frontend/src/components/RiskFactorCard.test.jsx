import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RiskFactorCard from './RiskFactorCard'

describe('RiskFactorCard', () => {
  const mockFactor = {
    factor: 'High Industry Failure Rate',
    severity: 'high',
    weight: 20,
    description: 'Technology has many failures'
  }

  it('renders factor name and description', () => {
    render(<RiskFactorCard factor={mockFactor} index={0} />)
    expect(screen.getByText('High Industry Failure Rate')).toBeDefined()
    expect(screen.getByText('Technology has many failures')).toBeDefined()
  })

  it('displays severity badge', () => {
    render(<RiskFactorCard factor={mockFactor} index={0} />)
    expect(screen.getByText('High')).toBeDefined()
  })

  it('displays weight indicator', () => {
    render(<RiskFactorCard factor={mockFactor} index={0} />)
    expect(screen.getByText('20 pts')).toBeDefined()
  })

  it('renders with critical severity', () => {
    const criticalFactor = { ...mockFactor, severity: 'critical' }
    render(<RiskFactorCard factor={criticalFactor} index={0} />)
    expect(screen.getByText('Critical')).toBeDefined()
  })

  it('renders with medium severity', () => {
    const mediumFactor = { ...mockFactor, severity: 'medium' }
    render(<RiskFactorCard factor={mediumFactor} index={0} />)
    expect(screen.getByText('Medium')).toBeDefined()
  })

  it('renders with low severity', () => {
    const lowFactor = { ...mockFactor, severity: 'low' }
    render(<RiskFactorCard factor={lowFactor} index={0} />)
    expect(screen.getByText('Low')).toBeDefined()
  })

  it('applies correct severity styling', () => {
    const { container } = render(<RiskFactorCard factor={mockFactor} index={0} />)
    const card = container.firstChild
    expect(card.className).toContain('bg-orange-50')
    expect(card.className).toContain('border-orange-200')
  })

  it('shows severity icon', () => {
    render(<RiskFactorCard factor={mockFactor} index={0} />)
    expect(screen.getByText('🟠')).toBeDefined()
  })

  it('displays progress bar for weight', () => {
    const { container } = render(<RiskFactorCard factor={mockFactor} index={0} />)
    const progressBar = container.querySelector('.bg-orange-500')
    expect(progressBar).toBeDefined()
  })

  it('renders unique factors independently', () => {
    const factor2 = {
      factor: 'Low Cash Runway',
      severity: 'critical',
      weight: 25,
      description: 'Only 6 months remaining'
    }
    
    render(
      <>
        <RiskFactorCard factor={mockFactor} index={0} />
        <RiskFactorCard factor={factor2} index={1} />
      </>
    )
    
    expect(screen.getByText('High Industry Failure Rate')).toBeDefined()
    expect(screen.getByText('Low Cash Runway')).toBeDefined()
  })
})