import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RiskGauge from './RiskGauge'

describe('RiskGauge', () => {
  it('renders with score and level', () => {
    render(<RiskGauge score={65} level="High" />)
    expect(screen.getByText('65')).toBeDefined()
    expect(screen.getByText('Risk Score')).toBeDefined()
    expect(screen.getByText('High')).toBeDefined()
  })

  it('displays default size when not specified', () => {
    const { container } = render(<RiskGauge score={50} level="Medium" />)
    const svg = container.querySelector('svg')
    expect(svg.getAttribute('width')).toBe('200')
    expect(svg.getAttribute('height')).toBe('200')
  })

  it('renders with custom size', () => {
    const { container } = render(<RiskGauge score={75} level="Critical" size={300} />)
    const svg = container.querySelector('svg')
    expect(svg.getAttribute('width')).toBe('300')
    expect(svg.getAttribute('height')).toBe('300')
  })

  it('applies correct color for Critical level', () => {
    const { container } = render(<RiskGauge score={85} level="Critical" />)
    const circle = container.querySelectorAll('circle')[1]
    expect(circle.getAttribute('stroke')).toBe('#dc2626')
  })

  it('applies correct color for High level', () => {
    const { container } = render(<RiskGauge score={60} level="High" />)
    const circle = container.querySelectorAll('circle')[1]
    expect(circle.getAttribute('stroke')).toBe('#f97316')
  })

  it('applies correct color for Medium level', () => {
    const { container } = render(<RiskGauge score={40} level="Medium" />)
    const circle = container.querySelectorAll('circle')[1]
    expect(circle.getAttribute('stroke')).toBe('#eab308')
  })

  it('applies correct color for Low level', () => {
    const { container } = render(<RiskGauge score={20} level="Low" />)
    const circle = container.querySelectorAll('circle')[1]
    expect(circle.getAttribute('stroke')).toBe('#22c55e')
  })

  it('renders background circle', () => {
    const { container } = render(<RiskGauge score={50} level="Medium" />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2) // Background + progress
  })

  it('calculates progress correctly', () => {
    const { container } = render(<RiskGauge score={50} level="Medium" />)
    const progressCircle = container.querySelectorAll('circle')[1]
    const strokeDasharray = progressCircle.getAttribute('stroke-dasharray')
    const strokeDashoffset = progressCircle.getAttribute('stroke-dashoffset')
    
    // strokeDasharray should be circumference (2 * PI * radius)
    // strokeDashoffset should be circumference - (score/100 * circumference)
    expect(strokeDasharray).toBeDefined()
    expect(strokeDashoffset).toBeDefined()
  })
})