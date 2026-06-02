import { requireSupabase, siteUrl } from './supabase'

function createCancellationToken() {
  const bytes = new Uint8Array(32)
  window.crypto.getRandomValues(bytes)

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function buildCancellationLink(token) {
  return `${siteUrl}/cancel/${token}`
}

export async function getBookedSlots(appointmentDate) {
  const client = requireSupabase()
  const { data, error } = await client.rpc('get_booked_slots', {
    p_appointment_date: appointmentDate,
  })

  if (error) {
    throw new Error('Unable to load available time slots.')
  }

  return data.map((booking) => booking.appointment_time)
}

export async function isSlotBooked(appointmentDate, appointmentTime) {
  const bookedSlots = await getBookedSlots(appointmentDate)

  return bookedSlots.includes(appointmentTime)
}

export async function createBooking(booking) {
  const client = requireSupabase()
  const cancellationToken = createCancellationToken()
  const bookingWithToken = {
    ...booking,
    cancellation_token: cancellationToken,
  }
  const { error } = await client.from('bookings').insert(bookingWithToken)

  if (error) {
    throw new Error('Unable to submit booking request.')
  }

  return bookingWithToken
}

export async function sendBookingConfirmation(booking) {
  const client = requireSupabase()
  const { data, error } = await client.functions.invoke('send-booking-confirmation', {
    body: {
      booking,
      cancellationLink: buildCancellationLink(booking.cancellation_token),
    },
  })

  if (error) {
    let details = data?.error ? ` ${data.error}` : ''

    if (!details && error.context) {
      try {
        const response = error.context.clone ? error.context.clone() : error.context
        const errorBody = await response.json()
        details = errorBody?.error ? ` ${errorBody.error}` : ''
      } catch {
        details = error.message ? ` ${error.message}` : ''
      }
    }

    throw new Error(`Booking saved, but the confirmation email could not be sent.${details}`)
  }
}

async function getFunctionErrorDetails(error) {
  let details = error.message ? ` ${error.message}` : ''

  if (error.context) {
    try {
      const response = error.context.clone ? error.context.clone() : error.context
      const errorBody = await response.json()
      details = errorBody?.error ? ` ${errorBody.error}` : details
    } catch {
      return details
    }
  }

  return details
}

export async function getBookingByCancellationToken(token) {
  const client = requireSupabase()
  const { data, error } = await client.functions.invoke('cancel-booking', {
    body: {
      action: 'lookup',
      token,
    },
  })

  if (error) {
    const details = await getFunctionErrorDetails(error)
    throw new Error(`Unable to load this appointment.${details}`)
  }

  return data.booking
}

export async function cancelBookingByToken(token) {
  const client = requireSupabase()
  const { data, error } = await client.functions.invoke('cancel-booking', {
    body: {
      action: 'cancel',
      token,
    },
  })

  if (error) {
    const details = await getFunctionErrorDetails(error)
    throw new Error(`Unable to cancel this appointment.${details}`)
  }

  return data.booking
}
