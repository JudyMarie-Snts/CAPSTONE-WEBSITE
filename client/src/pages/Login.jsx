import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg2.png'

export default function Login() {
  const [formValues, setFormValues] = useState({ email: '', password: '', agreed: false })
  const [errors, setErrors] = useState({})
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const navigate = useNavigate()

  function validate(values) {
    const nextErrors = {}
    if (!values.email.trim()) {
      nextErrors.email = 'Email is required'
    }
    if (!values.password) {
      nextErrors.password = 'Password is required'
    }
    if (!captchaToken) nextErrors.agreed = 'Please complete the CAPTCHA'
    return nextErrors
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
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
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
      
      // Check if there's a redirect path in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || '/';
      
      // Redirect to the specified path (or home page by default)
      navigate(redirectTo, { replace: true });
      
    } catch (error) {
      console.error('Login error:', error);
      // Clear any previous errors
      setErrors({});
      
      // Set the specific error message
      setErrors(prev => ({
        ...prev,
        login: error.message || 'Failed to login. Please try again.'
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
            background: `url(${bg}) no-repeat center center/cover`,
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
              <h2 style={{ margin: 0, textAlign: 'center', fontSize: '1.9rem', fontWeight: 900, color: '#0f172a' }}>WELCOME BACK SISZUM!</h2>
            </div>

            <div style={{ padding: 28 }}>
              <form onSubmit={handleSubmit} noValidate>
                {errors.login && (
                  <div style={{ 
                    background: '#fef2f2', 
                    color: '#b91c1c', 
                    padding: '10px 12px', 
                    borderRadius: 8, 
                    marginBottom: 16,
                    border: '1px solid #fecaca',
                    fontSize: 14
                  }}>
                    {errors.login}
                  </div>
                )}
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
                  <Link to="/reset-password" style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Forgot Password?</Link>
                </div>

                <div style={{ margin: '10px 0 14px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center', height: 78 }}>
                    <ReCAPTCHA size="small" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={(token) => setCaptchaToken(token || '')} />
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
                    boxShadow: hoverPrimary ? '0 10px 22px rgba(220,38,38,0.4)' : '0 6px 14px rgba(220,38,38,0.3)',
                    transform: hoverPrimary ? 'translateY(-1px) scale(1.015)' : 'translateY(0) scale(1)'
                  }}
                  onMouseEnter={() => setHoverPrimary(true)}
                  onMouseLeave={() => setHoverPrimary(false)}
                >
                  Login
                </button>

                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#475569' }}>
                  Don't have an account? <Link to="/register" style={{ fontWeight: 800, color: '#111827' }}>Register now!</Link>
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


