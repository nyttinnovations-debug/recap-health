import { useLocation, useNavigate } from 'react-router-dom'
import { patientData } from '../data/mockData'
import { useLang } from '../context/LanguageContext'
import { getCachedPatient, recoveryDay } from '../lib/patientSession'

function getStatus(s) { return s<=4?'stable':s<=9?'attention':'urgent' }

const CFG = {
  stable: {
    emoji:'✅', titleKey:'res_stable_title', subKey:'res_stable_sub',
    msgKey:'res_stable_msg', tipsKey:'res_stable_tips',
    color:'#059669', bg:'rgba(5,150,105,0.07)', border:'rgba(5,150,105,0.2)',
    shadow:'rgba(5,150,105,0.12)',
    // primary button goes to dashboard
    primaryKey:'res_back', primaryPath:'/dashboard', emergency:false,
    // no secondary button for stable - avoid duplicate
    showSecondary: false,
  },
  attention: {
    emoji:'⚠️', titleKey:'res_attention_title', subKey:'res_attention_sub',
    msgKey:'res_attention_msg', tipsKey:'res_attention_tips',
    color:'#B45309', bg:'rgba(180,83,9,0.07)', border:'rgba(180,83,9,0.2)',
    shadow:'rgba(180,83,9,0.1)',
    // primary goes to ask recap for guidance
    primaryKey:'ask_title', primaryPath:'/ask', emergency:false,
    // secondary goes back to dashboard
    showSecondary: true,
  },
  urgent: {
    emoji:'🚨', titleKey:'res_urgent_title', subKey:'res_urgent_sub',
    msgKey:'res_urgent_msg', tipsKey:'res_urgent_tips',
    color:'#DC2626', bg:'rgba(220,38,38,0.07)', border:'rgba(220,38,38,0.22)',
    shadow:'rgba(220,38,38,0.15)',
    // primary is emergency call
    primaryKey:'res_call', primaryPath:null, emergency:true,
    // secondary goes back to dashboard
    showSecondary: true,
  },
}

export default function CheckInResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const { score = 0 } = location.state || {}
  const status = getStatus(score)
  const cfg = CFG[status]
  const pilot = getCachedPatient()
  const homePath = pilot ? ('/?patient=' + pilot.patient_code) : '/dashboard'
  const day = pilot ? recoveryDay(pilot.discharge_date) : patientData.dayOfRecovery
  const hospitalName = pilot ? (pilot.ward || 'BSMI Pilot') : (patientData.hospital?.en || patientData.hospital)

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,'+cfg.bg.replace('0.07','0.12')+' 0%,#F5F8FF 50%,#fff 100%)' }}>
      <div style={{ maxWidth:440, margin:'0 auto', padding:'0 20px', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* Top bar */}
        <div style={{ paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:99, background:'#fff', border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize:'0.72rem', color:'#6B7280', fontFamily:'Syne,sans-serif', fontWeight:600 }}>Day {day} {t('ci_day_complete')}</span>
          </div>
          <span style={{ fontSize:'0.78rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF' }}>{t('res_score')}: {score}/16</span>
        </div>

        {/* Status icon + title */}
        <div style={{ textAlign:'center', paddingTop:36, paddingBottom:24 }}>
          <div style={{ width:110, height:110, borderRadius:28, margin:'0 auto 20px', background:cfg.bg, border:'2px solid '+cfg.border, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem', boxShadow:'0 8px 30px '+cfg.shadow }}>
            {cfg.emoji}
          </div>
          <div style={{ display:'inline-block', padding:'4px 12px', borderRadius:99, background:cfg.bg, border:'1px solid '+cfg.border, marginBottom:10 }}>
            <span style={{ color:cfg.color, fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{t(cfg.subKey)}</span>
          </div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'2.1rem', color:cfg.color, letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:16 }}>
            {t(cfg.titleKey)}
          </h1>
          {/* Score bar */}
          <div style={{ maxWidth:280, margin:'0 auto' }}>
            <div style={{ height:10, borderRadius:5, background:'#E5E7EB', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:5, width:((score/16)*100)+'%', background:status==='stable'?'#059669':status==='attention'?'#D97706':'#DC2626', transition:'width 1s ease', boxShadow:'0 0 8px '+cfg.color+'50' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
              <span style={{ fontSize:'0.62rem', color:'#9CA3AF' }}>{t('ci_range_stable')}</span>
              <span style={{ fontSize:'0.62rem', color:'#9CA3AF' }}>{t('ci_range_urgent')}</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={{ background:'#fff', border:'1px solid '+cfg.border, borderRadius:16, padding:18, marginBottom:14, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <p style={{ color:'#374151', fontSize:'0.87rem', lineHeight:1.7, margin:0 }}>{t(cfg.msgKey)}</p>
        </div>

        {/* Action tips */}
        <div style={{ padding:18, borderRadius:16, background:cfg.bg, border:'1px solid '+cfg.border, marginBottom:14 }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:cfg.color, fontSize:'0.75rem', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>{t('res_what_now')}</div>
          {t(cfg.tipsKey).map((tip,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <span style={{ color:cfg.color, fontSize:'0.8rem', flexShrink:0 }}>{status==='urgent'?'🚨':'→'}</span>
              <span style={{ color:'#374151', fontSize:'0.83rem', lineHeight:1.55 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Care team notified */}
        {status !== 'stable' && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background:'rgba(26,115,232,0.07)', border:'1px solid rgba(26,115,232,0.18)', marginBottom:14 }}>
            <span style={{ fontSize:'1rem' }}>🏥</span>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#1A73E8', fontSize:'0.78rem' }}>{t('res_notified')}</div>
              <div style={{ color:'#6B7280', fontSize:'0.7rem' }}>{hospitalName} {t('res_notified_sub')}</div>
            </div>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#1A73E8', marginLeft:'auto', animation:'pulse 2s infinite' }} />
          </div>
        )}

        {/* Buttons - no duplicates */}
        <div style={{ paddingBottom:40, marginTop:'auto' }}>
          {cfg.emergency ? (
            // Urgent: emergency call button
            <a href="tel:103" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'14px', borderRadius:14, background:'#DC2626', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1rem', textDecoration:'none', boxShadow:'0 4px 16px rgba(220,38,38,0.35)', marginBottom:10 }}>
              📞 {t('res_call')}
            </a>
          ) : (
            // Stable / Attention: primary action button
            <button onClick={() => navigate(pilot ? homePath : cfg.primaryPath)} className="btn-primary" style={{ width:'100%', marginBottom: cfg.showSecondary ? 10 : 0 }}>
              {t(cfg.primaryKey)} →
            </button>
          )}

          {/* Secondary "Back to Dashboard" only when primary does something else */}
          {cfg.showSecondary && (
            <button onClick={() => navigate(homePath)} className="btn-secondary" style={{ width:'100%' }}>
              {t('res_back')}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
