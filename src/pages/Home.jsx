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
    title: 'Bath and Clean Up',
    description: 'A fresh bath with face, feet, and tidy-up touches for a polished pup.',
  },
  {
    icon: '🐾',
    title: 'Nail Trim',
    description: 'Careful paw care to keep each happy step neat and comfortable.',
  },
  {
    icon: '🦴',
    title: 'Full Groom',
    description: 'The full glow-up: bath, brush, clean-up trim, nails, and finishing touches.',
  },
]

const homeHighlights = [
  {
    title: 'Kennel Free',
    text: 'We are a kennel-free grooming salon, which means that your dog will stay with us in our playroom during their grooming appointment. This allows us to give your dog the individual attention they need, and it also helps to reduce stress for shy or anxious dogs.',
    size: 'wide',
  },
  {
    title: 'Dogs of All Temperaments',
    text: 'We understand that some dogs can be aggressive, and we are equipped to handle them safely and effectively. We have a team of experienced groomers who are trained in handling aggressive dogs, and we have a separate area for these dogs to be groomed. We also understand that some dogs can be shy, and we are committed to helping them feel comfortable during their grooming appointments. We have a separate area for shy dogs, and we use calming techniques to help them relax.',
    size: 'wide',
  },
  {
    title: 'Cats Are Friends Too',
    text: 'We also offer cat grooming services. We know that cats can be more difficult to groom than dogs, but we have a team of experienced cat groomers who are gentle and patient.',
  },
  {
    title: 'Parents Are Welcome to Join',
    text: "We understand that your pet is part of your family, and we want you to be involved in their grooming experience. That's why we welcome parents to join their pets during their grooming appointments.",
  },
  {
    title: 'Why Doodles & Friends?',
    text: 'While we specialize in grooming for doodles and other double coated pets, all friends (aka single coat pets) are welcome here as well!',
  },
]

function Home() {
  return (
    <>
      <section className="hero wavy-section">
        <div className="hero-copy">
          <p className="eyebrow">Playful grooming for fluffy besties</p>
          <h1>Doodles & Friends by Manny</h1>
          <p className="hero-tagline">
            Individual kennel free grooming for doodles and friends (cats are friends too)
          </p>
          <div className="hero-actions">
            <Button to="/booking">Book an Appointment</Button>
            <Button to="/gallery" variant="secondary">
              View Gallery
            </Button>
          </div>
        </div>

        <div className="hero-art" aria-label="Doodle dog relaxing on grass">
          <span className="hero-star star-one">★</span>
          <span className="hero-star star-two">★</span>
          <span className="hero-bubble bubble-three" />
          <img
            className="hero-photo"
            src="/manny-hero-dog.png"
            alt="A fluffy doodle dog relaxing on green grass"
          />
          <div className="bone-badge">fresh & fluffy</div>
        </div>
      </section>

      <section className="section home-highlights">
        <div className="section-heading">
          <p className="eyebrow">What Makes Us Different</p>
          <h2>Kennel-Free Care for Every Friend</h2>
        </div>

        <div className="home-highlight-grid">
          {homeHighlights.map((highlight) => (
            <article
              className={`home-highlight-card sticker-card ${
                highlight.size === 'wide' ? 'highlight-wide' : ''
              }`}
              key={highlight.title}
            >
              <h3>{highlight.title}</h3>
              <p>{highlight.text}</p>
            </article>
          ))}
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
