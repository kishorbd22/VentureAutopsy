import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnalysisReport from '../pages/AnalysisReport'

const TestWrapper = ({ children }) => (
  <div>{children}</div>
)
TestWrapper.displayName = 'TestWrapper'

describe('AnalysisReport', () => {
  it('renders', () => {
    render(<AnalysisReport />, { wrapper: TestWrapper })
    expect(screen.getByText('Analysis Report')).toBeDefined()
  })
})