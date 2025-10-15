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
    // Return empty string for missing/invalid/zero prices so UI doesn't show ₱0
    const num = parseFloat(price)
    if (Number.isNaN(num) || price === null || price === undefined || num === 0) return ''
    return `₱${num.toFixed(0)}`
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
                  {(item.is_premium === true || item.is_premium === 1) && (
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
                  </div>
                  {formatPrice(item.selling_price) && (
                    <div className="price-tag">{formatPrice(item.selling_price)}</div>
                  )}
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


