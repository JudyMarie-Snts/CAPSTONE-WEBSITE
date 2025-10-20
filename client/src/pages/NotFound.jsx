import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg.jpg'

export default function NotFound() {
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
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520, textAlign: 'center', color: '#fff' }}>
            <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 900, letterSpacing: 2 }}>404</h1>
            <p style={{ marginTop: 12, fontSize: '1.1rem', lineHeight: 1.6 }}>The page you’re looking for doesn’t exist or was moved.</p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Link to='/' style={{ background: '#f59e0b', color: '#111827', padding: '12px 22px', borderRadius: 9999, fontWeight: 900, textDecoration: 'none', minWidth: 240 }}>Go to Home</Link>
              <Link to='/refilling' style={{ background: '#dc2626', color: '#fff', padding: '12px 22px', borderRadius: 9999, fontWeight: 900, textDecoration: 'none', minWidth: 240 }}>Start Refill Request</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
