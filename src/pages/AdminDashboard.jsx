import { format, parseISO } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useNavigate } from 'react-router-dom'
import BookingAdminCard from '../components/BookingAdminCard'
import Button from '../components/Button'
import { deleteBooking, fetchAdminBookings, updateBookingStatus } from '../lib/adminBookings'
import {
  deleteContactMessage,
  fetchAdminContactMessages,
  updateContactMessageStatus,
} from '../lib/contactMessages'
import { supabase } from '../lib/supabase'

const filters = ['all', 'confirmed', 'cancelled', 'completed']

function shouldAutoCompleteBooking(booking, todayKey) {
  const status = booking.status || 'confirmed'
  return status === 'confirmed' && booking.appointment_date < todayKey
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [contactMessages, setContactMessages] = useState([])
  const [isLoadingContactMessages, setIsLoadingContactMessages] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [updatingMessageId, setUpdatingMessageId] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return bookings
    }

    return bookings.filter((booking) => booking.status === activeFilter)
  }, [activeFilter, bookings])

  const bookingsByDate = useMemo(() => {
    return filteredBookings.reduce((bookingMap, booking) => {
      const dateKey = booking.appointment_date
      const currentBookings = bookingMap.get(dateKey) ?? []
      bookingMap.set(dateKey, [...currentBookings, booking])
      return bookingMap
    }, new Map())
  }, [filteredBookings])

  const bookedDates = useMemo(() => {
    return [...bookingsByDate.keys()].map((dateKey) => parseISO(dateKey))
  }, [bookingsByDate])

  const selectedDateBookings = useMemo(() => {
    return bookingsByDate.get(format(selectedDate, 'yyyy-MM-dd')) ?? []
  }, [bookingsByDate, selectedDate])

  const monthBookingCount = useMemo(() => {
    return filteredBookings.filter((booking) => {
      const bookingDate = parseISO(booking.appointment_date)
      return (
        bookingDate.getMonth() === currentMonth.getMonth() &&
        bookingDate.getFullYear() === currentMonth.getFullYear()
      )
    }).length
  }, [currentMonth, filteredBookings])

  const unreadMessageCount = useMemo(() => {
    return contactMessages.filter((contactMessage) => contactMessage.status === 'unread').length
  }, [contactMessages])

  const loadBookings = useCallback(async function loadBookings() {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const data = await fetchAdminBookings()
      const todayKey = format(new Date(), 'yyyy-MM-dd')
      const pastConfirmedBookings = data.filter((booking) => shouldAutoCompleteBooking(booking, todayKey))
      let updatedBookings = data

      if (pastConfirmedBookings.length > 0) {
        await Promise.all(pastConfirmedBookings.map((booking) => updateBookingStatus(booking.id, 'completed')))

        const completedBookingIds = new Set(pastConfirmedBookings.map((booking) => booking.id))
        updatedBookings = data.map((booking) =>
          completedBookingIds.has(booking.id) ? { ...booking, status: 'completed' } : booking,
        )
      }

      setBookings(updatedBookings)

      if (updatedBookings.length > 0) {
        const firstBookingDate = parseISO(updatedBookings[0].appointment_date)
        setSelectedDate(firstBookingDate)
        setCurrentMonth(firstBookingDate)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadContactMessages = useCallback(async function loadContactMessages() {
    setIsLoadingContactMessages(true)

    try {
      const data = await fetchAdminContactMessages()
      setContactMessages(data)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoadingContactMessages(false)
    }
  }, [])

  const loadDashboard = useCallback(function loadDashboard() {
    loadBookings()
    loadContactMessages()
  }, [loadBookings, loadContactMessages])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

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

  async function handleContactMessageStatusUpdate(id, status) {
    setUpdatingMessageId(id)
    setMessage({ type: '', text: '' })

    try {
      await updateContactMessageStatus(id, status)
      setContactMessages((currentMessages) =>
        currentMessages.map((contactMessage) =>
          contactMessage.id === id ? { ...contactMessage, status } : contactMessage,
        ),
      )
      setMessage({ type: 'success', text: `Inquiry marked ${status}.` })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingMessageId('')
    }
  }

  async function handleContactMessageDelete(id) {
    const shouldDelete = window.confirm('Delete this inquiry? This cannot be undone.')

    if (!shouldDelete) {
      return
    }

    setUpdatingMessageId(id)
    setMessage({ type: '', text: '' })

    try {
      await deleteContactMessage(id)
      setContactMessages((currentMessages) => currentMessages.filter((contactMessage) => contactMessage.id !== id))
      setMessage({ type: 'success', text: 'Inquiry deleted.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUpdatingMessageId('')
    }
  }

  async function handleLogout() {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  function getDayBookingCount(date) {
    return bookingsByDate.get(format(date, 'yyyy-MM-dd'))?.length ?? 0
  }

  return (
    <section className="page-section admin-page">
      <div className="admin-dashboard-header sticker-card">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Booking Calendar</h1>
          <p>Browse appointments by month, then tap a day to manage bookings.</p>
        </div>
        <div className="admin-header-actions">
          <Button variant="secondary" onClick={loadDashboard} disabled={isLoading || isLoadingContactMessages}>
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

      <div className="admin-calendar-dashboard">
        <div className="admin-calendar-field sticker-card">
          <div className="admin-calendar-intro">
            <div>
              <p className="eyebrow">{monthBookingCount} appointments in {format(currentMonth, 'MMMM')}</p>
              <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
            </div>
            <p className="admin-calendar-hint">Days with bookings are highlighted. Select a day to see details below.</p>
          </div>

          {isLoading ? (
            <p className="admin-calendar-loading">Loading calendar...</p>
          ) : (
            <DayPicker
              className="admin-calendar-picker"
              components={{
                DayButton: ({ day, modifiers, ...buttonProps }) => {
                  const bookingCount = getDayBookingCount(day.date)

                  return (
                    <button {...buttonProps}>
                      <span className="admin-calendar-day-label">{day.date.getDate()}</span>
                      {bookingCount > 0 && (
                        <span className="admin-calendar-day-count" aria-hidden="true">
                          {bookingCount}
                        </span>
                      )}
                      {modifiers.booked && <span className="sr-only">{bookingCount} appointments</span>}
                    </button>
                  )
                },
              }}
              footer={
                selectedDate
                  ? `Selected: ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`
                  : 'Select a day to view appointments.'
              }
              mode="single"
              month={currentMonth}
              modifiers={{
                booked: bookedDates,
                selected: selectedDate,
              }}
              modifiersClassNames={{
                booked: 'admin-day-booked',
              }}
              onMonthChange={setCurrentMonth}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                }
              }}
              selected={selectedDate}
              showOutsideDays
            />
          )}
        </div>

        {!isLoading && filteredBookings.length === 0 && (
          <div className="admin-empty-state sticker-card">
            <h2>No bookings found.</h2>
            <p>Try another filter or refresh the dashboard.</p>
          </div>
        )}

        {!isLoading && filteredBookings.length > 0 && (
          <div className="admin-selected-day sticker-card">
            <div className="admin-selected-day-header">
              <p className="eyebrow">Appointments</p>
              <h2>{format(selectedDate, 'MMMM d, yyyy')}</h2>
              <p>
                {selectedDateBookings.length} appointment{selectedDateBookings.length === 1 ? '' : 's'} on this day
              </p>
            </div>

            {selectedDateBookings.length > 0 ? (
              <div className="admin-day-bookings">
                {selectedDateBookings.map((booking) => (
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
              <div className="admin-empty-state compact">
                <h3>No bookings on this day.</h3>
                <p>Pick a highlighted date on the calendar to review appointments.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <section className="admin-inquiries-section sticker-card">
        <div className="admin-inquiries-header">
          <div>
            <p className="eyebrow">Inquiries</p>
            <h2>Messages</h2>
            <p>
              {unreadMessageCount} unread message{unreadMessageCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {isLoadingContactMessages ? (
          <div className="admin-empty-state compact">
            <h3>Loading inquiries...</h3>
          </div>
        ) : contactMessages.length > 0 ? (
          <div className="admin-inquiry-list">
            {contactMessages.map((contactMessage) => {
              const isUpdatingMessage = updatingMessageId === contactMessage.id
              const nextStatus = contactMessage.status === 'read' ? 'unread' : 'read'

              return (
                <article className="admin-inquiry-card" key={contactMessage.id}>
                  <div className="admin-inquiry-card-header">
                    <div>
                      <p className="eyebrow">
                        {contactMessage.created_at
                          ? format(parseISO(contactMessage.created_at), 'MMM d, yyyy h:mm a')
                          : 'New inquiry'}
                      </p>
                      <h3>{contactMessage.name}</h3>
                      <a href={`mailto:${contactMessage.email}`}>{contactMessage.email}</a>
                    </div>
                    <span className={`status-pill status-${contactMessage.status}`}>{contactMessage.status}</span>
                  </div>
                  <p className="admin-inquiry-message">{contactMessage.message}</p>
                  <div className="admin-card-actions">
                    <button
                      className="admin-action complete"
                      disabled={isUpdatingMessage}
                      onClick={() => handleContactMessageStatusUpdate(contactMessage.id, nextStatus)}
                      type="button"
                    >
                      Mark {nextStatus}
                    </button>
                    <button
                      className="admin-action delete"
                      disabled={isUpdatingMessage}
                      onClick={() => handleContactMessageDelete(contactMessage.id)}
                      type="button"
                    >
                      Delete inquiry
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="admin-empty-state compact">
            <h3>No inquiries yet.</h3>
            <p>Messages from the Contact page will appear here.</p>
          </div>
        )}
      </section>
    </section>
  )
}

export default AdminDashboard
