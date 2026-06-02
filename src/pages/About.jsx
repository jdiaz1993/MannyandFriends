function About() {
  return (
    <section className="page-section about-page">
      <div className="about-layout">
        <div className="about-copy">
          <p className="eyebrow">Meet Manny</p>
          <h1>A gentle groomer for doodles and every friend they bring.</h1>
          <p>
            Doodles & Friends by Manny is built around calm care, clean tools, and a lot of
            love for dogs. Manny believes grooming should feel friendly, not rushed, so every
            pup gets patience, reassurance, and attention from the first brush-out to the
            final bow.
          </p>
          <p>
            Whether your dog needs a simple bath, a bath and clean up, nail care, or a full
            groom, the goal is always the same: a happy pup, a clean coat, and a family that
            feels confident about the care their dog received.
          </p>
        </div>

        <div className="about-card sticker-card">
          <span className="about-icon" aria-hidden="true">
            🐩
          </span>
          <h2>Manny's Promise</h2>
          <ul>
            <li>Gentle handling for nervous and playful pups</li>
            <li>Patient pacing for doodle coats and sensitive dogs</li>
            <li>Clean grooming space, tools, and finishing details</li>
            <li>Care that treats every dog like family</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
