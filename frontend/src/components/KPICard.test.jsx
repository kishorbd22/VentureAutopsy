import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KPICard from './KPICard'

describe('KPICard', () => {
  it('renders with title and value', () => {
    render(<KPICard title="Test Metric" value={42} />)
    expect(screen.getByText('Test Metric')).toBeDefined()
    expect(screen.getByText('42')).toBeDefined()
  })

  it('displays unit text', () => {
    render(<KPICard title="Revenue" value={1000} unit="$" />)
    expect(screen.getByText('$')).toBeDefined()
  })

  it('renders icon', () => {
    render(<KPICard title="Users" value={50} icon="👥" />)
    expect(screen.getByText('👥')).toBeDefined()
  })

  it('displays trend indicator', () => {
    render(
      <KPICard 
        title="Growth" 
        value={75} 
        trend="up" 
        trendValue="12%" 
      />
    )
    expect(screen.getByText('↑ 12%')).toBeDefined()
  })

  it('displays negative trend', () => {
    render(
      <KPICard 
        title="Loss" 
        value={20} 
        trend="down" 
        trendValue="5%" 
      />
    )
    expect(screen.getByText('↓ 5%')).toBeDefined()
  })

  it('applies correct color class', () => {
    const { container } = render(<KPICard title="Test" value={10} color="red" />)
    const iconContainer = container.querySelector('.bg-red-500')
    expect(iconContainer).toBeTruthy()
  })

  it('uses default color when not specified', () => {
    const { container } = render(<KPICard title="Test" value={10} />)
    const iconContainer = container.querySelector('.bg-blue-500')
    expect(iconContainer).toBeTruthy()
  })
})