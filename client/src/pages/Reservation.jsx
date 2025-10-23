import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import reservation from '../assets/reservation.jpg'

export default function Reservation() {
  return (
    <>
      <Nav />
      <section className="reservation-hero">
        <div className="reservation-hero__frame">
          <img className="reservation-hero__bg" src={reservation} alt="Restaurant" />
          <div className="reservation-hero__overlay" />
          <div className="reservation-hero__content">
            <h1 className="reservation-hero__title">SISZUMGYUPSAL RESTAURANT<br />RESERVATION</h1>
            <div className="reservation-hero__separator" />
            <p className="reservation-hero__desc">
              Planning a family meal? SISZUMgyupsal Reservation makes it easy to book a table for everyone. Use
              any device, anytime — simple, convenient, and made for your comfort. Because great food is best
              shared, and your time together matters.
            </p>
            <div className="reservation-hero__separator" />
            <Link className="reservation-hero__cta" to="/signup">Reserve Your Table Now</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

