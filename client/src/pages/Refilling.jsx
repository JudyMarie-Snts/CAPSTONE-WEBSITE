import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { validateTableCode } from '../api/pos.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg.jpg'


export default function Refilling() {
  const navigate = useNavigate()
  const [tableCode, setTableCode] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const next = {}
    
    if (!tableCode.trim()) {
      next.tableCode = 'Enter table code'
      setErrors(next)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      // Validate table code against database
      const res = await validateTableCode(tableCode.trim())
      
      // If backend is not configured or unavailable, allow offline mode
      if (res?.skipped) {
        console.warn('Backend not configured, proceeding in offline mode')
        // Store table info in localStorage for RefillRequest page (offline mode)
        localStorage.setItem('refillTableCode', tableCode.trim())
        localStorage.setItem('refillTableNumber', tableCode.trim().replace('TBL', ''))
        localStorage.setItem('refillTableId', '0')
        
        // Navigate to refill request page
        navigate('/refill-request')
        return
      }
      
      if (res?.ok && res?.data) {
        // Store table info in localStorage for RefillRequest page
        console.log('✅ Validation response:', res.data)
        
        // Ensure we don't store undefined values
        const validTableCode = res.data.table_code || tableCode.trim()
        const validTableNumber = res.data.table_number || res.data.table_code?.replace(/^TBL/, '') || tableCode.trim().replace(/^TBL/, '')
        const validTableId = res.data.id || '0'
        
        localStorage.setItem('refillTableCode', validTableCode)
        localStorage.setItem('refillTableNumber', validTableNumber)
        localStorage.setItem('refillTableId', validTableId)
        
        console.log('💾 Stored in localStorage:', { validTableCode, validTableNumber, validTableId })
        
        // Navigate to refill request page
        navigate('/refill-request')
      } else {
        setErrors({ tableCode: res?.data?.message || 'Invalid table code. Please check and try again.' })
      }
    } catch (error) {
      console.error('Validation error:', error)
      // If there's a network error, proceed in offline mode
      console.warn('Network error, proceeding in offline mode')
      localStorage.setItem('refillTableCode', tableCode.trim())
      localStorage.setItem('refillTableNumber', tableCode.trim().replace('TBL', ''))
      localStorage.setItem('refillTableId', '0')
      navigate('/refill-request')
    } finally {
      setLoading(false)
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.35))' }}></div>
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 640, textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.6rem', lineHeight: 1.2, marginBottom: 16 }}>
              REFILL TABLE CODE
            </h1>
            <p style={{ color: '#e5e7eb', lineHeight: 1.8, letterSpacing: 0.2, marginBottom: 28 }}>
              Enter the Table Code given by the staff to start your refill request. The timer will begin once cooking starts. Ensure it's the correct code for your table.
            </p>

            <form onSubmit={submit} noValidate style={{
              margin: '0 auto',
              maxWidth: 520,
              background: 'rgba(17,24,39,0.75)',
              padding: 28,
              borderRadius: 18,
              textAlign: 'left',
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div>
                  <label style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Table Code</label>
                  <input 
                    value={tableCode} 
                    onChange={(e)=>setTableCode(e.target.value.toUpperCase())} 
                    placeholder=""
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      borderRadius: 14, 
                      border: errors.tableCode ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.25)', 
                      background: loading ? '#e5e7eb' : '#fff',
                      opacity: loading ? 0.6 : 1
                    }} 
                  />
                  {errors.tableCode && <div style={{ color: '#fecaca', fontSize: 12, marginTop: 6, fontWeight: 600 }}>{errors.tableCode}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 18 }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: 260, 
                    background: loading ? '#9ca3af' : '#f59e0b', 
                    color: '#111827', 
                    border: 'none', 
                    padding: '12px 16px', 
                    borderRadius: 9999, 
                    fontWeight: 900, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Validating...' : 'Go to Refill Request'}
                </button>
                <Link to="/" style={{ display: 'inline-block', background: '#dc2626', color: '#fff', textDecoration: 'none', padding: '12px 16px', borderRadius: 9999, fontWeight: 900 }}>Back to Home Page</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


