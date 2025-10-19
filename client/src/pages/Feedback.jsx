import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import heroImage from '../assets/13.jpg';
import feedback from '../assets/feedback.jpg';
import  feedback2 from '../assets/feedback2.jpg';

export default function Feedback() {
  const [resolvedFeedback, setResolvedFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchResolvedFeedback()
  }, [])

  const fetchResolvedFeedback = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/feedback/public`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }

      const data = await response.json()
      if (data.success) {
        setResolvedFeedback(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch feedback')
      }
    } catch (err) {
      console.error('Error fetching feedback:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating)
  }

  const nextReview = () => {
    if (resolvedFeedback.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % resolvedFeedback.length)
    }
  }

  const prevReview = () => {
    if (resolvedFeedback.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + resolvedFeedback.length) % resolvedFeedback.length)
    }
  }
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 70 }}>
        {/* Hero Section */}
        <section className="hero" style={{ background: `url(${heroImage}) no-repeat center center/cover`, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', position: 'relative' }}>
          <div style={{ content: '', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}></div>
          <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '800px', padding: '0 20px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.1', color: 'white' }}>
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
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading customer reviews...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              Unable to load reviews at the moment. Please try again later.
            </div>
          )}

          {!loading && !error && resolvedFeedback.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No customer reviews available yet.
            </div>
          )}

          {!loading && !error && resolvedFeedback.length > 0 && (
            <>
              <div className="reviews-grid">
                {resolvedFeedback.slice(currentIndex, currentIndex + 2).map((review, index) => (
                  <div key={review.id} className="review-card">
                    <div className="review-image" style={{ 
                      backgroundImage: `url(${index === 0 ? feedback : feedback2})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                    <div className="review-content">
                      <div className="review-header">
                        <div className="profile-pic" style={{ 
                          backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(review.customer_name || 'Customer')}&background=d32f2f&color=fff')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}></div>
                        <div className="review-info">
                          <h4>{review.customer_name || 'Anonymous Customer'}</h4>
                          <div className="stars">{renderStars(review.rating)}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                            {formatDate(review.created_at)}
                          </div>
                        </div>
                      </div>
                      <p className="review-text">{review.feedback_text}</p>
                      {review.admin_response && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '10px', 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: '8px',
                          borderLeft: '3px solid #d32f2f'
                        }}>
                          <strong style={{ color: '#d32f2f', fontSize: '0.9rem' }}>Restaurant Response:</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#555' }}>
                            {review.admin_response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="review-nav">
                <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                  <button 
                    onClick={prevReview}
                    disabled={resolvedFeedback.length <= 2}
                    style={{ 
                      background: resolvedFeedback.length <= 2 ? '#ccc' : '#d32f2f', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '12px', 
                      borderRadius: '50%', 
                      cursor: resolvedFeedback.length <= 2 ? 'not-allowed' : 'pointer',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      transform: resolvedFeedback.length <= 2 ? 'none' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (resolvedFeedback.length > 2) {
                        e.target.style.transform = 'scale(1.1)'
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (resolvedFeedback.length > 2) {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    ←
                  </button>
                  
                  <div className="nav-dots">
                    {Array.from({ length: Math.ceil(resolvedFeedback.length / 2) }, (_, i) => (
                      <span 
                        key={i} 
                        className={`dot ${Math.floor(currentIndex / 2) === i ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(i * 2)}
                        style={{ cursor: 'pointer' }}
                      ></span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextReview}
                    disabled={resolvedFeedback.length <= 2}
                    style={{ 
                      background: resolvedFeedback.length <= 2 ? '#ccc' : '#d32f2f', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '12px', 
                      borderRadius: '50%', 
                      cursor: resolvedFeedback.length <= 2 ? 'not-allowed' : 'pointer',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      transform: resolvedFeedback.length <= 2 ? 'none' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (resolvedFeedback.length > 2) {
                        e.target.style.transform = 'scale(1.1)'
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (resolvedFeedback.length > 2) {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    →
                  </button>
                </div>
                
                <Link to="/feedback-form" className="leave-review-btn" style={{ marginTop: '20px', display: 'inline-block' }}>
                  LEAVE A REVIEW!
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Feedback Form Section */}
        <section className="feedback-form">
          <div className="feedback-container">
            <div className="feedback-info">
              <h3>WE WANT TO HEAR FROM YOU!</h3>
              <h4>SHARE YOUR REVIEW WITH US!</h4>
              <p>Everyone is welcome to share their thoughts, comments, and suggestions!</p>
              <p>Click the button below to leave your review and help us improve our service.</p>
              <div className="auth-buttons">
                <Link to="/feedback-form" className="auth-btn">Leave a Review</Link>
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


