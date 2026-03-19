import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: BrowserRouter })
}

describe('App', () => {
  it('renders without crashing', () => {
    renderWithRouter(<App />)
  })

  it('shows 404 page for unknown routes', () => {
    renderWithRouter(<App />, { route: '/nonexistent' })
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
  })
})
