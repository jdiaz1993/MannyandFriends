function BookingAdminCard({ booking, onCancel, onComplete, onDelete, isUpdating }) {
  const status = booking.status || 'confirmed'

  return (
    <article className="admin-booking-card sticker-card">
      <div className="admin-booking-header">
        <div>
          <p className="eyebrow">{booking.appointment_date}</p>
          <h2>
            {booking.dog_name} <span>with {booking.owner_name}</span>
          </h2>
        </div>
        <span className={`status-pill status-${status}`}>{status}</span>
      </div>

      <div className="admin-booking-grid">
        <p>
          <strong>Time</strong>
          <span>{booking.appointment_time}</span>
        </p>
        <p>
          <strong>Phone</strong>
          <span>{booking.phone}</span>
        </p>
        <p>
          <strong>Email</strong>
          <span>{booking.email}</span>
        </p>
        <p>
          <strong>Breed</strong>
          <span>{booking.dog_breed || 'Not provided'}</span>
        </p>
        <p>
          <strong>Service</strong>
          <span>{booking.service_type}</span>
        </p>
        <p>
          <strong>Notes</strong>
          <span>{booking.notes || 'No notes'}</span>
        </p>
      </div>

      <div className="admin-card-actions">
        <button
          className="admin-action complete"
          disabled={isUpdating || status === 'completed'}
          onClick={() => onComplete(booking.id)}
          type="button"
        >
          Mark completed
        </button>
        <button
          className="admin-action cancel"
          disabled={isUpdating || status === 'cancelled'}
          onClick={() => onCancel(booking.id)}
          type="button"
        >
          Cancel booking
        </button>
        <button
          className="admin-action delete"
          disabled={isUpdating}
          onClick={() => onDelete(booking.id)}
          type="button"
        >
          Delete booking
        </button>
      </div>
    </article>
  )
}

export default BookingAdminCard
