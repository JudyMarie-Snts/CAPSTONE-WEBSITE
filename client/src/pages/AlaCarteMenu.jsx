import React from 'react'
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
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <h1 style={{ textAlign: 'center', fontSize: '36px', color: '#d60000', marginBottom: '10px' }}>
          ALA CARTE MENU
        </h1>
        <p style={{ textAlign: 'center', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
          From delicious cups to individual servings — SISZUMgyupsal's Ala Carte Menu offers
          Korean favorites in perfect portions for every craving!
        </p>

        <div className="menu-grid" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 10px 60px 10px', flexWrap: 'wrap' }}>
          <div className="card" style={{ width: '320px' }}>
            <img src={image1} alt="Samg Pork on Cup" />
            <div className="card-content">
              <div className="card-title">SAMG PORK ON CUP</div>
              <div className="card-desc">All comes with Lettuce, Eggroll, Fishcake, Kimchi, Cheese, and Rice</div>
            </div>
            <div className="price-tag">₱75</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image2} alt="Samg Chicken on Cup" />
            <div className="card-content">
              <div className="card-title">SAMG CHICKEN ON CUP</div>
              <div className="card-desc">All comes with Lettuce, Eggroll, Fishcake, Kimchi, Cheese, and Rice</div>
            </div>
            <div className="price-tag">₱75</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image3} alt="Samg Beef on Cup" />
            <div className="card-content">
              <div className="card-title">SAMG BEEF ON CUP</div>
              <div className="card-desc">All comes with Lettuce, Baby Potatoes, Eggroll, Cheese, Fishcake, and Rice</div>
            </div>
            <div className="price-tag">₱90</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image4} alt="Chicken Poppers on Cup" />
            <div className="card-content">
              <div className="card-title">CHICKEN POPPERS ON CUP</div>
              <div className="card-desc">All comes with Lettuce, Eggroll, Baby Potatoes, Kimchi, Cheese, and Rice</div>
            </div>
            <div className="price-tag">₱75</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image5} alt="Korean Meat on Cup" />
            <div className="card-content">
              <div className="card-title">KOREAN MEAT ON CUP</div>
              <div className="card-desc">All comes with Lettuce, Eggroll, Baby Potatoes, Kimchi, Cheese, and Rice</div>
            </div>
            <div className="price-tag">₱75</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image6} alt="Chicken Poppers" />
            <div className="card-content">
              <div className="card-title">CHICKEN POPPERS</div>
              <div className="card-desc">All comes with Cheese</div>
            </div>
            <div className="price-tag">₱100</div>
          </div>

          <div className="card" style={{ width: '320px' }}>
            <img src={image7} alt="Cheese" />
            <div className="card-content">
              <div className="card-title">CHEESE</div>
              <div className="card-desc">1 serve of Cheese</div>
            </div>
            <div className="price-tag">₱50</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


