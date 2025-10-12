import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import image1 from '../assets/11.jpg'
import image2 from '../assets/12.jpg'
import image3 from '../assets/9.jpg'
import image4 from '../assets/10.jpg'
import image5 from '../assets/13.jpg'
import cheese from '../assets/cheese.jpg'

export default function UnlimitedMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback images for menu items
  const fallbackImages = [image1, image2, image3, image4, image5, cheese]

  useEffect(() => {
    fetchUnlimitedMenu()
  }, [])

  const fetchUnlimitedMenu = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/inventory/menu/unlimited`)
      
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
      console.error('Error fetching unlimited menu:', err)
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
        <h1 style={{ textAlign: 'center', fontSize: '36px', color: '#d60000', marginBottom: '10px' }}>
          UNLIMITED MENU 
        </h1>
        <p style={{ textAlign: 'center', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
          From sizzling pork sets to unlimited rice, sides, and drinks — SIZSUMgyupsal's
          Unlimited Menu brings non-stop Korean BBQ goodness to your table!
        </p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading unlimited menu items...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            Unable to load menu items at the moment. Please try again later.
          </div>
        )}

        {!loading && !error && menuItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No unlimited menu items available yet.
          </div>
        )}

        {!loading && !error && menuItems.length > 0 && (
          <div className="menu-grid">
            {menuItems.map((item, index) => (
              <div key={item.id} className="card">
                <img 
                  src={getItemImage(item, index)} 
                  alt={item.name}
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
                    {item.description || 'All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink'}
                  </div>
                </div>
                <div className="price-tag">{formatPrice(item.selling_price)}</div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}


