import { useState } from 'react'
import Button from '../components/Button'
import { createContactMessage } from '../lib/contactMessages'

const contactItems = [
  { label: 'Phone', value: '(323) 303-8498' },
  { label: 'Email', value: 'manueledvasquez@gmail.com' },
  {
    label: 'Location',
    value: 'Snout Studios Pet Grooming',
    href: 'https://www.google.com/maps/search/?api=1&query=1640%20W%20Temple%20St%2C%20Los%20Angeles%2C%20CA%2090026',
  },
  {
    label: 'Address',
    value: '1640 W Temple St, Los Angeles, CA 90026',
    href: 'https://www.google.com/maps/search/?api=1&query=1640%20W%20Temple%20St%2C%20Los%20Angeles%2C%20CA%2090026',
  },
  {
    label: 'Instagram',
    value: '@doodlesandfriendsbymanny',
    href: 'https://www.instagram.com/doodlesandfriendsbymanny',
  },
  { label: 'Appointments', value: 'Grooming visits are hosted at Snout Studios Pet Grooming.' },
]

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage({ type: '', text: '' })
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      await createContactMessage({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        status: 'unread',
      })

      form.reset()
      setMessage({ type: 'success', text: 'Your message was sent! Manny will get back to you soon.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section contact-page">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Say Hello to Manny</h1>
        <p>Have a question before booking? Send a note and Manny will get back to you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info sticker-card">
          <h2>Business Details</h2>
          <div className="contact-list">
            {contactItems.map((item) => (
              <p key={item.label}>
                <strong>{item.label}</strong>
                {item.href ? (
                  <a className="contact-link" href={item.href} target="_blank" rel="noreferrer">
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </p>
            ))}
          </div>
          <div className="map-placeholder">
            <iframe
              className="map-embed"
              title="Snout Studios Pet Grooming map"
              src="https://www.google.com/maps?q=1640%20W%20Temple%20St%2C%20Los%20Angeles%2C%20CA%2090026&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-details">
              <p>Snout Studios Pet Grooming</p>
              <a
                className="contact-link"
                href="https://www.google.com/maps/search/?api=1&query=1640%20W%20Temple%20St%2C%20Los%20Angeles%2C%20CA%2090026"
                target="_blank"
                rel="noreferrer"
              >
                1640 W Temple St, Los Angeles, CA 90026
              </a>
            </div>
          </div>
        </div>

        <form className="form-card sticker-card contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="hello@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="6" placeholder="How can we help?" required />
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          {message.text && <p className={`booking-message ${message.type}`}>{message.text}</p>}
        </form>
      </div>
    </section>
  )
}

export default Contact
