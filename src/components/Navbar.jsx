import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Booking', path: '/booking' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <NavLink className="brand" to="/" aria-label="Doodles and Friends by Manny home">
        <img
          className="brand-logo"
          src="/doodles-friends-logo.png"
          alt="Doodles & Friends by Manny"
        />
      </NavLink>

      <button
        className="nav-toggle"
        type="button"
        aria-controls="main-navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
      >
        Menu
        <span aria-hidden="true">☰</span>
      </button>

      <nav
        className={isMenuOpen ? 'nav-links open' : 'nav-links'}
        id="main-navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            key={item.path}
            onClick={() => setIsMenuOpen(false)}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
