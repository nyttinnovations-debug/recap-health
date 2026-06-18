import { useState, useEffect } from 'react'

const PASSWORD = 'recap2025'
const TOKEN_KEY = 'recap_auth'

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY) === PASSWORD) setAuthed(true)
    setLoading(false)
  }, [])

  function handleUnlock() {
    if (input === PASSWORD) {
      localStorage.setItem(TOKEN_KEY, PASSWORD)
      setAuthed(true)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (loading) return null

  if (!authed) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A2463 0%, #1E6FBF 100%)',
      fontFamily: 'Inter, sans-serif', padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px 36px',
        width: '100%', maxWidth: '360px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            background: '#3B5BDB', color: 'white', borderRadius: '8px',
            padding: '4px 14px', fontSize: '13px', fontWeight: 700,
            letterSpacing: '1px'
          }}>RECAP</span>
        </div>
        <p style={{ color: '#6B7280', fontSize: '13px', margin: '8px 0 28px' }}>
          Recovery Intelligence
        </p>
        <p style={{ color: '#1A1A2E', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>
          Enter access password
        </p>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          placeholder="Password"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '10px',
            border: error ? '2px solid #EF4444' : '2px solid #E5E7EB',
            fontSize: '15px', outline: 'none', boxSizing: 'border-box',
            marginBottom: '12px', transition: 'border 0.2s'
          }}
        />
        {error && <p style={{ color: '#EF4444', fontSize: '13px', margin: '-4px 0 10px' }}>
          Incorrect password
        </p>}
        <button
          onClick={handleUnlock}
          style={{
            width: '100%', padding: '13px', background: '#3B5BDB',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Unlock →
        </button>
      </div>
    </div>
  )

  return children
}
