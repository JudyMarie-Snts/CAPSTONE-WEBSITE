// Test connection to backend API
export async function testBackendConnection() {
  const baseUrl = import.meta?.env?.VITE_POS_BASE_URL || ''
  
  console.log('=== Backend Connection Test ===')
  console.log('Base URL from env:', baseUrl)
  console.log('All env vars:', import.meta.env)
  
  if (!baseUrl) {
    console.error('❌ VITE_POS_BASE_URL is not set!')
    console.log('Please check:')
    console.log('1. .env file exists in client/ folder')
    console.log('2. .env contains: VITE_POS_BASE_URL=http://localhost:5001')
    console.log('3. Frontend server was restarted after creating .env')
    return false
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/health`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Backend connection successful!')
      console.log('Backend response:', data)
      return true
    } else {
      console.error('❌ Backend responded with error:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error.message)
    console.log('Make sure backend server is running on:', baseUrl)
    return false
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testBackendConnection()
}
