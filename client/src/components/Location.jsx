import React from 'react';

export default function Location() {
  return (
    <section className="location">
      <h2>Location</h2>
      <div className="location-separator"></div>
      <div className="map-container">
        <div className="map-placeholder">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.123!2d120.8567!3d14.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0a1b2c3d4e5%3A0x1a2b3c4d5e6f7890!2sWV2Q%2BVPJ%2C%20General%20Alejo%20G.%20Santos%20Hwy%2C%20Plaridel%2C%203004%20Bulacan!5e0!3m2!1sen!2sph!4v1697365789012!5m2!1sen!2sph"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SISZUM Gyupsal Location - General Alejo G. Santos Hwy, Plaridel, Bulacan"
          ></iframe>
        </div>
        <div className="location-info" style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '25px', fontSize: '1.8rem', color: '#d32f2f', fontWeight: 'bold' }}>Visit Us</h3>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', fontSize: '1rem' }}>
            <strong>📍 Address:</strong> WV2Q+VPJ, General Alejo G. Santos Hwy, Plaridel, 3004 Bulacan
          </p>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', fontSize: '1rem' }}>
            <strong>📞 Phone:</strong> 0939 266 9808
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '1rem' }}>
            <strong>📧 Email:</strong> siszumgyupsal@gmail.com
          </p>
          <div className="directions-link">
            <a 
              href="https://www.google.com/maps/dir//WV2Q+VPJ,+General+Alejo+G.+Santos+Hwy,+Plaridel,+3004+Bulacan/@14.8833456,120.8567123,17z"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#d32f2f',
                color: 'white',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '5px',
                marginTop: '10px',
                fontWeight: 'bold'
              }}
            >
              🗺️ Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}





