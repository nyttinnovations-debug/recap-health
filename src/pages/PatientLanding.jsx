import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocalizedPatientData } from '../data/mockData'
import { useLang, LangPicker } from '../context/LanguageContext'
import RecapLogo from '../components/RecapLogo'
import { resolvePatient, recoveryDay, pilotComplete, clearPilotSession, PILOT_DAYS } from '../lib/patientSession'

export default function PatientLanding() {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const demo = getLocalizedPatientData(lang)

  const [loading, setLoading] = useState(true)
  const [pilot, setPilot] = useState(null)

  useEffect(() => {
    let active = true
    const code = new URLSearchParams(window.location.search).get('patient')
    if (!code) {
      // Demo intent: clear any stale pilot session so Amir is always clean
      clearPilotSession()
      setLoading(false)
      return
    }
    resolvePatient().then(p => {
      if (!active) return
      setPilot(p)
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  if (loading) {
    return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily:'Sora,sans-serif', color:'#6B7280' }}>Loading…</div>
  }

  const pilotOn = !!new URLSearchParams(window.location.search).get('patient')
  if (pilotOn && !pilot) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#F0F4F8', fontFamily:'Sora,sans-serif', padding:24, textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🔍</div>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#111827', marginBottom:8 }}>Patient not found</h2>
        <p style={{ color:'#6B7280', fontSize:'0.9rem', maxWidth:320 }}>This QR code isn’t linked to a registered patient. Please contact your care team.</p>
      </div>
    )
  }

  const view = pilot ? {
    id: pilot.patient_code, name: pilot.name, age: pilot.age,
    hospital: pilot.ward || 'BSMI Pilot', dischargeDate: pilot.discharge_date,
    operationName: pilot.surgery_type, surgeon: pilot.surgeon || '—',
    surgeryType: pilot.surgery_type, gender: '—', bloodGroup: '—',
  } : {
    id: demo.id, name: demo.name, age: demo.age, hospital: demo.hospital,
    dischargeDate: demo.dischargeDate, operationName: demo.surgery.simpleName,
    surgeon: demo.surgeon, surgeryType: demo.surgery.type,
    gender: demo.gender, bloodGroup: demo.bloodGroup,
  }

  const day = pilot ? recoveryDay(pilot.discharge_date) : demo.dayOfRecovery
  const done = pilot ? pilotComplete(pilot.discharge_date) : false

  const handleContinue = () => {
    if (!pilot) {
      localStorage.setItem('recap_patient', JSON.stringify({ ...demo }))
      localStorage.setItem('recap_checkins', JSON.stringify([]))
      navigate('/dashboard')   // demo: full experience
      return
    }
    navigate('/checkin')       // pilot: check-in only
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#EBF3FF 0%,#F0F4F8 50%,#F5F0FF 100%)' }}>
      <div style={{ position:'fixed', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(26,115,232,0.06)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:-60, left:-60, width:250, height:250, borderRadius:'50%', background:'rgba(109,40,217,0.05)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:440, margin:'0 auto', padding:'0 20px', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:24, paddingBottom:8 }}>
          <RecapLogo size={40} showText={true} />
          <LangPicker />
        </div>

        <div style={{ flex:1, paddingTop:24, paddingBottom:120 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:99, background:'rgba(5,150,105,0.1)', border:'1px solid rgba(5,150,105,0.2)', marginBottom:16 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#059669' }} />
            <span style={{ color:'#059669', fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.1em' }}>
              {pilot ? ('DAY ' + day + ' OF ' + PILOT_DAYS) : t('land_badge')}
            </span>
          </div>

          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'2rem', lineHeight:1.15, color:'#111827', letterSpacing:'-0.03em', marginBottom:10 }}>
            {pilot ? ('Welcome, ' + view.name.split(' ')[0]) : (t('land_title').replace(t('land_title_highlight'),''))}
            {!pilot && <span style={{ background:'linear-gradient(135deg,#1A73E8,#6D28D9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{t('land_title_highlight')}</span>}
          </h1>
          <p style={{ color:'#6B7280', fontSize:'0.875rem', lineHeight:1.65, marginBottom:24 }}>
            {pilot ? (done ? 'You have completed your 14-day recovery monitoring. Thank you!' : 'Tap below to complete your daily recovery check-in. It takes about a minute.') : t('land_subtitle')}
          </p>

          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:20, boxShadow:'0 4px 12px rgba(0,0,0,0.06)', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,rgba(26,115,232,0.1),rgba(109,40,217,0.1))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>👤</div>
              <div>
                <div style={{ fontSize:'0.62rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase' }}>{t('land_pid')} · {view.id}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#111827', marginTop:1 }}>{view.name}</div>
                <div style={{ color:'#6B7280', fontSize:'0.78rem' }}>{view.age} {t('land_age').toLowerCase()}{!pilot && (' · ' + view.gender + ' · ' + view.bloodGroup)}</div>
              </div>
            </div>
            <div style={{ borderTop:'1px solid rgba(0,0,0,0.07)', paddingTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[[t('land_hospital'),view.hospital],[t('land_surgery_date'),view.dischargeDate],[t('land_operation'),view.operationName],[t('land_surgeon'),view.surgeon]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontSize:'0.6rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                  <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#111827', marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:8, background:'rgba(26,115,232,0.07)', border:'1px solid rgba(26,115,232,0.15)' }}>
              <span style={{ fontSize:'0.8rem' }}>🔬</span>
              <span style={{ color:'#1A73E8', fontSize:'0.72rem', fontFamily:'Syne,sans-serif', fontWeight:700 }}>{view.surgeryType}</span>
            </div>
          </div>

          {!pilot && (
            <div style={{ background:'rgba(26,115,232,0.04)', border:'1px solid rgba(26,115,232,0.12)', borderRadius:16, padding:16 }}>
              <div style={{ fontSize:'0.68rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#1A73E8', letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:12 }}>{t('land_next_title')}</div>
              {['land_f1','land_f2','land_f3','land_f4','land_f5','land_f6'].map((k,i)=>(
                <div key={k} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:'rgba(26,115,232,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', flexShrink:0 }}>
                    {['📋','💊','📊','🤖','📅','🏥'][i]}
                  </div>
                  <span style={{ color:'#374151', fontSize:'0.8rem', lineHeight:1.5 }}>{t(k)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 28px', background:'rgba(240,244,248,0.97)', backdropFilter:'blur(16px)', borderTop:'1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ maxWidth:440, margin:'0 auto' }}>
            {!(pilot && done) ? (
              <button onClick={handleContinue} className="btn-primary" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {pilot ? 'Start Daily Check-In' : t('land_btn1')} <span>→</span>
              </button>
            ) : (
              <div style={{ textAlign:'center', padding:'13px', borderRadius:12, background:'rgba(5,150,105,0.1)', border:'1px solid rgba(5,150,105,0.25)', color:'#059669', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.9rem' }}>
                ✓ Monitoring Complete
              </div>
            )}
            <p style={{ color:'#9CA3AF', fontSize:'0.68rem', textAlign:'center', marginTop:8, marginBottom:0 }}>{t('land_monitored')} {view.hospital}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
