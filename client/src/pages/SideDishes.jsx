import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import image1 from '../assets/side1.jpg'
import image2 from '../assets/side2.jpg'

export default function SideDishes() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback images for menu items
  const fallbackImages = [image1, image2]

  useEffect(() => {
    fetchSideDishes()
  }, [])

  const fetchSideDishes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/inventory/menu/sidedishes`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch side dishes')
      }

      const data = await response.json()
      if (data.success) {
        setMenuItems(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch side dishes')
      }
    } catch (err) {
      console.error('Error fetching side dishes:', err)
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
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <header style={{ padding: '110px 20px 10px 20px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '36px', color: '#d60000', marginBottom: '10px' }}>
            BEST SELLING SIDE DISH
          </h1>
          <p style={{ textAlign: 'center', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
            Our best-selling side dishes — Kimchi, Cheese, Baby Potatoes, Fishcake, and Egg Roll — served in convenient tubs, perfect to pair with any meal!
          </p>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading side dishes...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              Unable to load side dishes at the moment. Please try again later.
            </div>
          )}

          {!loading && !error && menuItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No side dishes available yet.
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
                      {item.description || 'Delicious side dish served in convenient tub'}
                    </div>
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


