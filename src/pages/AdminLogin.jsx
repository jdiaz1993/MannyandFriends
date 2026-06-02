import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setIsLoading(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (loginError) {
      setError('Login failed. Please check your email and password.')
      return
    }

    navigate('/admin')
  }

  return (
    <section className="page-section admin-login-page">
      <form className="admin-login-card sticker-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Doodles & Friends by Manny</p>
        <h1>Admin Login</h1>
        <p>Sign in to manage appointments, statuses, and booking history.</p>

        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
            type="password"
            value={password}
          />
        </label>

        {error && <p className="booking-message error">{error}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </section>
  )
}

export default AdminLogin
