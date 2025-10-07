import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg.jpg'

export default function TimesUp() {
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
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 300px at 50% -10%, rgba(255,255,255,0.12), rgba(0,0,0,0)), linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.45))' }}></div>

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 620 }}>
            <div style={{
              position: 'relative',
              background: 'rgba(17,24,39,0.9)',
              borderRadius: 24,
              padding: 36,
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 34px 90px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(6px)'
            }}>
              {/* Static accent header */}
              <div style={{ width: 84, height: 6, background: 'linear-gradient(90deg,#ef4444,#f59e0b)', borderRadius: 9999, margin: '0 auto 14px' }}></div>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: 3, fontSize: '2.2rem', background: 'linear-gradient(135deg,#fff,#fbbf24)', WebkitBackgroundClip: 'text', color: 'transparent' }}>TIME'S UP</h2>
              <p style={{ marginTop: 12, marginBottom: 22, color: '#e5e7eb', fontWeight: 600 }}>Your time has officially ended. Thank you for dining with us.</p>

              {/* Single action */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/" style={{ background: '#dc2626', color: '#fff', textDecoration: 'none', padding: '12px 22px', borderRadius: 9999, fontWeight: 900, boxShadow: '0 16px 32px rgba(239,68,68,0.35)' }}>Back to Home Page</Link>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
