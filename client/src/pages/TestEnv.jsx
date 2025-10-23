import React from 'react'

export default function TestEnv() {
  const baseUrl = import.meta.env.VITE_POS_BASE_URL
  const allEnv = import.meta.env
  
  return (
    <div style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      
      <h2>VITE_POS_BASE_URL:</h2>
      <div style={{ 
        padding: 20, 
        background: baseUrl ? '#d4edda' : '#f8d7da',
        border: `2px solid ${baseUrl ? '#28a745' : '#dc3545'}`,
        borderRadius: 8,
        marginBottom: 20
      }}>
        <strong>{baseUrl || '❌ NOT SET'}</strong>
      </div>
      
      <h2>All Environment Variables:</h2>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: 20, 
        borderRadius: 8,
        overflow: 'auto'
      }}>
        {JSON.stringify(allEnv, null, 2)}
      </pre>
      
      <h2>Instructions:</h2>
      <ol>
        <li>VITE_POS_BASE_URL should be: <code>http://localhost:5000</code></li>
        <li>If not set, check .env file exists in client/ folder</li>
        <li>Restart frontend server after creating/modifying .env</li>
        <li>Hard refresh browser (Ctrl+Shift+R)</li>
      </ol>
    </div>
  )
}
