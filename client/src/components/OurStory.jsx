import React from 'react';
import storyImage from '../assets/1.jpg';
export default function OurStory() {
  return (
    <section className="our-story">
      <img src={storyImage} alt="Restaurant" />
      <div className="our-story-text">
        <h2>Our Story</h2>
        <p>
          SISZUMgyupsal was founded on March 12, 2019, by four women inspired by Korean Samgyupsal culture.
          Combining “SISZUM” (for their sisterhood) and “gyupsal,” the restaurant offered unlimited Korean BBQ and side dishes.
          After closing in 2020 due to COVID-19 and shifting to online selling, it officially reopened under new ownership in November 2024,
          aiming to serve loyal customers, create jobs, and continue growing the brand.
        </p>
        <button>Feedback</button>
      </div>
    </section>
  )
}





