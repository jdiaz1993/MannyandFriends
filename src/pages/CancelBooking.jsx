import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { cancelBookingByToken, getBookingByCancellationToken } from '../lib/bookings'

function CancelBooking() {
  const { token } = useParams()
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let isCurrent = true

    async function loadBooking() {
      setIsLoading(true)
      setMessage({ type: '', text: '' })

      try {
        const data = await getBookingByCancellationToken(token)

        if (isCurrent) {
          setBooking(data)
        }
      } catch (error) {
        if (isCurrent) {
          setMessage({ type: 'error', text: error.message })
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadBooking()

    return () => {
      isCurrent = false
    }
  }, [token])

  async function handleCancel() {
    setIsCancelling(true)
    setMessage({ type: '', text: '' })

    try {
      const cancelledBooking = await cancelBookingByToken(token)
      setBooking(cancelledBooking)
      setMessage({
        type: 'success',
        text: 'Your appointment has been cancelled. This time slot is now available again.',
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <section className="page-section cancel-page">
      <div className="cancel-card sticker-card">
        <p className="eyebrow">Appointment Cancellation</p>
        <h1>Cancel Your Grooming Visit</h1>

        {isLoading && <p>Loading your appointment...</p>}

        {!isLoading && booking && (
          <>
            <div className="cancel-booking-details">
              <p>
                <strong>Dog</strong>
                <span>{booking.dog_name}</span>
              </p>
              <p>
                <strong>Service</strong>
                <span>{booking.service_type}</span>
              </p>
              <p>
                <strong>Date</strong>
                <span>{booking.appointment_date}</span>
              </p>
              <p>
                <strong>Time</strong>
                <span>{booking.appointment_time}</span>
              </p>
              <p>
                <strong>Status</strong>
                <span>{booking.status}</span>
              </p>
            </div>

            {booking.status === 'cancelled' ? (
              <p className="booking-message success">This appointment is already cancelled.</p>
            ) : (
              <Button onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </Button>
            )}
          </>
        )}

        {message.text && <p className={`booking-message ${message.type}`}>{message.text}</p>}

        <Link className="cancel-home-link" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default CancelBooking
