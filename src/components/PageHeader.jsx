import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, backTo, rightEl }) {
  const navigate = useNavigate()
  return (
    <div style={{ position:'sticky', top:0, zIndex:40, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(0,0,0,0.07)', padding:'14px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, maxWidth:600, margin:'0 auto' }}>
        {backTo && (
          <button onClick={() => navigate(backTo)} style={{ width:36, height:36, borderRadius:10, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', cursor:'pointer', fontSize:'1rem', color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            {String.fromCharCode(8592)}
          </button>
        )}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize:'0.72rem', color:'#6B7280', marginTop:1 }}>{subtitle}</div>}
        </div>
        {rightEl}
      </div>
    </div>
  )
}
