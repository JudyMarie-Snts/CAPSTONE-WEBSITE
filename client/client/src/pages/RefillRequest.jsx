import React, { useEffect, useMemo, useState } from 'react'
import { createRefillRequest, getTableTimer, isPosConfigured, updateRefillRequestStatus } from '../api/pos.js'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import bg from '../assets/bg.jpg'
import siomaiImg from '../assets/Siomai.png'
import sausageImg from '../assets/Sausage.png'
import cucumberImg from '../assets/Cucumber.png'
import beanSproutsImg from '../assets/Bean Sprouts.png'
import kimchiImg from '../assets/Kimchi.png'
import fishcakeImg from '../assets/Fishcake.png'
import eggrollImg from '../assets/Eggroll.png'
import babyPotatoesImg from '../assets/Baby Potatoes.png'
import porkImg from '../assets/Pork.png'
import beefImg from '../assets/Beef.png'
import chickenImg from '../assets/Chicken.png'
import premiumPorkImg from '../assets/Premium Pork.png'
import premiumChickenImg from '../assets/Premium Chicken.png'
import riceImg from '../assets/Rice.png'
import lettuceImg from '../assets/Lettuce.png'
import cheeseImg from '../assets/Cheese.png'
import drinksImg from '../assets/Drinks.png'


function Counter({ value, onChange }) {
  function dec() { onChange(Math.max(0, value - 1)) }
  function inc() { onChange(value + 1) }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <button type="button" onClick={dec} style={{ width: 20, height: 20, fontSize: '0.7rem', borderRadius: 3, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>-</button>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value||0)))}
        style={{ width: 32, fontSize: '0.8rem', textAlign: 'center', borderRadius: 4, border: '1px solid #d1d5db', padding: '2px 4px' }} />
      <button type="button" onClick={inc} style={{ width: 20, height: 20, fontSize: '0.7rem', borderRadius: 3, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer' }}>+</button>
    </div>
  )
}

function Item({ name, img, qty, setQty }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 8, alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `url('${img}') center/cover no-repeat`, border: '2px solid #ef4444' }}></div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
      <Counter value={qty} onChange={setQty} />
    </div>
  )
}

function Section({ title, items, state, setState }) {
  return (
    <div style={{ marginTop: 12 }}>
      <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', margin: '8px 0 6px' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        {items.map((it) => (
          <Item key={it.name} name={it.name} img={it.img}
            qty={state[it.name] || 0}
            setQty={(v) => setState((s) => ({ ...s, [it.name]: v }))}
          />
        ))}
      </div>
    </div>
  )
}

export default function RefillRequest() {
  const [meta, setMeta] = useState({ tableCode: '', tableNumber: '', status: 'On-going', time: '20:00' })
  const [remainingSec, setRemainingSec] = useState(null)
  const [side, setSide] = useState({})
  const [meat, setMeat] = useState({})
  const [food, setFood] = useState({})
  const [currentRefillId, setCurrentRefillId] = useState(null)

  const sideItems = [
    { name: 'Siomai', img: siomaiImg },
    { name: 'Hotdog', img: sausageImg },
    { name: 'Cucumber', img: cucumberImg },
    { name: 'Bean Sprouts', img: beanSproutsImg },
    { name: 'Kimchi', img: kimchiImg },
    { name: 'Fishcake', img: fishcakeImg },
    { name: 'Eggroll', img: eggrollImg },
    { name: 'Baby Potatoes', img: babyPotatoesImg }
  ]
  const meatItems = [
    { name: 'Pork', img: porkImg },
    { name: 'Beef', img: beefImg },
    { name: 'Chicken', img: chickenImg },
    { name: 'Premium Pork', img: premiumPorkImg },
    { name: 'Premium Chicken', img: premiumChickenImg }
  ]
  const foodItems = [
    { name: 'Rice', img: riceImg },
    { name: 'Lettuce', img: lettuceImg },
    { name: 'Cheese', img: cheeseImg },
    { name: 'Drinks', img: drinksImg }
  ]

  function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const navigate = useNavigate();

  // Function to update refill status to completed when timer ends
  async function updateRefillStatusToCompleted() {
    const refillId = currentRefillId || localStorage.getItem('currentRefillId')
    if (!refillId) {
      console.warn('No refill ID found, cannot update status')
      return
    }
    
    try {
      console.log('Timer ended, updating refill request status to completed...')
      const res = await updateRefillRequestStatus(refillId, 'completed')
      if (res?.ok) {
        console.log('✅ Refill request marked as completed')
        setMeta((m) => ({ ...m, status: 'Completed' }))
      } else {
        console.error('Failed to update refill status:', res)
      }
    } catch (error) {
      console.error('Error updating refill status:', error)
    }
  }

  // Initialize countdown based on admin-configured duration (table-specific)
  useEffect(() => {
    if (!meta.tableCode) return // Wait for table code to be set
    
    // Priority 1: URL param ?minutes=20 (admin can send link)
    const params = new URLSearchParams(window.location.search)
    const minutesParam = params.get('minutes')
    // Priority 2: localStorage key set by admin panel, e.g. refillDurationSec
    const storedDuration = Number(localStorage.getItem('refillDurationSec') || 0)
    const now = Date.now()

    // Use table-specific localStorage keys
    const deadlineKey = `refillDeadlineMs_${meta.tableCode}`
    const durationKey = `refillDurationSec_${meta.tableCode}`
    
    let deadline = Number(localStorage.getItem(deadlineKey) || 0)

    // If no valid deadline or it's in the past, create a new one from params or storage
    if (!deadline || deadline < now) {
      const defaultDuration = 2 * 60 * 60 // 2 hours in seconds
      const durationSec = minutesParam ? Math.max(60, Number(minutesParam) * 60) : (storedDuration || defaultDuration)
      deadline = now + durationSec * 1000
      localStorage.setItem(deadlineKey, String(deadline))
      localStorage.setItem(durationKey, String(durationSec))
      setMeta((m) => ({ ...m, time: formatTime(durationSec) }))
      console.log(`⏰ New timer created for ${meta.tableCode}: ${formatTime(durationSec)}`)
    } else {
      console.log(`⏰ Resuming timer for ${meta.tableCode}`)
    }

    // Start ticking
    function tick() {
      const remain = Math.max(0, Math.floor((deadline - Date.now()) / 1000))
      setRemainingSec(remain)
      setMeta((m) => ({ ...m, time: formatTime(remain), status: remain === 0 ? 'Completed' : 'On-going' }))
      
      if (remain === 0) {
        // Update status to completed when timer ends
        updateRefillStatusToCompleted()
        
        // Clear deadline when finished for this specific table
        localStorage.removeItem(deadlineKey)
        localStorage.removeItem(durationKey)
        
        // Redirect to TimesUp page after a short delay
        setTimeout(() => {
          navigate('/timesup')
        }, 1000)
      }
    }
    
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [navigate, meta.tableCode])

  // Initialize admin-controlled meta fields (table code/number/status)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    // Debug: Check what's in localStorage
    console.log('🔍 localStorage values:', {
      refillTableCode: localStorage.getItem('refillTableCode'),
      refillTableNumber: localStorage.getItem('refillTableNumber'),
      refillStatus: localStorage.getItem('refillStatus')
    })
    
    const adminTableCode = (params.get('tableCode') || localStorage.getItem('refillTableCode') || '').replace(/^(undefined|null)$/, '')
    const adminTableNumber = (params.get('tableNumber') || localStorage.getItem('refillTableNumber') || '').replace(/^(undefined|null)$/, '')
    const adminStatus = (params.get('status') || localStorage.getItem('refillStatus') || 'On-going').replace(/^(undefined|null)$/, 'On-going')
    
    console.log('✅ After filtering:', { adminTableCode, adminTableNumber, adminStatus })
    
    // Only update if we have valid table code
    if (adminTableCode && adminTableCode.trim() !== '') {
      setMeta((m) => ({ ...m, tableCode: adminTableCode, tableNumber: adminTableNumber, status: adminStatus }))
    } else {
      console.warn('⚠️ No valid table code found, redirecting to /refilling')
      navigate('/refilling')
    }
  }, [navigate])

  // If POS is configured, try to fetch the current table timer from POS
  useEffect(() => {
    async function fetchTimer() {
      if (!isPosConfigured() || !meta.tableCode) return
      const res = await getTableTimer(meta.tableCode)
      if (res?.ok && res?.data) {
        // Expecting { remainingSec: number } or { durationSec: number }
        const remaining = Number(res.data.remainingSec ?? res.data.durationSec ?? 0)
        if (remaining > 0) {
          const deadline = Date.now() + remaining * 1000
          localStorage.setItem('refillDeadlineMs', String(deadline))
          localStorage.setItem('refillDurationSec', String(remaining))
          setRemainingSec(remaining)
          setMeta((m) => ({ ...m, time: formatTime(remaining), status: 'On-going' }))
        }
      }
    }
    fetchTimer()
    // Only when table code changes
  }, [meta.tableCode])

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate table code
    if (!meta.tableCode || meta.tableCode.trim() === '') {
      alert('Table code is missing. Please go back to the refilling page and enter a valid table code.')
      navigate('/refilling')
      return
    }
    
    // Build compact items payload (only non-zero)
    function nonZeroEntries(map) {
      return Object.entries(map).filter(([, v]) => Number(v) > 0).map(([name, qty]) => ({ name, qty }))
    }
    
    const sideItems = nonZeroEntries(side)
    const meatItems = nonZeroEntries(meat)
    const foodItems = nonZeroEntries(food)
    
    // Build request_type string from selected items
    const allItems = [...sideItems, ...meatItems, ...foodItems]
    const requestType = allItems.length > 0 
      ? allItems.map(item => `${item.name} (${item.qty})`).join(', ')
      : 'General Refill'
    
    // Get customer_id from localStorage if logged in
    const customerId = localStorage.getItem('customerId') || null
    
    const payload = {
      table_code: meta.tableCode.trim(),
      customer_id: customerId,
      request_type: requestType,
      notes: `Requested items: ${JSON.stringify({ side: sideItems, meat: meatItems, food: foodItems })}`
    }

    console.log('Submitting refill request:', payload)

    let refillId = ''
    try {
      const res = await createRefillRequest(payload)
      console.log('Refill request response:', res)
      
      if (res?.ok && res?.data) {
        refillId = res.data.id || ''
        
        // Save refill ID for timer completion
        if (refillId) {
          setCurrentRefillId(refillId)
          localStorage.setItem('currentRefillId', refillId)
          console.log('✅ Refill request created with ID:', refillId)
        }
        
        window.location.href = `/refill-request-submitted${refillId ? `?id=${encodeURIComponent(refillId)}` : ''}`
        return
      } else {
        const errorMsg = res?.data?.message || res?.error || 'Failed to submit refill request. Please try again.'
        console.error('Refill request failed:', errorMsg)
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Error submitting refill request:', error)
      alert('Unable to submit refill request. Please check your connection and try again.')
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
            padding: '40px 16px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1200px 400px at 50% -10%, rgba(255,255,255,0.08), rgba(0,0,0,0)), linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.35))' }}></div>
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 820, background: 'rgba(17,24,39,0.84)', borderRadius: 20, padding: 24, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
            <h2 style={{ color: '#ffffff', fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', margin: 0, fontSize: '1.8rem' }}>Refill Request</h2>

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Table Code</label>
                <input value={meta.tableCode} readOnly aria-readonly={true} placeholder="001" style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#e5e7eb', color: '#111827', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Table Number</label>
                <input value={meta.tableNumber} readOnly aria-readonly={true} placeholder="A-1" style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#e5e7eb', color: '#111827', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Timer</label>
                <div style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#0b1220', color: '#fff', fontWeight: 900, letterSpacing: 1, textAlign: 'center', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)', animation: remainingSec !== null && remainingSec <= 60 ? 'pulse 1s infinite' : 'none' }}>
                  {meta.time}
                </div>
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Status Tracking</label>
                <input value={meta.status} readOnly aria-readonly={true} placeholder="On-going" style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#e5e7eb', fontWeight: 900, color: '#111827' }} />
              </div>
            </div>

            {/* Sections */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0 10px' }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxHeight: '60vh', overflowY: 'auto', padding: '8px 4px' }}>
              <div>
                <Section title="Sides" items={sideItems} state={side} setState={setSide} />
              </div>
              <div>
                <Section title="Meats" items={meatItems} state={meat} setState={setMeat} />
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0 8px' }}></div>
                <Section title="Food" items={foodItems} state={food} setState={setFood} />
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <button type="submit" style={{ width: 300, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#111827', fontWeight: 900, border: 'none', padding: '12px 18px', borderRadius: 9999, cursor: 'pointer', boxShadow: '0 14px 28px rgba(245,158,11,0.35)' }}>Submit Refill Request</button>
                <Link to="/" style={{ width: 300, textAlign: 'center', background: '#dc2626', color: '#fff', fontWeight: 900, textDecoration: 'none', padding: '12px 18px', borderRadius: 9999, boxShadow: '0 14px 28px rgba(239,68,68,0.35)' }}>Back to Home Page</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


