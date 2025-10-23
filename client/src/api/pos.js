// Lightweight POS API client. Configure base URL via Vite env: VITE_POS_BASE_URL
// Updated: 2025-10-06 11:21 - HARDCODED FALLBACK FOR DEVELOPMENT

// HARDCODED fallback to localhost:5000 for development
const baseUrl = import.meta?.env?.VITE_POS_BASE_URL || 'http://localhost:5000'

// Log the configuration on load
console.log('🔧 POS API Configuration (Updated 11:21 - HARDCODED FALLBACK):')
console.log('  VITE_POS_BASE_URL from env:', import.meta?.env?.VITE_POS_BASE_URL)
console.log('  Using baseUrl:', baseUrl)
console.log('  Fallback active:', !import.meta?.env?.VITE_POS_BASE_URL)
console.log('  ✅ This should ALWAYS work now!')

function getHeaders(apiKey) {
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
  return headers
}

export async function validateTableCode(tableCode, options = {}) {
  if (!baseUrl) {
    return { ok: false, skipped: true, error: 'POS base URL not configured' }
  }
  const apiKey = options.apiKey || import.meta?.env?.VITE_POS_API_KEY
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/refill-requests/validate-table`, {
      method: 'POST',
      headers: getHeaders(apiKey),
      body: JSON.stringify({ table_code: tableCode }),
    })
    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
  } catch (error) {
    return { ok: false, error: error?.message || 'Network error' }
  }
}

export async function createRefillRequest(payload, options = {}) {
  if (!baseUrl) {
    console.warn('POS base URL not configured, check .env file')
    return { ok: false, skipped: true, error: 'POS base URL not configured. Please contact administrator.' }
  }
  const apiKey = options.apiKey || import.meta?.env?.VITE_POS_API_KEY
  try {
    const url = `${baseUrl.replace(/\/$/, '')}/api/refill-requests`
    console.log('Creating refill request to:', url)
    console.log('Payload:', payload)
    
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload),
    })
    
    console.log('Response status:', res.status)
    const data = await res.json().catch(() => null)
    console.log('Response data:', data)
    
    return { ok: res.ok, status: res.status, data }
  } catch (error) {
    console.error('Network error creating refill request:', error)
    return { ok: false, error: error?.message || 'Network error' }
  }
}

export async function getTableTimer(tableCode, options = {}) {
  if (!baseUrl) return { ok: false, skipped: true, error: 'POS base URL not configured' }
  const apiKey = options.apiKey || import.meta?.env?.VITE_POS_API_KEY
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tables/${encodeURIComponent(tableCode)}/timer`, {
      headers: getHeaders(apiKey),
    })
    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
  } catch (error) {
    return { ok: false, error: error?.message || 'Network error' }
  }
}

export async function updateRefillRequestStatus(refillId, status, options = {}) {
  if (!baseUrl) {
    console.warn('POS base URL not configured')
    return { ok: false, skipped: true, error: 'POS base URL not configured' }
  }
  const apiKey = options.apiKey || import.meta?.env?.VITE_POS_API_KEY
  try {
    const url = `${baseUrl.replace(/\/$/, '')}/api/refill-requests/${refillId}/status`
    console.log('Updating refill request status to:', status)
    
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(apiKey),
      body: JSON.stringify({ status }),
    })
    
    const data = await res.json().catch(() => null)
    console.log('Update status response:', data)
    
    return { ok: res.ok, status: res.status, data }
  } catch (error) {
    console.error('Network error updating refill status:', error)
    return { ok: false, error: error?.message || 'Network error' }
  }
}

// Customer Timer API functions
// Customer timer APIs removed to decouple refills from customer_timers.
// If needed in the future, reintroduce specific read-only endpoints without writes.

export function isPosConfigured() {
  return Boolean(baseUrl)
}

