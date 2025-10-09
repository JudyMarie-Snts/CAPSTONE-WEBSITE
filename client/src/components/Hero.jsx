import React from 'react'
import heroImage from '../assets/hero.jpg'

export default function Hero() {
  return (
    <section 
      className="hero"
      style={{
        background: `url(${heroImage}) no-repeat center center/cover`,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        marginTop: '70px',
        overflow: 'hidden',
        backgroundAttachment: 'fixed'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        inset: '-20% -10% auto -10%',
        height: '70%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%)',
        filter: 'blur(30px)',
        animation: 'heroGlow 8s ease-in-out infinite alternate',
        pointerEvents: 'none',
        zIndex: 2
      }}></div>
      <div className="hero-content" style={{ textAlign: 'center', position: 'relative', zIndex: 3 }}>
        <h1 style={{ lineHeight: 1.1 }}>{'YOUR ULTIMATE KOREAN BBQ EXPERIENCE STARTS HERE!'}</h1>
        <button style={{ cursor: 'pointer' }}>Read more</button>
      </div>
    </section>
  )
}





