import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Button from './Button'
import { supabase } from '../lib/supabase'

function ProtectedAdminRoute({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    isAdmin: false,
    error: '',
  })

  useEffect(() => {
    let isCurrent = true

    async function checkAdminAccess() {
      if (!supabase) {
        setAuthState({
          isLoading: false,
          isLoggedIn: false,
          isAdmin: false,
          error: 'Supabase is not configured.',
        })
        return
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!isCurrent) {
        return
      }

      if (sessionError || !user) {
        setAuthState({
          isLoading: false,
          isLoggedIn: false,
          isAdmin: false,
          error: '',
        })
        return
      }

      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!isCurrent) {
        return
      }

      setAuthState({
        isLoading: false,
        isLoggedIn: true,
        isAdmin: Boolean(admin && !adminError),
        error: adminError ? 'Access denied.' : '',
      })
    }

    checkAdminAccess()

    return () => {
      isCurrent = false
    }
  }, [])

  async function handleLogout() {
    await supabase?.auth.signOut()
    window.location.assign('/admin/login')
  }

  if (authState.isLoading) {
    return (
      <section className="page-section admin-page">
        <div className="admin-shell sticker-card">
          <p className="eyebrow">Admin</p>
          <h1>Checking access...</h1>
        </div>
      </section>
    )
  }

  if (!authState.isLoggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  if (!authState.isAdmin) {
    return (
      <section className="page-section admin-page">
        <div className="admin-shell sticker-card">
          <p className="eyebrow">Admin</p>
          <h1>Access denied.</h1>
          <p>{authState.error || 'Your account is not on the admin list.'}</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </section>
    )
  }

  return children
}

export default ProtectedAdminRoute
