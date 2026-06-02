import Button from '../components/Button'

const contactItems = [
  { label: 'Phone', value: '(323) 303-8498' },
  { label: 'Email', value: 'manueledvasquez@gmail.com' },
  {
    label: 'Instagram',
    value: '@doodlesandfriendsbymanny',
    href: 'https://www.instagram.com/doodlesandfriendsbymanny',
  },
  { label: 'Service area', value: 'Local doodles, pups, and furry friends' },
]

function Contact() {
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
          <div className="map-placeholder" role="img" aria-label="Map placeholder">
            <span>📍</span>
            <p>Map placeholder</p>
          </div>
        </div>

        <form className="form-card sticker-card contact-form">
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
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </section>
  )
}

export default Contact
