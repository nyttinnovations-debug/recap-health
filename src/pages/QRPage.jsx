import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QRPage() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('https://recap-health.vercel.app')
  const [copied, setCopied] = useState(false)

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&color=111827&bgcolor=ffffff&data=${encodeURIComponent(url)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()

  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA' }}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
          body { background: #fff; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print" style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.08)', padding:'0 32px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', height:60, display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('/hospital')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', color:'#6B7280', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>
            ← Back
          </button>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#111827' }}>Generate Presentation QR</div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>

          {/* Left: controls */}
          <div className="no-print">
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.4rem', color:'#111827', marginBottom:6, letterSpacing:'-0.02em' }}>
              Presentation QR Code
            </h2>
            <p style={{ color:'#6B7280', fontSize:'0.85rem', lineHeight:1.65, marginBottom:28 }}>
              Enter your deployed Vercel URL below. Judges scan this QR from your printed discharge sheet and land directly on the patient landing page.
            </p>

            <label style={{ display:'block', fontSize:'0.7rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#6B7280', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
              Deployed URL
            </label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://recap-health.vercel.app" style={{ marginBottom:6 }} />
            <p style={{ fontSize:'0.72rem', color:'#9CA3AF', marginBottom:24 }}>
              After running <code style={{ background:'#F3F4F6', padding:'1px 5px', borderRadius:4, fontSize:'0.7rem' }}>npx vercel --prod</code>, paste the URL it gives you here.
            </p>

            <div style={{ display:'flex', gap:10, marginBottom:24 }}>
              <button onClick={handlePrint} style={{ flex:1, padding:'12px', borderRadius:12, background:'#1A73E8', color:'#fff', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(26,115,232,0.3)' }}>
                🖨 Print QR Code
              </button>
              <button onClick={handleCopy} style={{ padding:'12px 16px', borderRadius:12, background:'#fff', border:'1px solid rgba(0,0,0,0.1)', color:'#374151', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }}>
                {copied ? '✓ Copied!' : '📋 Copy URL'}
              </button>
            </div>

            {/* Instructions */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:14, padding:18, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.85rem', marginBottom:12 }}>Before the Presentation</div>
              {[
                { n:'1', text:'Deploy the app: cd ~/recap/recap → npx vercel --prod', code:true },
                { n:'2', text:'Copy the Vercel URL (e.g. recap-health-abc.vercel.app)', code:false },
                { n:'3', text:'Paste it above and click "Print QR Code"', code:false },
                { n:'4', text:'Print the QR and attach it to the discharge sheet', code:false },
                { n:'5', text:'Judges scan it with any phone camera -- no app needed', code:false },
              ].map(step => (
                <div key={step.n} style={{ display:'flex', gap:10, marginBottom:10 }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:'rgba(26,115,232,0.1)', border:'1px solid rgba(26,115,232,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:800, color:'#1A73E8' }}>{step.n}</span>
                  </div>
                  <span style={{ fontSize:'0.8rem', color:'#374151', lineHeight:1.5 }}>
                    {step.code ? <code style={{ background:'#F3F4F6', padding:'1px 5px', borderRadius:4, fontSize:'0.72rem' }}>{step.text}</code> : step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QR preview */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            {/* Print area */}
            <div style={{ background:'#fff', border:'2px solid rgba(0,0,0,0.1)', borderRadius:20, padding:32, textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', width:'100%', maxWidth:340 }}>
              {/* RECAP brand */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:20 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#1A73E8,#6D28D9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.75rem' }}>⊕</div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1rem', color:'#111827', lineHeight:1 }}>RECAP</div>
                  <div style={{ fontSize:'0.55rem', color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase' }}>Recovery Intelligence</div>
                </div>
              </div>

              {/* QR */}
              <div style={{ marginBottom:16, borderRadius:12, overflow:'hidden', border:'1px solid rgba(0,0,0,0.08)' }}>
                <img src={qrSrc} alt="QR Code" style={{ width:'100%', display:'block' }} />
              </div>

              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'#111827', marginBottom:4 }}>
                Scan to Start Your Recovery
              </div>
              <div style={{ fontSize:'0.7rem', color:'#9CA3AF', lineHeight:1.5, marginBottom:12 }}>
                Point your phone camera at this code.<br />No app download required.
              </div>
              <div style={{ padding:'6px 12px', borderRadius:8, background:'#F3F4F6' }}>
                <div style={{ fontSize:'0.62rem', color:'#6B7280', wordBreak:'break-all' }}>{url}</div>
              </div>
            </div>

            <div className="no-print" style={{ marginTop:16, textAlign:'center' }}>
              <p style={{ color:'#9CA3AF', fontSize:'0.72rem', lineHeight:1.6 }}>
                Print this QR and attach to the discharge sheet.<br />Judges scan it → lands on the patient page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
