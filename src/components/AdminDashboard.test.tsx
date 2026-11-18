import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminDashboard from './AdminDashboard'

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the staff sign-in form when logged out', () => {
    render(<AdminDashboard />)
    expect(screen.getByRole('heading', { name: /staff sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in to back office/i })).toBeInTheDocument()
  })

  it('shows a login error when credentials are rejected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'invalid_credentials' }),
    }))
    render(<AdminDashboard />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in to back office/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('invalid_credentials')
    })
  })

  it('renders without onExit', () => {
    render(<AdminDashboard />)
    expect(screen.getByRole('heading', { name: /staff sign in/i })).toBeInTheDocument()
  })
})
