import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import heroImage from '../assets/13.jpg';
import feedback from '../assets/feedback.jpg';
import  feedback2 from '../assets/feedback2.jpg';
export default function Feedback() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        {/* Hero Section */}
        <section className="hero" style={{ background: `url(${heroImage}) no-repeat center center/cover`, height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', position: 'relative', marginTop: 70 }}>
          <div style={{ content: '', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}></div>
          <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '800px', padding: '0 20px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.1', color: '#d32f2f' }}>
              DISCOVER KOREAN BBQ<br/>EXCELLENCE
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: '0.9' }}>
              Experience the authentic taste of Korea with our premium ingredients and traditional recipes
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="core-values">
          <h2>OUR CORE VALUES</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🔥</div>
              <p className="value-text">We use fresh ingredients and authentic flavors to serve unforgettable meals.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <p className="value-text">We put our customers at the heart of everything we do.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🎯</div>
              <p className="value-text">We deliver the same great service and taste—every time, every table.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💡</div>
              <p className="value-text">We continuously explore new ways to level up your K-BBQ experience.</p>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="customer-reviews">
          <h2>WHAT CUSTOMERS SAY</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-image" style={{ backgroundImage: `url(${feedback})` }}></div>
              <div className="review-content">
                <div className="review-header">
                  <div className="profile-pic" style={{ backgroundImage: "url('profile1.jpg')" }}></div>
                  <div className="review-info">
                    <h4>Sarah Johnson</h4>
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="review-text">Best samgy house and side dishes in town!!! Specially the newest addition in their side dishes, FISH CAKE! OA sa SaRaaAap!!! Must try!!!</p>
              </div>
            </div>

            <div className="review-card">
              <div className="review-image" style={{ backgroundImage: `url(${feedback2})` }}></div>
              <div className="review-content">
                <div className="review-header">
                  <div className="profile-pic" style={{ backgroundImage: "url('profile2.jpg')" }}></div>
                  <div className="review-info">
                    <h4>Mike Rodriguez</h4>
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="review-text">Their samgyupsal and side dish are so good, yet AFFORDABLE. Worth it ang long drive.</p>
              </div>
            </div>
          </div>

          <div className="review-nav">
            <div className="nav-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button className="leave-review-btn">LEAVE A REVIEW!</button>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="feedback-form">
          <div className="feedback-container">
            <div className="feedback-info">
              <h3>WE WANT TO HEAR FROM YOU!</h3>
              <h4>LOG IN TO SHARE YOUR REVIEW.</h4>
              <p>Everyone is welcome to share their thoughts, comments, and suggestions!</p>
              <p>To leave a review or comment, please log in or register first.</p>
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn">Log In</Link>
                <Link to="/register" className="auth-btn">Sign Up</Link>
              </div>
            </div>
            <div className="feedback-form-right">
              <h3>Share Your Experience</h3>
              <p style={{ color: '#fff', marginBottom: '20px' }}>Help us improve by sharing your feedback about your dining experience.</p>
              <p style={{ color: '#fff', fontSize: '0.9rem' }}>Your opinion matters to us!</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


