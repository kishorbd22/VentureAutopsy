import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with label and value', () => {
    render(<ProgressBar value={60} max={100} label="Progress" />)
    expect(screen.getByText('Progress')).toBeDefined()
    expect(screen.getByText('60%')).toBeDefined()
  })

  it('calculates percentage correctly', () => {
    render(<ProgressBar value={50} max={200} label="Progress" />)
    expect(screen.getByText('25%')).toBeDefined()
  })

  it('caps at 100%', () => {
    render(<ProgressBar value={150} max={100} label="Progress" />)
    expect(screen.getByText('100%')).toBeDefined()
  })

  it('displays no label when not provided', () => {
    render(<ProgressBar value={50} max={100} />)
    expect(screen.queryByText('50%')).toBeDefined()
  })

  it('hides value when showValue is false', () => {
    render(<ProgressBar value={75} max={100} label="Progress" showValue={false} />)
    expect(screen.queryByText('75%')).toBeNull()
  })

  it('applies correct color class', () => {
    const { container } = render(<ProgressBar value={50} max={100} color="red" />)
    const bar = container.querySelector('.bg-red-500')
    expect(bar).toBeDefined()
  })

  it('uses default color when not specified', () => {
    const { container } = render(<ProgressBar value={50} max={100} />)
    const bar = container.querySelector('.bg-blue-500')
    expect(bar).toBeDefined()
  })

  it('applies correct height class', () => {
    const { container } = render(<ProgressBar value={50} max={100} height="lg" />)
    const bar = container.querySelector('.h-4')
    expect(bar).toBeDefined()
  })

  it('renders with gradient color', () => {
    const { container } = render(<ProgressBar value={50} max={100} color="gradient" />)
    const bar = container.querySelector('.from-purple-500')
    expect(bar).toBeDefined()
  })
})