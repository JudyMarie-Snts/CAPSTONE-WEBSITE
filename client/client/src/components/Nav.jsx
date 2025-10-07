import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import websiteLogo from '../assets/websitelogo.jpg'

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav>
      <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', minWidth: '200px', textDecoration: 'none' }}>
        <img src={websiteLogo} alt="SISZUM Gyupsal Logo" style={{ cursor: 'pointer' }} />
      </Link>
      
      {/* Mobile Menu Toggle */}
      <div className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={isMenuOpen ? 'active' : ''}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li className="has-dropdown">
          <Link to="/" onClick={closeMenu}>Menu</Link>
          <ul className="dropdown">
            <li><Link to="/featuremenu" onClick={closeMenu}>Featured Menu Items</Link></li>
            <li><Link to="/unlimited" onClick={closeMenu}>Unlimited Menu</Link></li>
            <li><Link to="/alacarte" onClick={closeMenu}>Ala Carte Menu</Link></li>
            <li><Link to="/sidedish" onClick={closeMenu}>Side Dishes</Link></li>
          </ul>
        </li>
        <li><Link to="/promos" onClick={closeMenu}>Promos</Link></li>
        <li><Link to="/feedback" onClick={closeMenu}>Feedback</Link></li>
        <li><Link to="/reservation" onClick={closeMenu}>Reservation</Link></li>
        <li><Link to="/refilling" onClick={closeMenu}>Refilling</Link></li>
      </ul>
    </nav>
  )
}


