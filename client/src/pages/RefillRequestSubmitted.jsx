import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg.jpg'

export default function RefillRequestSubmitted() {
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}></div>

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460 }}>
            <div style={{ background: 'rgba(17,24,39,0.85)', borderRadius: 16, padding: 24, textAlign: 'center', color: '#fff', boxShadow: '0 18px 50px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: 1 }}>REFILL REQUEST SENT</h2>
              <p style={{ marginTop: 10, marginBottom: 16, color: '#e5e7eb' }}>Just wait for the staff. Thank you!</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/refill-request" style={{ background: '#dc2626', color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 9999, fontWeight: 900 }}>Back to Refill Request</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


