import React from 'react';
import image7 from '../assets/7.jpg';
import image8 from '../assets/8.jpg';

export default function Events() {
  return (
    <section className="events">
      <h2>Sneak peak of our book events</h2>
      <div className="events-carousel">
        <div className="event-image small">
          <img src={image7} alt="Event 1" />
        </div>
        <div className="event-image large">
          <img src={image8} alt="Main Event" />
        </div>
        <div className="event-image small">
          <img src={image7} alt="Event 1" />
        </div>
      </div>
    </section>
  )
}





