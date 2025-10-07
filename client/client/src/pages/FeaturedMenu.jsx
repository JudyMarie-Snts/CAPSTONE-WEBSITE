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
        <header style={{ padding: '20px', textAlign: 'center' }}>
          <h1 id="popular" style={{ color: '#c00', fontSize: '32px' }}>POPULAR PICKS</h1>
          <p style={{ maxWidth: '600px', margin: '10px auto', fontSize: '16px', color: '#333' }}>
            From unlimited grill sets to on-the-go bento cups and flavor-packed side dish tubs — SISZUMgyupsal serves up Korean goodness for every craving!
          </p>
        </header>

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
      </main>
      <Footer />
    </>
  )
}


