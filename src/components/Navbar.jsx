import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Booking', path: '/booking' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/" aria-label="Doodles and Friends by Manny home">
        <span className="brand-mark">🐾</span>
        <span>
          Doodles & Friends
          <small>by Manny</small>
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            key={item.path}
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
