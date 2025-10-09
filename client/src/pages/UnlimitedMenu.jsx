import React from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import image1 from '../assets/11.jpg'
import image2 from '../assets/12.jpg'
import image3 from '../assets/9.jpg'
import image4 from '../assets/10.jpg'
import image5 from '../assets/13.jpg'
import cheese from '../assets/cheese.jpg'

export default function UnlimitedMenu() {
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

        <div className="menu-grid">
          <div className="card">
            <img src={image1} alt="Set A Unli Pork" />
            <div className="card-content">
              <div className="card-title">SET A UNLI PORK</div>
              <div className="card-desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</div>
            </div>
            <div className="price-tag">₱199</div>
          </div>

          <div className="card">
            <img src={image2} alt="Set B Unli Pork & Chicken" />
            <div className="card-content">
              <div className="card-title">SET B UNLI PORK & CHICKEN</div>
              <div className="card-desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</div>
            </div>
            <div className="price-tag">₱249</div>
          </div>

          <div className="card">
            <img src={image3} alt="Set C Unli Premium Pork" />
            <div className="card-content">
              <div className="card-title">SET C UNLI PREMIUM PORK</div>
              <div className="card-desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</div>
            </div>
            <div className="price-tag">₱249</div>
          </div>

          <div className="card">
            <img src={image4} alt="Set D Unli Premium Pork & Chicken" />
            <div className="card-content">
              <div className="card-title">SET D UNLI PREMIUM PORK & CHICKEN</div>
              <div className="card-desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</div>
            </div>
            <div className="price-tag">₱299</div>
          </div>

          <div className="card">
            <img src={image5} alt="Set E Coming Soon" />
            <div className="coming-soon">AVAILABLE<br/>SOON</div>
            <div className="card-content">
              <div className="card-title">SET E UNLI PORK, CHICKEN, & BEEF</div>
              <div className="card-desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</div>
            </div>
            <div className="price-tag">₱349</div>
          </div>

          <div className="card">
            <img src={cheese} alt="Unlimited Cheese" />
            <div className="card-content">
              <div className="card-title">UNLIMITED CHEESE</div>
              <div className="card-desc">Unli Cheese per person</div>
            </div>
            <div className="price-tag">₱50</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


