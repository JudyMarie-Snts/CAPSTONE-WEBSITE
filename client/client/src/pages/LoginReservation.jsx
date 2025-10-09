import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import reservation from '../assets/reservation.jpg'

export default function LoginReservation() {
  const [formValues, setFormValues] = useState({ email: '', password: '', agreed: false })
  const [errors, setErrors] = useState({})
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const [hoverGoogle, setHoverGoogle] = useState(false)
  const navigate = useNavigate()

  function validate(values) {
    const nextErrors = {}
    if (!values.email.trim()) nextErrors.email = 'Email is required'
    if (!values.password) nextErrors.password = 'Password is required'
    if (!values.agreed) nextErrors.agreed = 'Captcha is required'
    return nextErrors
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted with values:', formValues);
    
    // Reset previous errors
    setErrors({});
    
    // Validate form
    const nextErrors = validate(formValues);
    if (Object.keys(nextErrors).length > 0) {
      console.log('Validation errors:', nextErrors);
      setErrors(nextErrors);
      return;
    }
    
    try {
      console.log('Sending login request...');
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password
        }),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid server response');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          // Check if the error is specifically about user not found
          if (data.message && data.message.toLowerCase().includes('invalid email')) {
            throw new Error('No account found with this email. Please sign up first.');
          }
          throw new Error(data.message || 'Invalid email or password');
        }
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      if (!data.data || !data.data.token) {
        throw new Error('Invalid response format from server');
      }

      // Save user data to local storage
      const user = data.data.user || data.data;
      const userData = {
        ...data.data,
        // Add any additional user data you need
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
      
      // Check for pending reservation
      const pendingReservation = localStorage.getItem('pendingReservation');
      
      if (pendingReservation) {
        console.log('Found pending reservation, redirecting to complete it');
        // Clear the pending reservation from storage
        localStorage.removeItem('pendingReservation');
        // Navigate to reservation page with the pending data
        navigate('/reservation', { 
          state: JSON.parse(pendingReservation),
          replace: true
        });
      } else {
        // No pending reservation, go to default page
        console.log('No pending reservation, redirecting to /reservation-date');
        navigate('/reservation-date', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear any previous errors
      setErrors({});
      
      // Set the specific error message
      setErrors(prev => ({
        ...prev,
        login: error.message || 'Failed to login. Please try again.',
        // If it's an unregistered account error, show it under the email field
        ...(error.message && error.message.toLowerCase().includes('no account') && {
          email: 'No account found with this email. Please sign up first.'
        })
      }));
      
      // Scroll to the error message
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
              <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.9rem', fontWeight: 900, color: '#0f172a' }}>LOGIN TO RESERVE</h2>
            </div>

            <div style={{ padding: 28 }}>
              <form onSubmit={handleSubmit} noValidate>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email address</label>
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
                <div style={{ textAlign: 'right', marginBottom: 10 }}>
                  <Link to="/reset-reservation" style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Forgot Password?</Link>
                </div>
                <div style={{ margin: '10px 0 16px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center', height: 78 }}>
                    <ReCAPTCHA size="normal" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={(token) => setFormValues((p) => ({ ...p, agreed: Boolean(token) }))} />
                  </div>
                </div>
                {errors.agreed && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{errors.agreed}</div>}

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
                    boxShadow: hoverPrimary ? '0 10px 22px rgba(220,38,38,0.4)' : '0 6px 14px rgba(220,38,38,0.3)'
                  }}
                  onMouseEnter={() => setHoverPrimary(true)}
                  onMouseLeave={() => setHoverPrimary(false)}
                >
                  Login & Reserve
                </button>

                <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
                  Don’t have an account?{' '}
                  <Link to="/signup" style={{ fontWeight: 700, color: '#111827' }}>Sign up</Link>
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


