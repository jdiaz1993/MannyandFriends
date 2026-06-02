import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingAdminCard from '../components/BookingAdminCard'
import Button from '../components/Button'
import { deleteBooking, fetchAdminBookings, updateBookingStatus } from '../lib/adminBookings'
import { supabase } from '../lib/supabase'

const filters = ['all', 'confirmed', 'cancelled', 'completed']

function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return bookings
    }

    return bookings.filter((booking) => booking.status === activeFilter)
  }, [activeFilter, bookings])

  async function loadBookings() {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const data = await fetchAdminBookings()
      setBookings(data)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  async function handleStatusUpdate(id, status) {
    setUpdatingId(id)
    setMessage({ type: '', text: '' })

    try {
      await updateBookingStatus(id, status)
      setBookings((currentBookings) =>
        currentBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
      )
      setMessage({ type: 'success', text: `Booking marked ${status}.` })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingId('')
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this booking? This cannot be undone.')

    if (!shouldDelete) {
      return
    }

    setUpdatingId(id)
    setMessage({ type: '', text: '' })

    try {
      await deleteBooking(id)
      setBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== id))
      setMessage({ type: 'success', text: 'Booking deleted.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingId('')
    }
  }

  async function handleLogout() {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <section className="page-section admin-page">
      <div className="admin-dashboard-header sticker-card">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Booking Manager</h1>
          <p>Review appointments, update statuses, and keep Manny's calendar tidy.</p>
        </div>
        <div className="admin-header-actions">
          <Button variant="secondary" onClick={loadBookings} disabled={isLoading}>
            Refresh
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="admin-filter-bar" aria-label="Booking status filters">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter ? 'filter-chip active' : 'filter-chip'}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      {message.text && <p className={`booking-message ${message.type}`}>{message.text}</p>}

      {isLoading ? (
        <div className="admin-empty-state sticker-card">
          <h2>Loading bookings...</h2>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="admin-booking-list">
          {filteredBookings.map((booking) => (
            <BookingAdminCard
              booking={booking}
              isUpdating={updatingId === booking.id}
              key={booking.id}
              onCancel={(id) => handleStatusUpdate(id, 'cancelled')}
              onComplete={(id) => handleStatusUpdate(id, 'completed')}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="admin-empty-state sticker-card">
          <h2>No bookings found.</h2>
          <p>Try another filter or refresh the dashboard.</p>
        </div>
      )}
    </section>
  )
}

export default AdminDashboard
