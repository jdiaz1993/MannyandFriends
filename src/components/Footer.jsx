import Button from './Button'

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="eyebrow">Ready for a tail-wagging tidy-up?</p>
        <h2>Doodles & Friends by Manny</h2>
        <p>Gentle grooming, bubbly baths, and patient care for every pup.</p>
      </div>
      <Button to="/booking" variant="secondary">
        Book an Appointment
      </Button>
    </footer>
  )
}

export default Footer
