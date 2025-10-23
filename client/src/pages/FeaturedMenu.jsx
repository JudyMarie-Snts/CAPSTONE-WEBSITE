import React from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import image1 from '../assets/SET A UNLIMITED PORK.jpg'
import image2 from '../assets/SAMG PORK ON CUP.jpg'
import image3 from '../assets/kimchi.JPG'
import image4 from '../assets/cheese.jpg'
import image5 from '../assets/CHICKEN POPPERS.JPG'

export default function FeaturedMenu() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <header style={{ padding: '110px 20px 10px 20px' }}>
          <h1 id="popular" style={{ textAlign: 'center', fontSize: '36px', color: '#d60000', marginBottom: '10px' }}>POPULAR PICKS</h1>
          <p style={{ textAlign: 'center', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
            From unlimited grill sets to on-the-go bento cups and flavor-packed side dish tubs — SISZUMgyupsal serves up Korean goodness for every craving!
          </p>

          <section className="menu">
            <div className="menu-item">
              <img src={image1} alt="Set A Unlimited Pork" />
              <h3>SET A UNLIMITED PORK</h3>
              <p className="price">₱199</p>
              <p className="desc">All comes with Unlimited Rice, Lettuce, Side Dishes, and Drink</p>
            </div>

            <div className="menu-item">
              <img src={image2} alt="Samg Pork on Cup" />
              <h3>SAMG PORK ON CUP</h3>
              <p className="price">₱75</p>
              <p className="desc">All comes with Pork, Chicken, or Beef, Lettuce, Eggroll, Fishcake, Kimchi, Cheese, and Rice</p>
            </div>

            <div className="menu-item">
              <img src={image3} alt="Kimchi" />
              <h3>KIMCHI</h3>
              <p className="price">₱120</p>
              <p className="desc">All comes with Napa Cabbage, Korean Chili Flakes, Garlic, Ginger, Fish Sauce, and Scallions</p>
            </div>

            <div className="menu-item">
              <img src={image4} alt="Unlimited Cheese" />
              <h3>UNLIMITED CHEESE</h3>
              <p className="price">₱50</p>
              <p className="desc">Unli Cheese per person</p>
            </div>

            <div className="menu-item">
              <img src={image5} alt="Chicken Poppers" />
              <h3>CHICKEN POPPERS</h3>
              <p className="price">₱100</p>
              <p className="desc">Korean Chicken Poppers</p>
            </div>
          </section>
        </header>
      </main>
      <Footer />
    </>
  )
}


