function About() {
  return (
    <section className="page-section about-page">
      <div className="about-layout">
        <div className="about-copy about-me-card sticker-card">
          <p className="eyebrow">About Me</p>
          <h1>Hi, I'm Manny.</h1>
          <p>
            I am passionate about providing the best grooming experience for your fur
            babies at Snout Studios Pet Grooming. They are allowed to move freely in our
            kennel-free facility, which helps prevent separation anxiety. They are also
            allowed to settle down or self-soothe before we get started. I will provide a
            one-on-one experience for your dogs which allows them to bond with me and
            creates trust not only between your fur baby and myself, but also with the
            paw-rents.
          </p>
          <p>
            I have several years of experience specializing in doodles, and I take pride in
            striving to continually become a better groomer. I have worked to perfect my
            bathing process to help doodles and friends maintain as much fur as possible or
            desired. I have also continued to push myself with grooming doodles of all shapes
            and sizes, staying current with all the latest styles like the modern cocker and
            schnauzer cut, as well as Asian fusion styles.
          </p>
          <p>
            I invite you to book online and also reach out to me for some at-home grooming
            techniques that will help you further educate yourself to be the best paw-rents
            you can be!
          </p>
        </div>

        <div className="about-card sticker-card">
          <img className="about-photo" src="/manny-about.png" alt="Manny grooming a dog" />
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
