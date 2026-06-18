import { useState } from 'react'
import { patientData, getLocalizedPatientData } from '../data/mockData'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LanguageContext'

const sevColor = { mild:'#9CA3AF', moderate:'#D97706', 'stop-medication':'#DC2626' }

export default function MedicineInfo() {
  const { t, lang } = useLang()
  const { medicines } = getLocalizedPatientData(lang)
  const [taken, setTaken] = useState({})
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="page">
      <PageHeader title={t('med_title')} subtitle={`${medicines.length} medications prescribed`} backTo="/dashboard" />
      <div style={{ maxWidth:560, margin:'0 auto', padding:'16px 16px 0' }}>

        <div style={{ background:'rgba(109,40,217,0.06)',border:'1px solid rgba(109,40,217,0.15)',borderRadius:14,padding:14,marginBottom:14 }} className="animate-fade-in">
          <div style={{ fontSize:'0.68rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'#6D28D9',letterSpacing:'0.08em',marginBottom:10 }}>{t('med_schedule')}</div>
          <div style={{ display:'flex',gap:8,overflowX:'auto',paddingBottom:4 }}>
            {['07:30','08:00','16:00','00:00'].map(time => (
              <div key={time} style={{ flexShrink:0,background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:10,padding:'8px 12px',textAlign:'center',minWidth:72,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#6D28D9',fontSize:'0.82rem' }}>{time}</div>
                <div style={{ color:'#9CA3AF',fontSize:'0.58rem',marginTop:2 }}>{time==='07:30'?'Omeprazole':time==='08:00'?'Tramadol+Amox':'Tramadol+Amox'}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          {medicines.map((med,i) => {
            const isTaken = taken[med.id]
            const isExp = expanded === med.id
            return (
              <div key={med.id} className="animate-slide-up" style={{ background:'#fff',border:`1px solid ${isTaken?'rgba(5,150,105,0.2)':'rgba(0,0,0,0.08)'}`,borderRadius:16,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',animationDelay:`${i*0.08}s` }}>
                <div style={{ padding:18 }}>
                  <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12 }}>
                    <div style={{ display:'flex',alignItems:'flex-start',gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:`${med.color}15`,border:`1px solid ${med.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{med.icon}</div>
                      <div>
                        <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,color:'#111827',fontSize:'0.95rem' }}>{med.name}</div>
                        <div style={{ color:med.color,fontSize:'0.7rem',fontFamily:'Syne,sans-serif',fontWeight:600,marginTop:1 }}>{med.type}</div>
                        <div style={{ color:'#9CA3AF',fontSize:'0.65rem' }}>{med.genericName}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:'0.62rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:med.color,background:`${med.color}12`,border:`1px solid ${med.color}25`,padding:'3px 8px',borderRadius:99 }}>{med.daysRemaining}d left</span>
                  </div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12 }}>
                    {[['Dose',med.dosage],['Frequency',med.frequency.split(' ').slice(0,3).join(' ')],['With food?',med.withFood?'Yes ✅':'Before food']].map(([l,v])=>(
                      <div key={l} style={{ padding:'8px 10px',borderRadius:8,background:'#F9FAFB',border:'1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize:'0.58rem',color:'#9CA3AF',fontFamily:'Syne,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em' }}>{l}</div>
                        <div style={{ color:'#111827',fontSize:'0.75rem',fontWeight:600,marginTop:2 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <p style={{ color:'#374151',fontSize:'0.82rem',lineHeight:1.6,marginBottom:10 }}>{med.purpose}</p>

                  {med.important && (
                    <div style={{ display:'flex',gap:8,padding:'8px 12px',borderRadius:10,background:'rgba(180,83,9,0.07)',border:'1px solid rgba(180,83,9,0.18)',marginBottom:12 }}>
                      <span style={{ fontSize:'0.8rem',flexShrink:0 }}>⚡</span>
                      <span style={{ color:'#B45309',fontSize:'0.78rem',lineHeight:1.5 }}>{med.important}</span>
                    </div>
                  )}

                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                    <button onClick={() => setExpanded(isExp?null:med.id)} style={{ fontSize:'0.75rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'#6B7280',background:'none',border:'none',cursor:'pointer' }}>
                      {isExp?'▲':'▼'} {t('med_side')}
                    </button>
                    <button onClick={() => setTaken(t2=>({...t2,[med.id]:!t2[med.id]}))} style={{ padding:'6px 14px',borderRadius:10,fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.75rem',cursor:'pointer',transition:'all 0.2s',background:isTaken?'rgba(5,150,105,0.1)':'#F3F4F6',border:`1px solid ${isTaken?'rgba(5,150,105,0.3)':'rgba(0,0,0,0.1)'}`,color:isTaken?'#059669':'#6B7280' }}>
                      {isTaken ? t('med_taken') : t('med_mark')}
                    </button>
                  </div>
                </div>

                {isExp && (
                  <div style={{ padding:'0 18px 16px',borderTop:'1px solid rgba(0,0,0,0.07)' }} className="animate-slide-up">
                    <div style={{ fontSize:'0.68rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.08em',padding:'10px 0 8px' }}>{t('med_side')}</div>
                    {med.sideEffects.map((se,j) => (
                      <div key={j} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6 }}>
                        <span style={{ color:'#374151',fontSize:'0.82rem' }}>{se}</span>
                        <span style={{ fontSize:'0.62rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:sevColor[med.severity[j]],background:`${sevColor[med.severity[j]]}15`,padding:'2px 8px',borderRadius:99 }}>{med.severity[j]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="card" style={{ padding:16,marginTop:12,marginBottom:16,borderColor:'rgba(26,115,232,0.15)' }}>
          <div style={{ display:'flex',gap:10 }}>
            <span style={{ fontSize:'1rem',flexShrink:0 }}>💡</span>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#1A73E8',fontSize:'0.8rem',marginBottom:3 }}>{t('med_tip')}</div>
              <p style={{ color:'#6B7280',fontSize:'0.78rem',lineHeight:1.6,margin:0 }}>{t('med_tip_text')}</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
