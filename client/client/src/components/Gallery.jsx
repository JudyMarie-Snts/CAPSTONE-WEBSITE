import React from 'react';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';
import image5 from '../assets/5.jpg';
import image6 from '../assets/6.jpg';

export default function Gallery() {
  return (
    <section className="gallery">
      <h2>Restaurant Gallery</h2>
      <div className="gallery-grid">
        <div className="gallery-item large top-left">
          <img src={image2} alt="Korean BBQ Grill with Meat" />
        </div>
        <div className="gallery-item medium top-center">
          <img src={image3} alt="Cooked Meat on Grill" />
        </div>
        <div className="gallery-item large top-right">
          <img src={image4} alt="Chopsticks with Cheese" />
        </div>
        <div className="gallery-item medium bottom-left">
          <img src={image5} alt="Korean BBQ Table Setup" />
        </div>
        <div className="gallery-item medium bottom-right">
          <img src={image6} alt="BBQ Experience" />
        </div>
      </div>
    </section>
  )
}





