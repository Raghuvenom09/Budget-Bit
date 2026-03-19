import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

const TestComponent = () => {
  const { user, profile, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'loaded'}</span>
      <span data-testid="user">{user ? 'has-user' : 'no-user'}</span>
      <span data-testid="profile">{profile ? 'has-profile' : 'no-profile'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })
})
