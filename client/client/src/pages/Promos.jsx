import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import heroImage from '../assets/hero.jpg';
import promo1Image from '../assets/bday.jpg';
import promo2Image from '../assets/6.jpg';
import logo from '../assets/websitelogo.jpg';
export default function Promos() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        {/* Hero Section */}
        <section className="hero" style={{ background: `url(${heroImage}) no-repeat center center/cover`, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', position: 'relative', marginTop: 70 }}>
          <div style={{ content: '', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}></div>
          <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '800px', padding: '0 20px' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.1' }}>
              YOUR FAVE K-BBQ<br/>PROMOS ARE<br/>HERE!
            </h1>
            <p style={{ fontSize: '1.4rem', marginBottom: '30px', opacity: '0.9' }}>
              Grill, save, and enjoy — because cravings shouldn't have to wait!
            </p>
            <button className="hero-btn" style={{ backgroundColor: '#f9a825', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '30px', cursor: 'pointer', transition: '0.3s' }}>
              Unlock Deals
            </button>
          </div>
        </section>

        {/* Promos Container */}
        <div className="promos-container">
          {/* Promos Grid */}
          <div className="promos-grid">
            {/* Birthday Promo */}
            <div className="promo-card">
              <div className="promo-image" style={{ backgroundImage: `url(${promo1Image})` }}>
                <div className="promo-logo">
                  <img src={logo} alt="SISZUM Gyupsal" style={{ maxWidth: '150px', height: 'auto' }} />
                  <span>SISZUM Gyupsal</span>
                </div>
              </div>
              <div className="promo-content">
                <div className="promo-offer">FREE</div>
                <h3 className="promo-title">JUST BRING 4 OF YOUR FRIENDS AND GET A FREE UNLIMITED SAMGYUPSAL on your Birthday</h3>
                <p className="promo-details">FREE TREAT CAN BE CLAIMED FOR 7 DAYS! (ON ACTUAL BDAY, 3 DAYS BEFORE, AND 3 DAYS AFTER)</p>
                <p className="promo-validity">Valid all year round</p>
              </div>
            </div>

            {/* Women's Month Promo */}
            <div className="promo-card">
              <div className="promo-image" style={{ backgroundImage: `url(${promo2Image})` }}>
                <div className="promo-logo">
                  <img src={logo} alt="SISZUM Gyupsal" style={{ maxWidth: '150px', height: 'auto' }} />
                  <span>SISZUM Gyupsal</span>
                </div>
              </div>
              <div className="promo-content">
                <h3 className="promo-title">CELEBRATE WOMEN'S MONTH WITH A CHEESY TREAT!</h3>
                <div className="promo-offer">50% OFF</div>
                <p className="promo-details">50% OFF ON ALL CHEESE FOR WOMEN!</p>
                <p className="promo-validity">VALID UNTIL MARCH 31, 2025</p>
              </div>
            </div>
          </div>

          {/* Special Promo Section */}
          <div className="special-promo">
            <h2>WHAT ARE YOU WAITING FOR?</h2>
            <p>Don't miss out on these amazing deals! Book your table now and experience the best K-BBQ in town with incredible savings.</p>
            <a href="#" className="cta-button">Claim Your Table</a>
          </div>

          {/* Load More Section */}
          <div className="load-more-section">
            <button className="load-more-btn">Load More</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


