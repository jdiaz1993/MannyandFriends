import { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format, isBefore, startOfDay } from 'date-fns'
import Button from '../components/Button'
import { createBooking, getBookedSlots, isSlotBooked, sendBookingConfirmation } from '../lib/bookings'

const bathIncludes = [
  'Double rinse for sensitive skin',
  'Nail cut and filing',
  'Teeth brushing',
  'Ear cleaning',
  'By request: Oat bath and gland expressing',
]

const priceSections = [
  {
    title: 'Dog Grooming',
    cards: [
      {
        name: 'Bath Only',
        accent: 'pink',
        description: bathIncludes,
        tiers: [
          { size: 'Extra Small', weight: '', price: '$35 to $55' },
          { size: 'Small', weight: '', price: '$40 to $65' },
          { size: 'Medium', weight: '', price: '$45 to $65' },
          { size: 'Large', weight: '', price: '$55 to $80' },
          { size: 'Extra Large', weight: '', price: '$75 to $100' },
        ],
      },
      {
        name: 'Bath and Tidy Up',
        accent: 'blue',
        description: ['All bath services listed', 'Face trim', 'Sanitary trim'],
        tiers: [
          { size: 'Extra Small', weight: '', price: '$50 to $70' },
          { size: 'Small', weight: '', price: '$55 to $75' },
          { size: 'Medium', weight: '', price: '$60 to $80' },
          { size: 'Large', weight: '', price: '$70 to $95' },
          { size: 'Extra Large', weight: '', price: '$90 to $115' },
        ],
      },
      {
        name: 'Full Groom',
        accent: 'yellow',
        description: ['All bath services listed', 'All clean-up services listed'],
        tiers: [
          { size: 'Extra Small', weight: '', price: '$65 to $80' },
          { size: 'Small', weight: '', price: '$75 to $95' },
          { size: 'Medium', weight: '', price: '$95 to $125' },
          { size: 'Large', weight: '', price: '$125 to $175' },
          { size: 'Extra Large', weight: '', price: '$160 to $225' },
        ],
      },
    ],
  },
  {
    title: 'Cat Grooming',
    cards: [
      {
        name: 'Bath Only',
        accent: 'pink',
        description: bathIncludes,
        tiers: [
          { size: 'Small', weight: '', price: '$85 to $140' },
          { size: 'Medium', weight: '', price: '$95 to $150' },
        ],
      },
      {
        name: 'Full Groom',
        accent: 'yellow',
        description: ['All bath services listed', 'Full hair cut'],
        tiers: [
          { size: 'Small', weight: '', price: '$95 to $125' },
          { size: 'Medium', weight: '', price: '$140 to $175' },
        ],
      },
    ],
  },
]

const addOns = [
  {
    name: 'Dematting',
    description: 'Depending on thoroughness of knots, this can be a demanding process.',
    price: '$25 / 30 mins',
  },
  {
    name: 'Parents to Join',
    description: 'Parents are welcome to stay to comfort their pet during the grooming process.',
    price: '$25 / 30 mins',
  },
  {
    name: 'Additional Time',
    description: 'For pets who need extra care, calming time, or additional handling support.',
    price: '$25 / 10 mins',
  },
]

const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']

const serviceOptions = [
  'Dog Bath Only',
  'Dog Bath and Tidy Up',
  'Dog Full Groom',
  'Cat Bath Only',
  'Cat Full Groom',
]

const addOnOptions = ['Dematting', 'Parent Join', 'Additional Time']

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
    const selectedAddOns = formData.getAll('addOns')

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
        home_address: formData.get('homeAddress'),
        city_state_zip: formData.get('cityStateZip'),
        owner_home_phone: formData.get('ownerHomePhone'),
        owner_work_phone: formData.get('ownerWorkPhone'),
        dog_name: formData.get('dogName'),
        dog_breed: formData.get('breed'),
        pet_type: formData.get('petType'),
        pet_type_other: formData.get('petTypeOther'),
        pet_weight: formData.get('petWeight'),
        pet_sex: formData.get('petSex'),
        pet_date_of_birth: formData.get('petDateOfBirth') || null,
        pet_color: formData.get('petColor'),
        spayed_neutered: formData.get('spayedNeutered'),
        service_type: formData.get('serviceType'),
        add_ons: selectedAddOns,
        appointment_date: selectedDateValue,
        appointment_time: selectedTime,
        notes: formData.get('notes'),
        status: 'confirmed',
      })

      let emailWasSent = true

      try {
        await sendBookingConfirmation(booking)
      } catch {
        emailWasSent = false
      }

      form.reset()
      setSelectedDate(undefined)
      setSelectedTime('')
      setBookedSlots([])
      setMessage({
        type: 'success',
        text: emailWasSent
          ? 'Your appointment is confirmed! Please check your email for the details and cancellation link.'
          : 'Your appointment is confirmed! Manny will contact you if any details are needed.',
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

        {priceSections.map((section) => (
          <div className="price-section" key={section.title}>
            <h3 className="price-section-title">{section.title}</h3>
            <div className="price-grid">
              {section.cards.map((card) => (
                <article className={`price-card sticker-card price-${card.accent}`} key={card.name}>
                  <span className="price-sparkle" aria-hidden="true">
                    ✦
                  </span>
                  <h3>{card.name}</h3>
                  <ul className="price-description">
                    {card.description.map((item) => (
                      <li key={`${card.name}-${item}`}>{item}</li>
                    ))}
                  </ul>
                  <div className="price-tiers">
                    {card.tiers.map((tier) => (
                      <p key={`${section.title}-${card.name}-${tier.size}`}>
                        <span>
                          <strong>{tier.size}</strong>
                          {tier.weight && <small>{tier.weight}</small>}
                        </span>
                        <b>{tier.price}</b>
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        <div className="price-section">
          <h3 className="price-section-title">Add Ons</h3>
          <div className="price-grid add-on-grid">
            {addOns.map((addOn) => (
              <article className="price-card add-on-card sticker-card price-cream" key={addOn.name}>
                <span className="price-sparkle" aria-hidden="true">
                  ✦
                </span>
                <h3>{addOn.name}</h3>
                <p className="add-on-description">{addOn.description}</p>
                <b className="add-on-price">{addOn.price}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <form className="form-card sticker-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <fieldset className="intake-section full-span">
            <legend>Client Record</legend>
            <p className="intake-section-note">This information is saved with your appointment for Manny's records.</p>
            <div className="form-grid compact">
              <label>
                Owner name
                <input name="ownerName" type="text" placeholder="Your name" required />
              </label>
              <label>
                Cell phone
                <input name="phone" type="tel" placeholder="(555) 123-4567" required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="hello@example.com" required />
              </label>
              <label>
                Home address
                <input name="homeAddress" type="text" placeholder="Street address" required />
              </label>
              <label>
                City / State / Zip
                <input name="cityStateZip" type="text" placeholder="Los Angeles, CA 90001" required />
              </label>
              <label>
                Owner home phone
                <input name="ownerHomePhone" type="tel" placeholder="Optional" />
              </label>
              <label>
                Owner work phone
                <input name="ownerWorkPhone" type="tel" placeholder="Optional" />
              </label>
            </div>
          </fieldset>
          <fieldset className="intake-section full-span">
            <legend>Pet Information</legend>
            <div className="form-grid compact">
              <label>
                Pet name
                <input name="dogName" type="text" placeholder="Fluffy" required />
              </label>
              <label>
                Pet type
                <select name="petType" defaultValue="Dog" required>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                If other, tell us
                <input name="petTypeOther" type="text" placeholder="Optional" />
              </label>
              <label>
                Breed
                <input name="breed" type="text" placeholder="Goldendoodle, Poodle, etc." />
              </label>
              <label>
                Weight
                <input name="petWeight" type="text" placeholder="Approx. weight" required />
              </label>
              <label>
                Sex
                <select name="petSex" defaultValue="" required>
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label>
                Date of birth
                <input name="petDateOfBirth" type="date" />
              </label>
              <label>
                Color
                <input name="petColor" type="text" placeholder="Coat color" required />
              </label>
              <label>
                Spayed / neutered
                <select name="spayedNeutered" defaultValue="" required>
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>
          </fieldset>
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
          <fieldset className="add-on-options">
            <legend>Add Ons</legend>
            <div className="checkbox-group">
              {addOnOptions.map((addOn) => (
                <label className="checkbox-option" key={addOn}>
                  <input name="addOns" type="checkbox" value={addOn} />
                  <span>{addOn}</span>
                </label>
              ))}
            </div>
          </fieldset>
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
