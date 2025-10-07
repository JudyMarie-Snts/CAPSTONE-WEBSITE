import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import heroImage from '../assets/hero.jpg'
export default function FeedbackForm() {
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  function handlePickFile() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    setFileName(file ? file.name : '')
  }

  function removeFile() {
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    
    // Validate form
    if (!rating || !content.trim()) {
      alert('Please provide a rating and write your review.')
      return
    }

    try {
      // Get user data from localStorage
      const userDataStr = localStorage.getItem('user')
      if (!userDataStr) {
        alert('Please log in to submit feedback.')
        navigate('/login?redirect=/feedback-form')
        return
      }

      const userData = JSON.parse(userDataStr)
      const token = userData?.token

      if (!token) {
        alert('Please log in to submit feedback.')
        navigate('/login?redirect=/feedback-form')
        return
      }

      // Get user info
      const user = userData.user || userData
      const customer_name = user.first_name 
        ? `${user.first_name} ${user.last_name || ''}`.trim() 
        : user.email

      // Prepare feedback data
      const feedbackData = {
        customer_name: customer_name,
        email: user.email,
        feedback_type: 'general',
        rating: rating,
        feedback_text: content
      }

      console.log('Submitting feedback:', feedbackData)

      // Submit feedback to API
      const response = await fetch('http://localhost:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData),
        credentials: 'include'
      })

      const data = await response.json()
      console.log('Response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback')
      }

      // Navigate to success page
      navigate('/feedback-submitted')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert(error.message || 'Failed to submit feedback. Please try again.')
    }
  }

  function Star({ index }) {
    const active = (hover || rating) >= index
    return (
      <button
        type="button"
        onClick={() => setRating(index)}
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(0)}
        aria-label={`${index} star`}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 22,
          color: active ? '#dc2626' : '#d1d5db',
          marginRight: 10
        }}
      >
        ★
      </button>
    )
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <section
          style={{
            position: 'relative',
            background: `url(${heroImage}) no-repeat center center/cover`,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '56px 16px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))' }}></div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 840,
              background: '#eeeeee',
              borderRadius: 14,
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ padding: 26 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>WE WANT TO HEAR FROM YOU!</h1>

              <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
                {/* Upload photo */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 700 }}>Attach your best SiSZUMgyupsal photo below:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <button type="button" onClick={handlePickFile}
                      style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
                      Upload Photo
                    </button>
                    {fileName && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: 8 }}>
                        <span style={{ fontSize: 12 }}>{fileName}</span>
                        <button type="button" onClick={removeFile} style={{ border: 'none', background: '#ef4444', color: '#fff', width: 18, height: 18, borderRadius: 4, cursor: 'pointer' }}>×</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div style={{ margin: '10px 0 8px' }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 700 }}>How would you rate your SiSZUMgyupsal experience?</p>
                  <div>
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} index={i} />
                    ))}
                  </div>
                </div>

                {/* Review */}
                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Leave a Review:</p>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something..."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="submit"
                    style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


