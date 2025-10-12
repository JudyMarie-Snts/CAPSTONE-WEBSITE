import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg2.png'

export default function Register() {
  const [formValues, setFormValues] = useState({ first_name: '', last_name: '', email: '', password: '', phone: '', address: '', agreed: false })
  const [errors, setErrors] = useState({})
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const navigate = useNavigate()

  function validate(values) {
    const nextErrors = {}
    if (!values.first_name.trim()) nextErrors.first_name = 'First name is required'
    if (!values.last_name.trim()) nextErrors.last_name = 'Last name is required'
    if (!values.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email'
    }
    if (!values.password) {
      nextErrors.password = 'Password is required'
    } else if (values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }
    if (values.phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(values.phone)) {
      nextErrors.phone = 'Enter a valid phone number'
    }
    return nextErrors
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    console.log('Form submitted with values:', formValues)
    
    const nextErrors = validate(formValues)
    if (!formValues.agreed) nextErrors.agreed = 'Captcha is required'
    setErrors(nextErrors)
    
    if (Object.keys(nextErrors).length === 0) {
      try {
        const requestBody = {
          first_name: formValues.first_name.trim(),
          last_name: formValues.last_name.trim(),
          email: formValues.email.trim(),
          password: formValues.password,
          phone: formValues.phone.trim(),
          address: formValues.address.trim()
        }
        
        console.log('Sending registration request with:', requestBody)
        
        const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        })
        
        console.log('Response status:', response.status)
        
        let data
        try {
          data = await response.json()
          console.log('Response data:', data)
        } catch (jsonError) {
          const text = await response.text()
          console.error('Failed to parse JSON response. Raw response:', text)
          throw new Error(`Server responded with status ${response.status}: ${text}`)
        }
        
        if (!response.ok) {
          const errorMessage = data?.message || data?.error || response.statusText
          console.error('Server error details:', {
            status: response.status,
            statusText: response.statusText,
            data: data
          })
          throw new Error(errorMessage || `Registration failed with status ${response.status}`)
        }
        
        alert('Registration successful! Please login to continue.')
        setFormValues({ first_name: '', last_name: '', email: '', password: '', phone: '', address: '', agreed: false })
        
        // Check if there's a redirect path in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect');
        
        // Redirect to login page with the same redirect parameter
        if (redirectTo) {
          navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Registration error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        
        let errorMessage = 'Registration failed. Please try again.'
        if (error.message.includes('400')) {
          errorMessage = 'Invalid data. Please check all fields and try again.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        alert(errorMessage)
      }
    }
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        {/* Hero with background image + soft overlay */}
        <section
          style={{
            position: 'relative',
            background: `url(${bg}) no-repeat center center/cover`,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '56px 16px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))' }}></div>
          {/* Signup card */}
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
            {/* Decorative branded header */}
            <div style={{ background: '#f1f5f9', padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.9rem', fontWeight: 900, color: '#0f172a' }}>WELCOME TO SISZUM</h2>
            </div>

            <div style={{ padding: 28 }}>
              <p style={{ textAlign: 'center', color: '#475569', marginBottom: 18 }}>Create your account to save reservations and share reviews.</p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Name Fields */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formValues.first_name}
                      onChange={handleChange}
                      placeholder="First name"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    />
                    {errors.first_name && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{errors.first_name}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formValues.last_name}
                      onChange={handleChange}
                      placeholder="Last name"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    />
                    {errors.last_name && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{errors.last_name}</div>}
                  </div>
                </div>

                {/* Email */}
                <label style={{ display: 'block', fontWeight: 600, margin: '10px 0 6px' }}>Email address</label>
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

                {/* Password */}
                <label style={{ display: 'block', fontWeight: 600, margin: '10px 0 6px' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

                {/* Phone Number */}
                <label style={{ display: 'block', fontWeight: 600, margin: '10px 0 6px' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
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
                {errors.phone && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.phone}</div>}

                {/* Address */}
                <label style={{ display: 'block', fontWeight: 600, margin: '10px 0 6px' }}>Address</label>
                <textarea
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    marginBottom: 6,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.address && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.address}</div>}

                {/* Google reCAPTCHA */}
                <div style={{ margin: '10px 0 16px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center', height: 78 }}>
                    <ReCAPTCHA size="normal" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={(token) => setFormValues((p) => ({ ...p, agreed: Boolean(token) }))} />
                  </div>
                </div>
                {errors.agreed && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.agreed}</div>}

                {/* Signup button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: 9999,
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    letterSpacing: 0.5,
                    transition: 'transform .15s ease, box-shadow .15s ease, opacity .15s ease',
                    boxShadow: hoverPrimary ? '0 10px 22px rgba(220,38,38,0.4)' : '0 6px 14px rgba(220,38,38,0.3)',
                    transform: hoverPrimary ? 'translateY(-1px) scale(1.015)' : 'translateY(0) scale(1)'
                  }}
                  onMouseEnter={() => setHoverPrimary(true)}
                  onMouseLeave={() => setHoverPrimary(false)}
                >
                  Sign up
                </button>

                {/* Already have account */}
                <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ fontWeight: 700, color: '#111827' }}>
                    <span style={{ textDecoration: 'underline' }}>Login now!</span>
                  </Link>
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
