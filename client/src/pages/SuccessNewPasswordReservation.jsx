import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/reservation.jpg'

export default function SuccessNewPasswordReservation() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <section
          style={{
            position: 'relative',
            background: `url(${bg}) no-repeat center center/cover`,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '56px 16px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))' }}></div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 780,
              background: '#e5e7eb',
              borderRadius: 14,
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ padding: 28, textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#b91c1c', letterSpacing: 0.4, margin: '6px 0 14px' }}>SUCCESS!</h1>
              <p style={{ fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Your password has been reset!</p>
              <p style={{ color: '#111827', marginBottom: 22 }}>You're now ready to access your SiszumGyupsal account.</p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link
                  to="/login-reservation"
                  style={{
                    width: 260,
                    background: '#b91c1c',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'inline-block'
                  }}
                >
                  Continue to Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
