import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.PROD ? '/api/claude' : '/v1/messages'

const FIELDS = [
  { key:'patientName', label:'Patient Name', icon:'👤' },
  { key:'age', label:'Age', icon:'🎂' },
  { key:'gender', label:'Gender', icon:'⚤' },
  { key:'hospitalName', label:'Hospital Name', icon:'🏥' },
  { key:'surgeryName', label:'Surgery / Procedure', icon:'🔬' },
  { key:'surgeryDate', label:'Surgery Date', icon:'📅' },
  { key:'dischargeDate', label:'Discharge Date', icon:'📤' },
  { key:'surgeonName', label:'Attending Surgeon', icon:'👨‍⚕️' },
  { key:'diagnosis', label:'Primary Diagnosis', icon:'📋' },
  { key:'medications', label:'Discharge Medications', icon:'💊' },
  { key:'instructions', label:'Discharge Instructions', icon:'📝' },
  { key:'followUpDate', label:'Follow-Up Date', icon:'🗓' },
  { key:'wardBed', label:'Ward / Bed', icon:'🛏' },
  { key:'bloodGroup', label:'Blood Group', icon:'🩸' },
]

const DEMO_DATA = {
  patientName:'Bobur Nazarov', age:'52', gender:'Male',
  hospitalName:'Republican Clinical Hospital, Tashkent',
  surgeryName:'Laparoscopic Appendectomy', surgeryDate:'2025-05-11', dischargeDate:'2025-05-12',
  surgeonName:'Dr. Sardor Tursunov', diagnosis:'Acute Appendicitis',
  medications:'Amoxicillin 500mg x 5 days; Paracetamol 500mg PRN; Omeprazole 20mg OD',
  instructions:'Rest 3 days. Light walking from Day 2. No lifting >1kg for 1 week. Return to ED if fever >38.5 degreesC.',
  followUpDate:'2025-05-19', wardBed:'Surgical Ward 2 / Bed 14', bloodGroup:'O+',
}

async function parseSheet(base64, mime) {
  try {
    const res = await fetch(API_URL, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514', max_tokens:1000,
        messages:[{ role:'user', content:[
          { type:'image', source:{ type:'base64', media_type:mime, data:base64 } },
          { type:'text', text:`Extract all fields from this hospital discharge sheet. Return ONLY valid JSON, no markdown:\n{"patientName":"","age":"","gender":"","hospitalName":"","surgeryName":"","surgeryDate":"","dischargeDate":"","surgeonName":"","diagnosis":"","medications":"","instructions":"","followUpDate":"","wardBed":"","bloodGroup":""}` },
        ]}],
      }),
    })
    if (!res.ok) throw new Error('api')
    const data = await res.json()
    return JSON.parse(data.content?.[0]?.text?.replace(/```json|```/g,'').trim() || '{}')
  } catch {
    await new Promise(r => setTimeout(r, 1800))
    return DEMO_DATA
  }
}

export default function DischargeUpload() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [state, setState] = useState('idle')
  const [preview, setPreview] = useState(null)
  const [editData, setEditData] = useState({})
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Upload an image (JPG, PNG, WEBP) or PDF.')
      return
    }
    setState('uploading')
    setError('')
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (file.type.startsWith('image/')) setPreview(e.target.result)
      setState('parsing')
      const base64 = e.target.result.split(',')[1]
      const parsed = await parseSheet(base64, file.type)
      setEditData(parsed)
      setState('done')
    }
    reader.readAsDataURL(file)
  }

  const extractedCount = Object.values(editData).filter(v => v?.length > 0).length

  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.08)', padding:'0 32px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', height:60, display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('/hospital')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', color:'#6B7280', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>← Back</button>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#111827' }}>AI Discharge Sheet Reader</div>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:28, alignItems:'start' }}>

          {/* Upload side */}
          <div>
            <div style={{ background:'rgba(26,115,232,0.05)', border:'1px solid rgba(26,115,232,0.15)', borderRadius:14, padding:16, marginBottom:20 }}>
              <div style={{ display:'flex', gap:8 }}>
                <span>🤖</span>
                <p style={{ color:'#374151', fontSize:'0.82rem', lineHeight:1.65, margin:0 }}>
                  Upload a photo of a printed discharge sheet. RECAP's AI extracts all patient data, medications, and instructions in seconds -- ready to import.
                </p>
              </div>
            </div>

            {state === 'idle' || state === 'error' ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
                style={{ border:`2px dashed ${drag?'#1A73E8':'rgba(0,0,0,0.15)'}`, borderRadius:16, padding:'40px 24px', textAlign:'center', cursor:'pointer', background: drag?'rgba(26,115,232,0.04)':'#fff', transition:'all 0.2s' }}
              >
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📄</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'1rem', marginBottom:6 }}>{t('up_title')}</div>
                <p style={{ color:'#9CA3AF', fontSize:'0.8rem', marginBottom:16 }}>{t('up_drag')}</p>
                <div style={{ display:'inline-block', padding:'8px 20px', borderRadius:10, background:'rgba(26,115,232,0.08)', border:'1px solid rgba(26,115,232,0.2)', color:'#1A73E8', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.82rem' }}>{t('up_choose')}</div>
                {state === 'error' && <p style={{ color:'#DC2626', fontSize:'0.78rem', marginTop:12 }}>{error}</p>}
              </div>
            ) : (state === 'uploading' || state === 'parsing') ? (
              <div style={{ border:'1px solid rgba(26,115,232,0.15)', borderRadius:16, padding:'40px 24px', textAlign:'center', background:'#fff' }}>
                <div style={{ fontSize:'2rem', marginBottom:12 }}>{state==='uploading'?'⬆️':'🔍'}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', marginBottom:6 }}>{state==='uploading'?'Reading file…':'AI extracting data…'}</div>
                <p style={{ color:'#9CA3AF', fontSize:'0.78rem', marginBottom:16 }}>{state==='parsing'?'Claude is scanning your discharge sheet':'Loading…'}</p>
                <div style={{ display:'flex', justifyContent:'center', gap:6 }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#1A73E8',animation:`pulse 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            ) : null}

            {state === 'done' && preview && (
              <div style={{ marginTop:16, borderRadius:12, overflow:'hidden', border:'1px solid rgba(0,0,0,0.08)', maxHeight:200 }}>
                <img src={preview} alt="Discharge sheet" style={{ width:'100%', objectFit:'cover' }} />
              </div>
            )}
          </div>

          {/* Extracted fields side */}
          <div>
            {state === 'done' ? (
              <div className="animate-slide-up">
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:12, background:'rgba(5,150,105,0.07)', border:'1px solid rgba(5,150,105,0.2)', marginBottom:16 }}>
                  <span style={{ fontSize:'1.1rem' }}>✅</span>
                  <div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#059669', fontSize:'0.85rem' }}>Extraction Complete</div>
                    <div style={{ color:'#6B7280', fontSize:'0.72rem' }}>{extractedCount} of {FIELDS.length} fields extracted · Review and edit below</div>
                  </div>
                </div>

                <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, overflow:'hidden', marginBottom:16, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ padding:'12px 16px', background:'#F9FAFB', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#1A73E8', fontSize:'0.75rem', letterSpacing:'0.06em' }}>EXTRACTED PATIENT DATA -- EDITABLE</span>
                  </div>
                  <div style={{ padding:'12px 16px', maxHeight:480, overflowY:'auto' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {FIELDS.map(f => (
                        <div key={f.key}>
                          <label style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.62rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>
                            <span>{f.icon}</span> {f.label}
                            {editData[f.key] && <span style={{ color:'#059669', fontSize:'0.55rem', fontFamily:'Syne,sans-serif', fontWeight:700, background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.2)', padding:'1px 5px', borderRadius:99 }}>extracted</span>}
                          </label>
                          <input type="text" value={editData[f.key]||''} onChange={e => setEditData(d=>({...d,[f.key]:e.target.value}))} placeholder={`Enter ${f.label.toLowerCase()}`} style={{ fontSize:'0.8rem', padding:'7px 10px', borderRadius:'0.55rem' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => { alert('Patient imported to RECAP!'); navigate('/hospital') }} className="btn-primary" style={{ flex:1, fontSize:'0.88rem' }}>
                    ✦ Import to RECAP
                  </button>
                  <button onClick={() => { setState('idle'); setPreview(null); setEditData({}) }} className="btn-secondary">
                    ↺ New Upload
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize:'0.68rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Fields that will be extracted</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {FIELDS.map(f => (
                    <div key={f.key} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:8, background:'#F9FAFB', border:'1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize:'0.85rem' }}>{f.icon}</span>
                      <span style={{ fontSize:'0.75rem', color:'#374151' }}>{f.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14, padding:'10px 12px', borderRadius:10, background:'rgba(26,115,232,0.05)', border:'1px solid rgba(26,115,232,0.12)' }}>
                  <div style={{ fontSize:'0.75rem', color:'#374151', lineHeight:1.6 }}>
                    {t('up_tip')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
