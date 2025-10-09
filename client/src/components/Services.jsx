import React from 'react'

export default function Services() {
  return (
    <section className="services" style={{ background: '#b91c1c', color: '#fff' }}>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, alignItems: 'center' }}>
          {/* Left copy */}
          <div>
            <div style={{ letterSpacing: 2, fontSize: 12, opacity: 0.9, marginBottom: 6 }}>WHAT WE OFFER</div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Our Great Services</h2>
            <p style={{ marginTop: 12, maxWidth: 520, lineHeight: 1.4 }}>
              At SIZUMgyupsal, we've got all-you-can-eat Korean BBQ with unlimited rice, sides, and drinks — perfect for every kain-tayo
              moment! We also offer bento cups and tubs of our best-selling kimchi, so you can enjoy the flavors anytime, anywhere.
            </p>
          </div>

          {/* Right feature icons */}
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ background: '#111', borderRadius: 8, padding: '14px 16px', width: 120, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span role="img" aria-label="menu" style={{ fontSize: 18 }}>📖</span>
              </div>
              <div style={{ fontSize: 12 }}>Special Menu</div>
            </div>

            <div style={{ background: '#111', borderRadius: 8, padding: '14px 16px', width: 120, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span role="img" aria-label="time" style={{ fontSize: 18 }}>⏰</span>
              </div>
              <div style={{ fontSize: 12 }}>Opened 9:00 pm</div>
            </div>

            <div style={{ background: '#111', borderRadius: 8, padding: '14px 16px', width: 120, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, margin: '0 auto 8px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span role="img" aria-label="calendar" style={{ fontSize: 18 }}>📅</span>
              </div>
              <div style={{ fontSize: 12 }}>Reservation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


