import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import reservation from '../assets/reservation.jpg'

export default function ResetPasswordReservation() {
  const [formValues, setFormValues] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const navigate = useNavigate()

  function validate(values) {
    const nextErrors = {}
    if (!values.email.trim()) nextErrors.email = 'Email is required'
    if (!values.password) nextErrors.password = 'Password is required'
    else if (values.password.length < 6) nextErrors.password = 'At least 6 characters'
    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required'
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'
    return nextErrors
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(formValues)
    setErrors(nextErrors)
    
    if (Object.keys(nextErrors).length === 0) {
      setIsLoading(true)
      
      try {
        const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formValues.email.trim(),
            newPassword: formValues.password
          })
        })
        
        const data = await response.json()
        
        if (response.ok && data.success) {
          console.log('Password reset successful')
          navigate('/success-new-password-reservation')
        } else {
          setErrors({ general: data.message || 'Failed to reset password' })
        }
      } catch (error) {
        console.error('Password reset error:', error)
        setErrors({ general: 'Network error. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <section
          style={{
            position: 'relative',
            background: `url(${reservation}) no-repeat center center/cover`,
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
              maxWidth: 520,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}
          >
            <div style={{ background: '#f1f5f9', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.9rem', fontWeight: 900, color: '#0f172a' }}>CHANGE PASSWORD</h2>
            </div>

            <div style={{ padding: 28 }}>
              <form onSubmit={handleSubmit} noValidate>
                {errors.general && <div style={{ color: '#b91c1c', fontSize: 14, marginBottom: 16, textAlign: 'center', padding: '8px', background: '#fef2f2', borderRadius: 6 }}>{errors.general}</div>}
                
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    marginBottom: 6,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                  }}
                />
                {errors.email && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.email}</div>}

                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    marginBottom: 6,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                  }}
                />
                {errors.password && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.password}</div>}

                <label style={{ display: 'block', fontWeight: 600, margin: '10px 0 6px' }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    marginBottom: 6,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                  }}
                />
                {errors.confirmPassword && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.confirmPassword}</div>}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: 9999,
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    letterSpacing: 0.5,
                    transition: 'transform .15s ease, box-shadow .15s ease, opacity .15s ease',
                    boxShadow: hoverPrimary && !isLoading ? '0 10px 22px rgba(220,38,38,0.4)' : '0 6px 14px rgba(220,38,38,0.3)',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={() => !isLoading && setHoverPrimary(true)}
                  onMouseLeave={() => setHoverPrimary(false)}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
                  Remembered your password?{' '}
                  <Link to="/login-reservation" style={{ fontWeight: 700, color: '#111827' }}>Login</Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}



