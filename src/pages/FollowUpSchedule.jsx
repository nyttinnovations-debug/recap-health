import { patientData, getLocalizedPatientData } from '../data/mockData'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LanguageContext'

const typeColor = { 'Wound Check':'#059669','Post-Op Review':'#1A73E8','Final Clearance':'#6D28D9' }
const typeIcon  = { 'Wound Check':'🩹','Post-Op Review':'📋','Final Clearance':'🎯' }

function daysUntil(dateStr, t) {
  const today = new Date('2025-05-12')
  const target = new Date(dateStr)
  const diff = Math.ceil((target - today) / 86400000)
  if (diff < 0) return t('fu_completed')
  if (diff === 0) return t('fu_today')
  if (diff === 1) return t('fu_tomorrow')
  return `${t('fu_in')} ${diff} ${t('fu_days')}`
}

export default function FollowUpSchedule() {
  const { t, lang } = useLang()
  const { followUps, surgeon, hospital, dayOfRecovery } = getLocalizedPatientData(lang)

  return (
    <div className="page">
      <PageHeader title={t('fu_title')} subtitle={`${followUps.length} appointments scheduled`} backTo="/dashboard" />
      <div style={{ maxWidth:560,margin:'0 auto',padding:'16px 16px 0' }}>

        <div className="card animate-fade-in" style={{ padding:16,marginBottom:14,display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:12,background:'rgba(26,115,232,0.08)',border:'1px solid rgba(26,115,232,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>👨‍⚕️</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.9rem' }}>{surgeon}</div>
            <div style={{ color:'#6B7280',fontSize:'0.73rem' }}>{hospital}</div>
            <div style={{ color:'#1A73E8',fontSize:'0.7rem',fontFamily:'Syne,sans-serif',fontWeight:600,marginTop:2 }}>{t('fu_surgeon')}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card animate-slide-up" style={{ padding:'18px 20px',marginBottom:14 }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.88rem',marginBottom:14 }}>{t('fu_timeline')}</div>
          <div style={{ position:'relative',paddingLeft:28 }}>
            <div style={{ position:'absolute',left:10,top:0,bottom:0,width:2,background:'rgba(0,0,0,0.07)',borderRadius:1 }} />
            {[{day:1,label:'Discharge',icon:'🏥'}, ...followUps.map(f=>({day:f.dayNumber,label:f.type,icon:typeIcon[f.type]||'📅'})), {day:30,label:'Full Recovery',icon:'🎉'}].map((m,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                <div style={{ width:26,height:26,borderRadius:'50%',background:m.day<=dayOfRecovery?'#E5E7EB':'#fff',border:`2px solid ${m.day<=dayOfRecovery?'#9CA3AF':'#1A73E8'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:-13,fontSize:'0.8rem' }}>{m.icon}</div>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flex:1 }}>
                  <span style={{ fontSize:'0.8rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:m.day<=dayOfRecovery?'#9CA3AF':'#111827' }}>{m.label}</span>
                  <span style={{ fontSize:'0.62rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'#1A73E8',background:'rgba(26,115,232,0.08)',border:'1px solid rgba(26,115,232,0.15)',padding:'2px 8px',borderRadius:99 }}>Day {m.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:'0.68rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10 }}>{t('fu_upcoming')}</div>

        <div style={{ display:'flex',flexDirection:'column',gap:12,marginBottom:16 }}>
          {followUps.map((appt,i)=>{
            const color = typeColor[appt.type]||'#1A73E8'
            const until = daysUntil(appt.date,t)
            const isPast = until===t('fu_completed')
            return (
              <div key={appt.id} className="card animate-slide-up" style={{ padding:18,opacity:isPast?0.6:1,borderColor:isPast?'rgba(0,0,0,0.05)':`${color}30`,animationDelay:`${i*0.08}s` }}>
                <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${color}10`,border:`1px solid ${color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem' }}>{typeIcon[appt.type]||'📅'}</div>
                    <div>
                      <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color,fontSize:'0.85rem' }}>{appt.type}</div>
                      <div style={{ color:'#9CA3AF',fontSize:'0.7rem' }}>Day {appt.dayNumber}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:'0.65rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:isPast?'#9CA3AF':color,background:isPast?'#F3F4F6':`${color}12`,border:`1px solid ${isPast?'rgba(0,0,0,0.08)':color+'30'}`,padding:'3px 8px',borderRadius:99,whiteSpace:'nowrap' }}>{until}</span>
                </div>
                {[['📅','Date',new Date(appt.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],['📍','Location',appt.location],['👨‍⚕️','Doctor',appt.doctor]].map(([icon,label,val])=>(
                  <div key={label} style={{ display:'flex',gap:8,marginBottom:6 }}>
                    <span style={{ fontSize:'0.8rem',flexShrink:0 }}>{icon}</span>
                    <span style={{ color:'#9CA3AF',fontSize:'0.73rem' }}>{label}: </span>
                    <span style={{ color:'#374151',fontSize:'0.73rem' }}>{val}</span>
                  </div>
                ))}
                <div style={{ marginTop:10,padding:'8px 12px',borderRadius:8,background:'#F9FAFB',border:'1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ color:'#6B7280',fontSize:'0.75rem',lineHeight:1.5 }}>💬 {appt.notes}</span>
                </div>
                {!isPast && <div style={{ marginTop:8,display:'flex',alignItems:'center',gap:6 }}><span style={{ fontSize:'0.75rem' }}>✈️</span><span style={{ color:'#9CA3AF',fontSize:'0.7rem' }}>{t('fu_telegram')}</span></div>}
              </div>
            )
          })}
        </div>

        <div className="card" style={{ padding:16,marginBottom:16,borderColor:'rgba(109,40,217,0.15)' }}>
          <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#6D28D9',fontSize:'0.82rem',marginBottom:10 }}>{t('fu_prep')}</div>
          {t('fu_preps').map((tip,i)=>(
            <div key={i} style={{ display:'flex',gap:8,marginBottom:7 }}>
              <span style={{ color:'#6D28D9',fontSize:'0.78rem',flexShrink:0 }}>→</span>
              <span style={{ color:'#6B7280',fontSize:'0.78rem',lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
