import { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format, isBefore, startOfDay } from 'date-fns'
import Button from '../components/Button'
import { createBooking, getBookedSlots, isSlotBooked, sendBookingConfirmation } from '../lib/bookings'

const priceCards = [
  {
    name: 'Bath & Brush',
    accent: 'pink',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '$45+' },
      { size: 'Medium', weight: '21-40 lbs', price: '$55+' },
      { size: 'Large', weight: '41-70 lbs', price: '$70+' },
      { size: 'XL', weight: '71+ lbs', price: '$85+' },
    ],
  },
  {
    name: 'Haircut',
    accent: 'blue',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '$65+' },
      { size: 'Medium', weight: '21-40 lbs', price: '$80+' },
      { size: 'Large', weight: '41-70 lbs', price: '$95+' },
      { size: 'XL', weight: '71+ lbs', price: '$115+' },
    ],
  },
  {
    name: 'Full Groom',
    accent: 'yellow',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '$85+' },
      { size: 'Medium', weight: '21-40 lbs', price: '$105+' },
      { size: 'Large', weight: '41-70 lbs', price: '$130+' },
      { size: 'XL', weight: '71+ lbs', price: '$155+' },
    ],
  },
  {
    name: 'Nail Trim',
    accent: 'cream',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '$15' },
      { size: 'Medium', weight: '21-40 lbs', price: '$15' },
      { size: 'Large', weight: '41-70 lbs', price: '$20' },
      { size: 'XL', weight: '71+ lbs', price: '$20' },
    ],
  },
  {
    name: 'Puppy Groom',
    accent: 'pink',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '$55+' },
      { size: 'Medium', weight: '21-40 lbs', price: '$65+' },
      { size: 'Large', weight: '41-70 lbs', price: '$80+' },
      { size: 'XL', weight: '71+ lbs', price: '$95+' },
    ],
  },
  {
    name: 'De-shedding Add-on',
    accent: 'blue',
    tiers: [
      { size: 'Small', weight: 'Up to 20 lbs', price: '+$25' },
      { size: 'Medium', weight: '21-40 lbs', price: '+$35' },
      { size: 'Large', weight: '41-70 lbs', price: '+$45' },
      { size: 'XL', weight: '71+ lbs', price: '+$55' },
    ],
  },
]

const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']

const serviceOptions = [
  'Bath & Brush',
  'Haircut',
  'Full Groom',
  'Nail Trim',
  'Puppy Groom',
  'De-shedding Add-on',
]

function Booking() {
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const today = useMemo(() => startOfDay(new Date()), [])
  const selectedDateValue = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''

  useEffect(() => {
    if (!selectedDateValue) {
      setBookedSlots([])
      return
    }

    let isCurrent = true
    setIsLoadingSlots(true)
    setSelectedTime('')
    setMessage({ type: '', text: '' })

    getBookedSlots(selectedDateValue)
      .then((slots) => {
        if (isCurrent) {
          setBookedSlots(slots)
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setMessage({ type: 'error', text: error.message })
          setBookedSlots([])
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingSlots(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [selectedDateValue])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    if (!selectedDateValue || !selectedTime) {
      setMessage({ type: 'error', text: 'Please choose an appointment date and time slot.' })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    setIsSubmitting(true)

    try {
      const slotTaken = await isSlotBooked(selectedDateValue, selectedTime)

      if (slotTaken) {
        setBookedSlots((currentSlots) => [...new Set([...currentSlots, selectedTime])])
        setSelectedTime('')
        setMessage({
          type: 'error',
          text: 'Sorry, that time slot is no longer available. Please choose another time.',
        })
        return
      }

      const booking = await createBooking({
        owner_name: formData.get('ownerName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        dog_name: formData.get('dogName'),
        dog_breed: formData.get('breed'),
        service_type: formData.get('serviceType'),
        appointment_date: selectedDateValue,
        appointment_time: selectedTime,
        notes: formData.get('notes'),
        status: 'confirmed',
      })

      let emailWasSent = true
      let emailErrorMessage =
        'Your appointment is confirmed, but the confirmation email could not be sent. Please contact Manny if you need to cancel.'

      try {
        await sendBookingConfirmation(booking)
      } catch (error) {
        emailWasSent = false
        emailErrorMessage = error.message
      }

      form.reset()
      setSelectedDate(undefined)
      setSelectedTime('')
      setBookedSlots([])
      setMessage({
        type: emailWasSent ? 'success' : 'error',
        text: emailWasSent
          ? 'Your appointment is confirmed! Please check your email for the details and cancellation link.'
          : emailErrorMessage,
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section booking-page">
      <div className="section-heading">
        <p className="eyebrow">Appointments</p>
        <h1>Book a Grooming Visit</h1>
        <p>
          Choose an available date and time, then submit to confirm your appointment.
        </p>
      </div>

      <section className="price-list" aria-labelledby="price-list-heading">
        <div className="section-heading">
          <p className="eyebrow">Service Price List</p>
          <h2 id="price-list-heading">Pick Your Pup's Glow-Up</h2>
          <p>Prices vary by size, weight, coat condition, and grooming needs.</p>
        </div>

        <div className="price-grid">
          {priceCards.map((card) => (
            <article className={`price-card sticker-card price-${card.accent}`} key={card.name}>
              <span className="price-sparkle" aria-hidden="true">
                ✦
              </span>
              <h3>{card.name}</h3>
              <div className="price-tiers">
                {card.tiers.map((tier) => (
                  <p key={`${card.name}-${tier.size}`}>
                    <span>
                      <strong>{tier.size}</strong>
                      <small>{tier.weight}</small>
                    </span>
                    <b>{tier.price}</b>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className="form-card sticker-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Owner name
            <input name="ownerName" type="text" placeholder="Your name" required />
          </label>
          <label>
            Phone number
            <input name="phone" type="tel" placeholder="(555) 123-4567" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="hello@example.com" required />
          </label>
          <label>
            Dog name
            <input name="dogName" type="text" placeholder="Fluffy" required />
          </label>
          <label>
            Breed
            <input name="breed" type="text" placeholder="Goldendoodle, Poodle, etc." />
          </label>
          <label>
            Service type
            <select name="serviceType" defaultValue="" required>
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
          <div className="calendar-field full-span">
            <div>
              <h2>Choose a Date</h2>
              <p>Past dates are closed for booking.</p>
            </div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => isBefore(startOfDay(date), today)}
              footer={selectedDate ? `Selected date: ${format(selectedDate, 'MMMM d, yyyy')}` : ''}
            />
          </div>
          <div className="time-slot-field full-span">
            <div>
              <h2>Available Time Slots</h2>
              <p>
                {selectedDate
                  ? `Choose a time for ${format(selectedDate, 'MMMM d')}.`
                  : 'Select a date first to see available times.'}
              </p>
            </div>
            <div className="time-slot-grid" aria-live="polite">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedTime === slot

                return (
                  <button
                    className={isSelected ? 'time-slot selected' : 'time-slot'}
                    disabled={!selectedDate || isBooked || isLoadingSlots}
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    type="button"
                  >
                    <span>{slot}</span>
                    {isBooked && <small>Booked</small>}
                  </button>
                )
              })}
            </div>
          </div>
          <label className="full-span">
            Notes
            <textarea
              name="notes"
              placeholder="Tell us about coat condition, temperament, allergies, or special requests."
              rows="5"
            />
          </label>
        </div>

        <div className="form-footer">
          <p>Your appointment is confirmed! Manny will contact you if any details are needed.</p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>

        {message.text && <p className={`booking-message ${message.type}`}>{message.text}</p>}
      </form>
    </section>
  )
}

export default Booking
