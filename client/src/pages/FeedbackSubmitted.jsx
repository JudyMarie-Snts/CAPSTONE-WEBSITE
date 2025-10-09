import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'

export default function FeedbackSubmitted() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <section
          style={{
            position: 'relative',
            background: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop') no-repeat center center/cover",
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
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                <span style={{ color: '#dc2626', margin: '0 6px' }}>❤</span>
                <span style={{ color: '#dc2626', margin: '0 6px' }}>❤</span>
                <span style={{ color: '#dc2626', margin: '0 6px' }}>❤</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '6px 0 10px' }}>THANKS FOR YOUR FEEDBACK!</h1>
              <p style={{ color: '#b91c1c', fontWeight: 900, marginBottom: 10 }}>Sojunghan pideubaek gamsahamnida!</p>
              <p style={{ color: '#111827', marginBottom: 22 }}>
                Your voice helps us serve you better. Hope to see you again soon at SIZSUMgyupsal!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link
                  to="/"
                  style={{
                    width: 260,
                    background: '#b91c1c',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '10px 16px',
                    borderRadius: 10,
                    fontWeight: 800,
                    display: 'inline-block'
                  }}
                >
                  Back to Home Page
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


