import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/websitelogo2.jpg'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="brand">
          <div className="logo">
            <img src={logo} alt="SISZUMgyupsal Logo" />
          </div>
          <p>
            At SISZUMgyupsal, we believe every meal should be delicious, memorable, and
            shared with the people who matter most.
          </p>
          <div className="socials">
            <a href="https://www.instagram.com/siszumgyupsal?igsh=OXpkcDFmbm9jaWtt" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
            <a href="https://facebook.com/siszumgyupsal" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="mailto:siszumgyupsal@gmail.com" aria-label="Email">@</a>
            <a href="sms:09392669808" aria-label="SMS">✉</a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/featuremenu">Menu</Link></li>
            <li><Link to="/reservation">Reservation</Link></li>
            <li><Link to="/refilling">Refilling</Link></li>
          </ul>
        </div>

        <div></div>

        <div>
          <h4>Contact Us</h4>
          <ul>
            <li>Feliz de Espacio Plaridel, in front of San Nicolas de Tolentino Chapel,</li>
            <li>Bintog, Plaridel, Bulacan</li>
            <li>0939 266 9808</li>
            <li><a href="mailto:siszumgyupsal@gmail.com">siszumgyupsal@gmail.com</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}





