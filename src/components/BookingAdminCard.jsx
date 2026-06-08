function BookingAdminCard({ booking, onCancel, onComplete, onDelete, isUpdating }) {
  const status = booking.status || 'confirmed'
  const petType = booking.pet_type === 'Other' && booking.pet_type_other ? booking.pet_type_other : booking.pet_type
  const addOns = Array.isArray(booking.add_ons) ? booking.add_ons.join(', ') : booking.add_ons

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
          <strong>Add Ons</strong>
          <span>{addOns || 'None selected'}</span>
        </p>
        <p>
          <strong>Notes</strong>
          <span>{booking.notes || 'No notes'}</span>
        </p>
      </div>

      <details className="admin-record-details">
        <summary>Client & pet record</summary>
        <div className="admin-booking-grid">
          <p>
            <strong>Address</strong>
            <span>{booking.home_address || 'Not provided'}</span>
          </p>
          <p>
            <strong>City / State / Zip</strong>
            <span>{booking.city_state_zip || 'Not provided'}</span>
          </p>
          <p>
            <strong>Owner home</strong>
            <span>{booking.owner_home_phone || 'Not provided'}</span>
          </p>
          <p>
            <strong>Owner work</strong>
            <span>{booking.owner_work_phone || 'Not provided'}</span>
          </p>
          <p>
            <strong>Pet type</strong>
            <span>{petType || 'Not provided'}</span>
          </p>
          <p>
            <strong>Weight</strong>
            <span>{booking.pet_weight || 'Not provided'}</span>
          </p>
          <p>
            <strong>Sex</strong>
            <span>{booking.pet_sex || 'Not provided'}</span>
          </p>
          <p>
            <strong>Date of birth</strong>
            <span>{booking.pet_date_of_birth || 'Not provided'}</span>
          </p>
          <p>
            <strong>Color</strong>
            <span>{booking.pet_color || 'Not provided'}</span>
          </p>
          <p>
            <strong>Spayed / neutered</strong>
            <span>{booking.spayed_neutered || 'Not provided'}</span>
          </p>
        </div>
      </details>

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
