import React from 'react'
import logo from '../assets/blacklogo.jpg'
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
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Email">@</a>
            <a href="#" aria-label="SMS">✉</a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Menu</a></li>
            <li><a href="#">Reservation</a></li>
            <li><a href="#">Refilling</a></li>
          </ul>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">FAQ'S</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>

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





