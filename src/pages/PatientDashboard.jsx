import { useNavigate } from 'react-router-dom'
import { patientData, getLocalizedPatientData } from '../data/mockData'
import { useLang } from '../context/LanguageContext'
import BottomNav from '../components/BottomNav'
import RecapLogo from '../components/RecapLogo'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const p = getLocalizedPatientData(lang)
  const day = p.dayOfRecovery
  const pct = Math.round((day / 30) * 100)

  const features = [
    { key:'s1', path:'/surgery',  emoji:'🔬', color:'#1A73E8', bg:'rgba(26,115,232,0.08)', border:'rgba(26,115,232,0.18)' },
    { key:'s2', path:'/medicines',emoji:'💊', color:'#6D28D9', bg:'rgba(109,40,217,0.08)', border:'rgba(109,40,217,0.18)' },
    { key:'s3', path:'/checkin',  emoji:'📋', color:'#059669', bg:'rgba(5,150,105,0.08)',  border:'rgba(5,150,105,0.18)', badge:t('dash_today') },
    { key:'s4', path:'/analytics',emoji:'📊', color:'#B45309', bg:'rgba(180,83,9,0.08)',   border:'rgba(180,83,9,0.18)' },
    { key:'s5', path:'/followup', emoji:'📅', color:'#DC2626', bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.18)', badge:'3 '+t('dash_upcoming') },
    { key:'s6', path:'/ask',      emoji:'🤖', color:'#0891B2', bg:'rgba(8,145,178,0.08)',  border:'rgba(8,145,178,0.18)' },
  ]

  return (
    <div className="page">
      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 16px' }}>

        <div style={{ paddingTop:24, paddingBottom:4 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <RecapLogo size={28} showText={false} />
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:'0.72rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{t('dash_welcome')}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.55rem', color:'#111827', letterSpacing:'-0.025em' }}>{p.name.split(' ')[0]} 👋</div>
              </div>
            </div>
            <div style={{ textAlign:'center', padding:'10px 16px', borderRadius:14, background:'linear-gradient(135deg,rgba(26,115,232,0.1),rgba(109,40,217,0.08))', border:'1px solid rgba(26,115,232,0.15)' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.5rem', color:'#1A73E8', lineHeight:1 }}>Day {day}</div>
              <div style={{ fontSize:'0.6rem', color:'#6B7280' }}>{t('dash_day_of')}</div>
            </div>
          </div>

          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:14, padding:16, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:'0.75rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#374151' }}>{t('dash_progress')}</span>
              <span style={{ fontSize:'0.78rem', fontFamily:'Syne,sans-serif', fontWeight:800, color:'#1A73E8' }}>{pct}%</span>
            </div>
            <div style={{ height:8, borderRadius:4, background:'#F3F4F6', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:4, width:pct+'%', background:'linear-gradient(90deg,#1A73E8,#6D28D9)', transition:'width 0.8s ease' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <span style={{ fontSize:'0.62rem', color:'#9CA3AF' }}>{t('dash_day1')}</span>
              <span style={{ fontSize:'0.62rem', color:'#9CA3AF' }}>{t('dash_day30')}</span>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, background:'#fff', border:'1px solid rgba(0,0,0,0.08)', marginBottom:14, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize:'0.85rem' }}>⚕</span>
            <span style={{ fontSize:'0.75rem', color:'#6B7280' }}>
              <span style={{ fontWeight:600, color:'#111827' }}>{p.surgery.simpleName}</span> · {p.hospital}
            </span>
          </div>
        </div>

        {day >= 2 && (
          <button onClick={()=>navigate('/checkin')} style={{ width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:16, marginBottom:14, cursor:'pointer', background:'linear-gradient(135deg,rgba(5,150,105,0.08),rgba(5,150,105,0.04))', border:'1px solid rgba(5,150,105,0.22)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#059669' }} />
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#059669', fontSize:'0.85rem' }}>{t('dash_checkin_ready')}</div>
                <div style={{ color:'#6B7280', fontSize:'0.7rem' }}>{t('dash_checkin_sub')} {day}</div>
              </div>
            </div>
            <div style={{ padding:'6px 14px', borderRadius:10, background:'#059669', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem' }}>
              {t('dash_checkin_start')} →
            </div>
          </button>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {features.map(f => (
            <button key={f.key} onClick={()=>navigate(f.path)}
              style={{ textAlign:'left', padding:16, borderRadius:16, border:'1px solid '+f.border, background:f.bg, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'#fff', border:'1px solid '+f.border, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>{f.emoji}</div>
                {f.badge && <span style={{ fontSize:'0.58rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:f.color, background:'#fff', border:'1px solid '+f.border, padding:'2px 7px', borderRadius:99 }}>{f.badge}</span>}
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.88rem', lineHeight:1.2, marginBottom:3 }}>{t('dash_'+f.key+'_title')}</div>
              <div style={{ fontSize:'0.68rem', color:'#6B7280', lineHeight:1.4 }}>{t('dash_'+f.key+'_sub')}</div>
              <div style={{ marginTop:10, textAlign:'right', color:f.color, fontSize:'0.8rem' }}>→</div>
            </button>
          ))}
        </div>

        {/* Rehab card - full width */}
        <button onClick={()=>navigate('/rehab')} style={{ width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:16, marginTop:10, marginBottom:20, cursor:'pointer', background:'rgba(5,150,105,0.07)', border:'1px solid rgba(5,150,105,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(5,150,105,0.15)';e.currentTarget.style.transform='translateY(-1px)'}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'#fff', border:'1px solid rgba(5,150,105,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>💪</div>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.9rem' }}>{t('dash_s7_title')}</div>
              <div style={{ fontSize:'0.7rem', color:'#6B7280' }}>{t('dash_s7_sub')}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:'0.6rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#059669', background:'rgba(5,150,105,0.1)', border:'1px solid rgba(5,150,105,0.2)', padding:'2px 7px', borderRadius:99 }}>NEW</span>
            <span style={{ color:'#059669', fontSize:'0.85rem' }}>→</span>
          </div>
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
