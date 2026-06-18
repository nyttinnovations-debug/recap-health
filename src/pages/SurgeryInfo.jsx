import { useState } from 'react'
import { patientData, getLocalizedPatientData } from '../data/mockData'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LanguageContext'

export default function SurgeryInfo() {
  const [tab, setTab] = useState(0)
  const { t } = useLang()
  const { lang } = useLang()
  const { surgery, recoveryGuide } = getLocalizedPatientData(lang)
  const tabs = [t('surg_tab1'), t('surg_tab2'), t('surg_tab3')]

  return (
    <div className="page">
      <PageHeader title={t('surg_title')} subtitle={surgery.simpleName} backTo="/dashboard" />
      <div style={{ maxWidth:560, margin:'0 auto', padding:'16px 16px 0' }}>

        <div className="card animate-fade-in" style={{ padding:'14px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:46,height:46,borderRadius:12,background:'rgba(26,115,232,0.08)',border:'1px solid rgba(26,115,232,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>🔬</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,color:'#111827',fontSize:'0.95rem' }}>{surgery.simpleName}</div>
            <div style={{ color:'#1A73E8',fontSize:'0.72rem',fontFamily:'Syne,sans-serif',fontWeight:600 }}>{surgery.type} · {surgery.duration}</div>
            <div style={{ color:'#9CA3AF',fontSize:'0.7rem' }}>{surgery.surgeon}</div>
          </div>
        </div>

        <div style={{ display:'flex',background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:12,padding:4,marginBottom:16,boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          {tabs.map((t2,i) => (
            <button key={t2} onClick={() => setTab(i)} style={{ flex:1,padding:'8px 4px',borderRadius:9,fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.72rem',border:'none',cursor:'pointer',transition:'all 0.15s',background:tab===i?'#1A73E8':'transparent',color:tab===i?'#fff':'#9CA3AF' }}>{t2}</button>
          ))}
        </div>

        {tab===0 && (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }} className="animate-slide-up">
            {[
              [t('surg_simple'),'💬',surgery.simpleExplanation],
              [t('surg_how'),'🏥',surgery.howItWasDone],
              [t('surg_why'),'⭐',surgery.whyLaparoscopic],
            ].map(([title,icon,text]) => (
              <div key={title} className="card" style={{ padding:18 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                  <span style={{ fontSize:'1rem' }}>{icon}</span>
                  <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.88rem' }}>{title}</span>
                </div>
                <p style={{ color:'#374151',fontSize:'0.85rem',lineHeight:1.75,margin:0 }}>{text}</p>
              </div>
            ))}
            <div className="card" style={{ padding:18 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}><span>✅</span><span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.88rem' }}>{t('surg_facts')}</span></div>
              {surgery.keyFacts.map((f,i) => (
                <div key={i} style={{ display:'flex',gap:8,marginBottom:8 }}>
                  <div style={{ width:18,height:18,borderRadius:'50%',background:'rgba(5,150,105,0.1)',border:'1px solid rgba(5,150,105,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}><span style={{ color:'#059669',fontSize:'0.6rem' }}>✓</span></div>
                  <span style={{ color:'#374151',fontSize:'0.83rem',lineHeight:1.55 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab===1 && (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }} className="animate-slide-up">
            <Card title={t('surg_walk')} icon="🚶">
              {recoveryGuide.walking.map((w,i) => (
                <div key={i} style={{ display:'flex',gap:10,paddingBottom:10,borderBottom:i<recoveryGuide.walking.length-1?'1px solid rgba(0,0,0,0.06)':'none',marginBottom:i<recoveryGuide.walking.length-1?10:0 }}>
                  <span style={{ fontSize:'1.1rem' }}>{w.icon}</span>
                  <div><div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#1A73E8',fontSize:'0.72rem' }}>{w.period}</div><div style={{ color:'#374151',fontSize:'0.82rem',marginTop:2 }}>{w.instruction}</div></div>
                </div>
              ))}
            </Card>
            <Card title={t('surg_diet')} icon="🍽️">
              {recoveryGuide.diet.map((d,i) => (
                <div key={i} style={{ display:'flex',gap:10,paddingBottom:10,borderBottom:i<recoveryGuide.diet.length-1?'1px solid rgba(0,0,0,0.06)':'none',marginBottom:i<recoveryGuide.diet.length-1?10:0 }}>
                  <span style={{ fontSize:'1.1rem',flexShrink:0 }}>{d.icon}</span>
                  <div><div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#B45309',fontSize:'0.7rem' }}>{d.day}</div><div style={{ color:'#374151',fontSize:'0.82rem',marginTop:2 }}>{d.food}</div></div>
                </div>
              ))}
            </Card>
            {[[t('surg_sleep'),'😴',recoveryGuide.sleep],[t('surg_bath'),'🚿',recoveryGuide.bathing],[t('surg_drive'),'🚗',recoveryGuide.driving]].map(([title,icon,text]) => (
              <Card key={title} title={title} icon={icon}><p style={{ color:'#374151',fontSize:'0.85rem',lineHeight:1.7,margin:0 }}>{text}</p></Card>
            ))}
            <Card title={t('surg_work')} icon="💼">
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                {[[t('surg_desk'),recoveryGuide.returnToWork.desk,'rgba(5,150,105,0.08)','rgba(5,150,105,0.2)','#059669'],[t('surg_physical'),recoveryGuide.returnToWork.physical,'rgba(180,83,9,0.08)','rgba(180,83,9,0.2)','#B45309']].map(([label,val,bg,border,color]) => (
                  <div key={label} style={{ padding:'12px',borderRadius:10,background:bg,border:`1px solid ${border}` }}>
                    <div style={{ color,fontSize:'0.62rem',fontFamily:'Syne,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em' }}>{label}</div>
                    <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1rem',color:'#111827',marginTop:4 }}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab===2 && (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }} className="animate-slide-up">
            <div style={{ padding:18,borderRadius:16,background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}><span style={{ fontSize:'1.1rem' }}>🚨</span><span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#DC2626',fontSize:'0.88rem' }}>{t('surg_warn')}</span></div>
              {recoveryGuide.warningSigns.map((s,i) => (
                <div key={i} style={{ display:'flex',gap:8,padding:'10px 12px',borderRadius:10,background:'rgba(220,38,38,0.06)',marginBottom:6 }}>
                  <span style={{ color:'#DC2626',fontSize:'0.9rem',flexShrink:0 }}>⚠</span>
                  <span style={{ color:'#111827',fontSize:'0.84rem',lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:18 }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.85rem',marginBottom:10 }}>{t('surg_emergency')}</div>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:40,height:40,borderRadius:10,background:'rgba(26,115,232,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem' }}>📞</div>
                <div><div style={{ color:'#374151',fontSize:'0.85rem',fontWeight:500 }}>{ t('surg_hospital_name')}</div><div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#1A73E8',fontSize:'0.9rem' }}>{ t('surg_emergency_call')}</div></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function Card({ title, icon, children }) {
  return (
    <div className="card" style={{ padding:18 }}>
      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
        <span style={{ fontSize:'1rem' }}>{icon}</span>
        <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.88rem' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}
