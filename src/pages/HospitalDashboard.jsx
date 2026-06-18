import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hospitalPatients, getLocalizedHospitalPatients } from '../data/mockData'
import { useLang, LangPicker } from '../context/LanguageContext'

const SC = {
  stable:    { color:'#059669', bg:'rgba(5,150,105,0.08)',  border:'rgba(5,150,105,0.2)',  dot:'#059669' },
  attention: { color:'#B45309', bg:'rgba(180,83,9,0.08)',   border:'rgba(180,83,9,0.2)',   dot:'#D97706' },
  urgent:    { color:'#DC2626', bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.22)', dot:'#DC2626' },
}

export default function HospitalDashboard() {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = getLocalizedHospitalPatients(lang).filter(p => {
    const mf = filter === 'all' || p.status === filter
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.surgery.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    return mf && ms
  })

  const counts = {
    all: getLocalizedHospitalPatients(lang).length,
    stable: hospitalPatients.filter(p => p.status === 'stable').length,
    attention: hospitalPatients.filter(p => p.status === 'attention').length,
    urgent: hospitalPatients.filter(p => p.status === 'urgent').length,
  }

  return (
    <div className="page-desktop" style={{ background: '#F5F7FA' }}>

      {/* Top navbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.08)', padding:'0 32px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#1A73E8,#6D28D9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.9rem' }}>⊕</div>
            <div>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.1rem', color:'#111827', letterSpacing:'-0.02em' }}>RECAP</span>
              <span style={{ marginLeft:8, fontSize:'0.72rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:600 }}>{ t('hosp_dashboard_label')}</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <LangPicker />
            <button onClick={() => navigate('/upload')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', color:'#374151', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>
              📄 {t('hosp_upload')}
            </button>
            <button onClick={() => navigate('/global')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'#6D28D9', color:'#fff', border:'none', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.78rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(109,40,217,0.25)' }}>
              🌍 {t('hosp_global')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'28px 32px' }}>

        {/* Page title + stats */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.7rem', color:'#111827', letterSpacing:'-0.025em', margin:0 }}>{t('hosp_title')}</h1>
            <p style={{ color:'#6B7280', fontSize:'0.82rem', margin:'4px 0 0' }}>Republican Clinical Hospital · {t('hosp_sub')}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#059669', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:'0.75rem', color:'#059669', fontFamily:'Syne,sans-serif', fontWeight:700 }}>LIVE</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[
            { key:'all',       label:t('hosp_total'),  icon:'👥', color:'#1A73E8', bg:'rgba(26,115,232,0.07)',   border:'rgba(26,115,232,0.15)' },
            { key:'stable',    label:t('hosp_stable'), icon:'✅', color:'#059669', bg:'rgba(5,150,105,0.07)',    border:'rgba(5,150,105,0.15)' },
            { key:'attention', label:t('hosp_watch'),  icon:'⚠️', color:'#B45309', bg:'rgba(180,83,9,0.07)',    border:'rgba(180,83,9,0.15)' },
            { key:'urgent',    label:t('hosp_urgent'), icon:'🚨', color:'#DC2626', bg:'rgba(220,38,38,0.07)',   border:'rgba(220,38,38,0.15)' },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)} style={{
              padding:'18px 20px', borderRadius:14, cursor:'pointer', textAlign:'left', transition:'all 0.2s',
              background: filter===s.key ? s.bg : '#fff',
              border: `1px solid ${filter===s.key ? s.border : 'rgba(0,0,0,0.08)'}`,
              boxShadow: filter===s.key ? `0 4px 16px ${s.color}18` : '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:'1.2rem' }}>{s.icon}</span>
                {s.key==='urgent' && counts.urgent>0 && <div style={{ width:8,height:8,borderRadius:'50%',background:'#DC2626',animation:'pulse 1.5s infinite' }} />}
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.8rem', color:s.color, lineHeight:1 }}>{counts[s.key]}</div>
              <div style={{ fontSize:'0.72rem', color:'#6B7280', fontFamily:'Syne,sans-serif', fontWeight:600, marginTop:4 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Urgent banner */}
        {counts.urgent > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:12, marginBottom:16, background:'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.2)' }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background:'#DC2626',animation:'pulse 1.5s infinite',flexShrink:0 }} />
            <span style={{ color:'#DC2626', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem' }}>
              {counts.urgent} {t('hosp_urgent_banner')}
            </span>
          </div>
        )}

        {/* Search + table */}
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', overflow:'hidden' }}>
          {/* Search bar */}
          <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#9CA3AF', fontSize:'0.9rem' }}>🔍</span>
            <input type="text" placeholder={t('hosp_search')} value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none !important', boxShadow:'none !important', padding:'0 !important', fontSize:'0.88rem', flex:1, background:'transparent' }} />
            <span style={{ fontSize:'0.72rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:600 }}>{filtered.length} patients</span>
          </div>

          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 0.6fr 1fr 1fr 1fr 0.8fr', gap:0, padding:'10px 20px', background:'#F9FAFB', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
            {[t('hosp_col_patient'), t('hosp_col_surgery'), t('hosp_col_day'), t('hosp_col_checkin'), t('hosp_score'), t('hosp_col_status'), ''].map((h,i)=>(
              <div key={i} style={{ fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</div>
            ))}
          </div>

          {/* Table rows */}
          {filtered.map((p, i) => {
            const sc = SC[p.status]
            return (
              <div key={p.id}
                onClick={() => navigate(`/hospital/patient/${p.id}`)}
                style={{ display:'grid', gridTemplateColumns:'2fr 2fr 0.6fr 1fr 1fr 1fr 0.8fr', gap:0, padding:'14px 20px', borderBottom:'1px solid rgba(0,0,0,0.05)', cursor:'pointer', transition:'background 0.15s', background: p.status==='urgent' ? 'rgba(220,38,38,0.02)' : 'transparent' }}
                onMouseEnter={e=>e.currentTarget.style.background='#F9FAFB'}
                onMouseLeave={e=>e.currentTarget.style.background=p.status==='urgent'?'rgba(220,38,38,0.02)':'transparent'}
              >
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.88rem' }}>{p.name}</div>
                  <div style={{ color:'#9CA3AF', fontSize:'0.68rem', marginTop:1 }}>{p.age}y · {p.id}</div>
                </div>
                <div style={{ color:'#374151', fontSize:'0.82rem', alignSelf:'center' }}>{p.surgery}</div>
                <div style={{ alignSelf:'center' }}>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#1A73E8', fontSize:'0.9rem' }}>{p.day}</span>
                  <span style={{ color:'#9CA3AF', fontSize:'0.7rem' }}> / 30</span>
                </div>
                <div style={{ color:'#374151', fontSize:'0.78rem', alignSelf:'center' }}>{p.lastCheckIn}</div>
                <div style={{ alignSelf:'center' }}>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:sc.color, fontSize:'0.9rem' }}>{p.score}</span>
                  <span style={{ color:'#9CA3AF', fontSize:'0.7rem' }}>/16</span>
                  {p.flag && <div style={{ color:sc.color, fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:600, marginTop:2, maxWidth:160 }}>{p.flag}</div>}
                </div>
                <div style={{ alignSelf:'center' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:sc.bg, border:`1px solid ${sc.border}`, fontSize:'0.68rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:sc.color }}>
                    <div style={{ width:6,height:6,borderRadius:'50%',background:sc.dot,animation:p.status==='urgent'?'pulse 1.5s infinite':'none' }} />
                    {p.status === 'urgent' ? t('hosp_status_urgent') : p.status === 'attention' ? t('hosp_status_watch') : t('hosp_status_stable')}
                  </span>
                </div>
                <div style={{ alignSelf:'center', textAlign:'right' }}>
                  <span style={{ color:'#1A73E8', fontSize:'0.75rem', fontFamily:'Syne,sans-serif', fontWeight:700 }}>{t('hosp_view_profile')}</span>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding:'48px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:8 }}>🔍</div>
              <p style={{ color:'#9CA3AF', fontSize:'0.85rem' }}>{ t('hosp_no_results')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
