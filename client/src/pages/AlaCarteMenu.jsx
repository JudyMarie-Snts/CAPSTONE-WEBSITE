import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import image1 from '../assets/SAMG PORK ON CUP.jpg'
import image2 from '../assets/beef.jpg'
import image3 from '../assets/Chicken.jpg'
import image4 from '../assets/chicken pop.jpg'
import image5 from '../assets/korea.jpg'
import image6 from '../assets/CHICKEN POPPERS.JPG'
import image7 from '../assets/cheese.jpg'

export default function AlaCarteMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedReviews, setExpandedReviews] = useState({})
  const [reviewPages, setReviewPages] = useState({})

  // Fallback images for menu items
  const fallbackImages = [image1, image2, image3, image4, image5, image6, image7]

  useEffect(() => {
    fetchAlaCarteMenu()
  }, [])

  const fetchAlaCarteMenu = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/inventory/menu/alacarte`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items')
      }

      const data = await response.json()
      if (data.success) {
        setMenuItems(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch menu items')
      }
    } catch (err) {
      console.error('Error fetching ala carte menu:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getItemImage = (item, index) => {
    if (item.image_url) {
      return item.image_url
    }
    // Use fallback images in rotation
    return fallbackImages[index % fallbackImages.length]
  }

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toFixed(0)}`
  }

  const renderStars = (rating, totalReviews) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: '#ffd700', fontSize: '16px' }}>★</span>
      )
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: '#ffd700', fontSize: '16px' }}>☆</span>
      )
    }
    
    // Empty stars
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: '#ddd', fontSize: '16px' }}>☆</span>
      )
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
        <div>{stars}</div>
        <span style={{ fontSize: '14px', color: '#666', marginLeft: '4px' }}>
          {rating > 0 ? `${rating} (${totalReviews} reviews)` : 'No reviews yet'}
        </span>
      </div>
    )
  }

  const toggleReviews = (itemId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
    // Initialize page to 0 when opening reviews
    if (!expandedReviews[itemId]) {
      setReviewPages(prev => ({
        ...prev,
        [itemId]: 0
      }))
    }
  }

  const nextReviewPage = (itemId, totalReviews) => {
    const reviewsPerPage = 2
    const maxPage = Math.ceil(totalReviews / reviewsPerPage) - 1
    setReviewPages(prev => ({
      ...prev,
      [itemId]: Math.min((prev[itemId] || 0) + 1, maxPage)
    }))
  }

  const prevReviewPage = (itemId) => {
    setReviewPages(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }))
  }

  const renderRecentReviews = (reviews, itemId) => {
    if (!reviews || reviews.length === 0) return null

    const isExpanded = expandedReviews[itemId]
    const reviewsPerPage = 2
    const currentPage = reviewPages[itemId] || 0
    const totalPages = Math.ceil(reviews.length / reviewsPerPage)
    const startIndex = currentPage * reviewsPerPage
    const endIndex = startIndex + reviewsPerPage
    const reviewsToShow = isExpanded ? reviews.slice(startIndex, endIndex) : []

    return (
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => toggleReviews(itemId)}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)'
            e.target.style.background = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)'
            e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
          }}
        >
          {isExpanded ? '▲ Hide Reviews' : `▼ Show Reviews (${reviews.length})`}
        </button>
        
        {isExpanded && (
          <div style={{ 
            marginTop: '8px', 
            padding: '10px', 
            background: '#f9f9f9', 
            borderRadius: '8px'
          }}>
            {reviewsToShow.map((review, index) => (
              <div key={index} style={{ 
                marginBottom: '12px', 
                paddingBottom: '12px', 
                borderBottom: index < reviewsToShow.length - 1 ? '1px solid #e5e5e5' : 'none' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map(star => (
                      <span key={star} style={{ color: star <= review.rating ? '#ffd700' : '#ddd', fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
                    {review.customer_name || 'Anonymous'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#999', marginLeft: 'auto' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                  "{review.feedback_text}"
                </p>
              </div>
            ))}
            
            {/* Pagination Controls - Show only if more than 2 reviews */}
            {reviews.length > reviewsPerPage && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid #e5e5e5'
              }}>
                <button
                  onClick={() => prevReviewPage(itemId)}
                  disabled={currentPage === 0}
                  style={{
                    background: currentPage === 0 ? '#f5f5f5' : '#dc2626',
                    color: currentPage === 0 ? '#999' : 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ← Previous
                </button>
                
                <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <button
                  onClick={() => nextReviewPage(itemId, reviews.length)}
                  disabled={currentPage === totalPages - 1}
                  style={{
                    background: currentPage === totalPages - 1 ? '#f5f5f5' : '#dc2626',
                    color: currentPage === totalPages - 1 ? '#999' : 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <header style={{ padding: '110px 20px 10px 20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '36px', color: '#d60000', marginBottom: '10px' }}>
            ALA CARTE MENU
          </h1>
          <p style={{ textAlign: 'center', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
            From delicious cups to individual servings — SISZUMgyupsal's Ala Carte Menu offers
            Korean favorites in perfect portions for every craving!
          </p>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading ala carte menu items...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              Unable to load menu items at the moment. Please try again later.
            </div>
          )}

          {!loading && !error && menuItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No ala carte menu items available yet.
            </div>
          )}

          {!loading && !error && menuItems.length > 0 && (
            <div className="menu-grid">
              {menuItems.map((item, index) => (
                <div key={item.id} className="card" style={{ position: 'relative' }}>
                  <img 
                    src={getItemImage(item, index)} 
                    alt={item.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = fallbackImages[index % fallbackImages.length]
                    }}
                  />
                  {item.is_premium && (
                    <div className="premium-badge" style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#ffd700',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      PREMIUM
                    </div>
                  )}
                  <div className="card-content">
                    <div className="card-title">{item.name}</div>
                    <div className="card-desc">
                      {item.description || 'Delicious Korean-style dish served with premium ingredients'}
                    </div>
                    {renderStars(item.average_rating || 0, item.total_reviews || 0)}
                    {renderRecentReviews(item.recent_reviews, item.id)}
                  </div>
                  <div className="price-tag">{formatPrice(item.selling_price)}</div>
                </div>
              ))}
            </div>
          )}
        </header>
      </main>
      <Footer />
    </>
  )
}


