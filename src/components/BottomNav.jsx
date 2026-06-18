import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLang()
  const items = [
    { path:'/dashboard', emoji:'\u2302', label:t('nav_home') },
    { path:'/checkin',   emoji:'\u2736', label:t('nav_checkin') },
    { path:'/analytics', emoji:'\u25c8', label:t('nav_progress') },
    { path:'/ask',       emoji:'\u25c9', label:t('nav_ask') },
  ]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)', borderTop:'1px solid rgba(0,0,0,0.07)', boxShadow:'0 -4px 20px rgba(0,0,0,0.06)' }}>
      <div style={{ display:'flex', justifyContent:'space-around', padding:'10px 0 14px', maxWidth:480, margin:'0 auto' }}>
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'6px 18px', borderRadius:12, border:'none', cursor:'pointer', background:active ? 'rgba(26,115,232,0.08)' : 'transparent', transition:'all 0.15s' }}>
              <span style={{ fontSize:'1.25rem', color:active ? '#1A73E8' : '#9CA3AF' }}>{item.emoji}</span>
              <span style={{ fontSize:'0.62rem', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.04em', color:active ? '#1A73E8' : '#9CA3AF' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
