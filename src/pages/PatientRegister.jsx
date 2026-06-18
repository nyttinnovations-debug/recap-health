import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SURGERIES = ['Laparoscopic Cholecystectomy', 'Appendectomy', 'Hernia Repair', 'Bowel Resection', 'Other']

function genCode() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return 'PT-2026-' + n
}

export default function PatientRegister() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [surgery, setSurgery] = useState(SURGERIES[0])
  const [discharge, setDischarge] = useState(new Date().toISOString().slice(0, 10))
  const [ward, setWard] = useState('')
  const [surgeon, setSurgeon] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [patients, setPatients] = useState([])

  const baseUrl = window.location.origin

  async function loadPatients() {
    const { data } = await supabase.from('patients').select('*').order('created_at', { ascending: false })
    if (data) setPatients(data)
  }
  useEffect(() => { loadPatients() }, [])

  async function handleSave() {
    setError('')
    if (!name.trim() || !age || !phone.trim()) {
      setError('Name, age, and phone are required.')
      return
    }
    setSaving(true)
    const code = genCode()
    const { data, error: err } = await supabase.from('patients').insert({
      patient_code: code, name: name.trim(), age: Number(age), phone: phone.trim(),
      surgery_type: surgery, discharge_date: discharge, ward: ward.trim() || null,
      surgeon: surgeon.trim() || null, status: 'stable',
    }).select().single()
    setSaving(false)
    if (err) { setError(err.message); return }
    setCreated(data)
    setName(''); setAge(''); setPhone(''); setWard(''); setSurgeon('')
    loadPatients()
  }

  const checkinUrl = created ? baseUrl + '/?patient=' + created.patient_code : ''
  const qrSrc = created ? 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=' + encodeURIComponent(checkinUrl) : ''

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FF', fontFamily: 'Sora, sans-serif' }}>
      <style>{`@media print { .no-print { display:none !important; } .print-area { position:fixed; inset:0; background:#fff; display:flex; align-items:center; justify-content:center; } }`}</style>

      <div className="no-print" style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => navigate('/hospital')} style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#6B7280', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>← Dashboard</button>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>Register Patient</div>
          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#6B7280' }}>{patients.length} enrolled</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

        <div className="no-print">
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: '1.3rem', color: '#111827', marginBottom: 18 }}>New Patient</h2>

          {['Full name', 'Age', 'Phone (+998...)'].map((label, i) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{label}</label>
              <input
                type={i === 1 ? 'number' : 'text'}
                value={i === 0 ? name : i === 1 ? age : phone}
                onChange={e => i === 0 ? setName(e.target.value) : i === 1 ? setAge(e.target.value) : setPhone(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Surgery type</label>
            <select value={surgery} onChange={e => setSurgery(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', boxSizing: 'border-box', background: '#fff' }}>
              {SURGERIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Discharge date</label>
            <input type="date" value={discharge} onChange={e => setDischarge(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Ward (optional)</label>
              <input type="text" value={ward} onChange={e => setWard(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Surgeon (optional)</label>
              <input type="text" value={surgeon} onChange={e => setSurgeon(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: 12 }}>{error}</p>}

          <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#1A73E8', color: '#fff', border: 'none', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Register & Generate QR'}
          </button>
        </div>

        <div>
          {created ? (
            <div className="print-area">
              <div style={{ background: '#fff', border: '2px solid rgba(0,0,0,0.1)', borderRadius: 20, padding: 28, textAlign: 'center', maxWidth: 340, margin: '0 auto' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#1A73E8', marginBottom: 4 }}>RECAP</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Recovery Monitoring</div>
                <img src={qrSrc} alt="QR" style={{ width: '100%', maxWidth: 240, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }} />
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#111827', marginTop: 16 }}>{created.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 2 }}>{created.patient_code}</div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 14 }}>{created.surgery_type}</div>
                <div style={{ background: '#F3F4F6', borderRadius: 10, padding: '10px 12px', fontSize: '0.72rem', color: '#374151', lineHeight: 1.5 }}>
                  Scan this code with your phone camera every day to report your recovery. No app needed.
                </div>
                <button className="no-print" onClick={() => window.print()} style={{ marginTop: 16, width: '100%', padding: '11px', borderRadius: 10, background: '#059669', color: '#fff', border: 'none', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>🖨 Print QR Card</button>
              </div>
            </div>
          ) : (
            <div className="no-print" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.12)', borderRadius: 16, color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center', padding: 30 }}>
              Register a patient to generate their unique QR code here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
