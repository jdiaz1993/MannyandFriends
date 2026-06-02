import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'

const services = [
  {
    icon: '🛁',
    title: 'Bath',
    description: 'Bubble baths with gentle shampoos and cozy towel time.',
  },
  {
    icon: '✂️',
    title: 'Haircut',
    description: 'Cute trims shaped with patience, comfort, and doodle fluff in mind.',
  },
  {
    icon: '🐾',
    title: 'Nail Trim',
    description: 'Careful paw care to keep each happy step neat and comfortable.',
  },
  {
    icon: '🦴',
    title: 'Full Groom',
    description: 'The full glow-up: bath, brush, haircut, nails, and finishing touches.',
  },
]

function Home() {
  return (
    <>
      <section className="hero wavy-section">
        <div className="hero-copy">
          <p className="eyebrow">Playful grooming for fluffy besties</p>
          <h1>Doodles & Friends by Manny</h1>
          <p className="hero-tagline">Gentle grooming for doodles and their friends</p>
          <div className="hero-actions">
            <Button to="/booking">Book an Appointment</Button>
            <Button to="/gallery" variant="secondary">
              View Gallery
            </Button>
          </div>
        </div>

        <div className="hero-art" aria-label="Cartoon dog grooming illustration">
          <span className="hero-star star-one">★</span>
          <span className="hero-star star-two">★</span>
          <span className="hero-bubble bubble-three" />
          <div className="dog-sticker">
            <span className="dog-ears">🐶</span>
            <span className="dog-bow">✿</span>
          </div>
          <div className="bone-badge">fresh & fluffy</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Grooming Goodies</h2>
          <p>Pick a quick tidy-up or a full spa day. Every visit is handled with kindness.</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="callout sticker-card">
        <span aria-hidden="true">🫧</span>
        <div>
          <h2>Clean coats, calm pups, cheerful humans.</h2>
          <p>Manny keeps grooming sweet, sanitary, and stress-aware from hello to pickup.</p>
        </div>
      </section>
    </>
  )
}

export default Home
