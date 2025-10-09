import React from 'react';
import captureImage from '../assets/Capture.PNG';

export default function Location() {
  return (
    <section className="location">
      <h2>Location</h2>
      <div className="location-separator"></div>
      <div className="map-container">
        <div className="map-placeholder">
          <img src={captureImage} alt="Location" />
        </div>
      </div>
    </section>
  )
}





