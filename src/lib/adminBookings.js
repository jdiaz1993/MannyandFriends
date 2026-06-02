import { requireSupabase } from './supabase'

const timeOrder = {
  '9:00 AM': 1,
  '10:30 AM': 2,
  '12:00 PM': 3,
  '1:30 PM': 4,
  '3:00 PM': 5,
  '4:30 PM': 6,
}

function sortBookings(bookings) {
  return [...bookings].sort((a, b) => {
    const dateComparison = a.appointment_date.localeCompare(b.appointment_date)

    if (dateComparison !== 0) {
      return dateComparison
    }

    return (timeOrder[a.appointment_time] ?? 99) - (timeOrder[b.appointment_time] ?? 99)
  })
}

export async function fetchAdminBookings() {
  const client = requireSupabase()
  const { data, error } = await client
    .from('bookings')
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  if (error) {
    throw new Error('Unable to load bookings.')
  }

  return sortBookings(data)
}

export async function updateBookingStatus(id, status) {
  const client = requireSupabase()
  const { error } = await client.from('bookings').update({ status }).eq('id', id)

  if (error) {
    throw new Error('Unable to update booking.')
  }
}

export async function deleteBooking(id) {
  const client = requireSupabase()
  const { error } = await client.from('bookings').delete().eq('id', id)

  if (error) {
    throw new Error('Unable to delete booking.')
  }
}
