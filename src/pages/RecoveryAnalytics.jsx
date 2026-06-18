import { generateMockAnalytics } from '../data/mockData'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LanguageContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const SC = { stable:'#059669', attention:'#D97706', urgent:'#DC2626' }

function getStatus(s) { return s <= 4 ? 'stable' : s <= 9 ? 'attention' : 'urgent' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'10px 14px', boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', fontSize:'0.68rem', marginBottom:4 }}>Day {label}</div>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#111827', fontSize:'1rem' }}>Score: {d?.score}</div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:SC[d?.status] }} />
        <span style={{ color:SC[d?.status], fontSize:'0.72rem', fontFamily:'Syne,sans-serif', fontWeight:600, textTransform:'capitalize' }}>{d?.status}</span>
      </div>
      {!d?.medsTaken && <div style={{ color:'#DC2626', fontSize:'0.65rem', marginTop:3 }}>⚠ Missed medication</div>}
    </div>
  )
}

export default function RecoveryAnalytics() {
  const { t } = useLang()

  // Use real localStorage data, fall back to mock
  const stored = JSON.parse(localStorage.getItem('recap_checkins') || '[]')
  const data = stored.length > 0
    ? stored.map(c => ({ day: c.day, score: c.score, status: getStatus(c.score), medsTaken: !Object.values(c.answers || {}).some(a => a.optionIndex === 2 && false) }))
    : generateMockAnalytics()

  const stableCount = data.filter(d => d.status === 'stable').length
  const missedMeds = data.filter(d => !d.medsTaken).length
  const trend = data.length >= 2 ? data[data.length-1].score - data[0].score : 0

  return (
    <div className="page">
      <PageHeader title={t('ana_title')} subtitle={`${data.length} ${t('ana_tracked').toLowerCase()}`} backTo="/dashboard" />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 0' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }} className="animate-fade-in">
          {[
            { label:t('ana_stable'),  value:stableCount,       icon:'✅', color:'#059669' },
            { label:t('ana_tracked'), value:data.length,        icon:'📊', color:'#1A73E8' },
            { label:t('ana_missed'),  value:missedMeds,         icon:'💊', color:'#DC2626' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:'14px 10px', textAlign:'center' }}>
              <div style={{ fontSize:'1.1rem', marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.5rem', color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'0.6rem', fontFamily:'Syne,sans-serif', fontWeight:600, color:'#9CA3AF', marginTop:4, lineHeight:1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div className="animate-slide-up" style={{ padding:'14px 16px', borderRadius:14, marginBottom:14, background:trend<=0?'rgba(5,150,105,0.07)':'rgba(180,83,9,0.07)', border:`1px solid ${trend<=0?'rgba(5,150,105,0.2)':'rgba(180,83,9,0.2)'}`, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:'1.4rem' }}>{trend<=0?'📉':'📈'}</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:trend<=0?'#059669':'#B45309', fontSize:'0.85rem' }}>{trend<=0?t('ana_improving'):t('ana_watch')}</div>
            <div style={{ color:'#6B7280', fontSize:'0.75rem', marginTop:2 }}>Score {trend<=0?t('ana_score_decreased'):t('ana_score_increased')} by {Math.abs(trend)} {t('ana_pts_since')}</div>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="card animate-fade-in" style={{ padding:40, textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📊</div>
            <p style={{ color:'#6B7280', fontSize:'0.85rem', lineHeight:1.6 }}>{t('ana_no_data')}</p>
          </div>
        ) : (
          <>
            {/* Main chart */}
            <div className="card animate-slide-up" style={{ padding:'18px 16px', marginBottom:14 }}>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.9rem' }}>{t('ana_score_title')}</div>
                <div style={{ color:'#9CA3AF', fontSize:'0.7rem', marginTop:2 }}>{t('ana_score_sub')}</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top:10, right:8, left:-22, bottom:0 }}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="day" tick={{ fill:'#9CA3AF', fontSize:10 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0,16]} tick={{ fill:'#9CA3AF', fontSize:10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={5}  stroke="rgba(5,150,105,0.3)"  strokeDasharray="4 4" label={{ value:'Stable', position:'right', fill:'#059669', fontSize:9 }} />
                  <ReferenceLine y={10} stroke="rgba(180,83,9,0.3)"   strokeDasharray="4 4" label={{ value:'Urgent', position:'right', fill:'#B45309', fontSize:9 }} />
                  <Area type="monotone" dataKey="score" stroke="#1A73E8" strokeWidth={2.5} fill="url(#aGrad)"
                    dot={(props) => {
                      const { cx, cy, payload } = props
                      return <circle key={payload.day} cx={cx} cy={cy} r={5} fill={SC[payload.status]} stroke="#fff" strokeWidth={2} />
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', gap:16, marginTop:8, justifyContent:'center' }}>
                {[['#059669','Stable ≤4'],['#D97706','Watch 5-9'],['#DC2626','Urgent 10+']].map(([c,l])=>(
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:c }} />
                    <span style={{ fontSize:'0.62rem', color:'#9CA3AF' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* History list */}
            <div className="card animate-slide-up" style={{ padding:'16px', marginBottom:14 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.88rem', marginBottom:12 }}>{t('ana_history')}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[...data].reverse().map(d => (
                  <div key={d.day} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:'1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:`${SC[d.status]}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:SC[d.status], fontSize:'0.75rem' }}>{d.day}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, color:'#111827', fontSize:'0.8rem' }}>Day {d.day}</div>
                        <div style={{ color:'#9CA3AF', fontSize:'0.65rem' }}>Score: {d.score}/16{!d.medsTaken ? ' · ⚠ missed meds' : ''}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:'0.62rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:SC[d.status], background:`${SC[d.status]}12`, border:`1px solid ${SC[d.status]}30`, padding:'3px 8px', borderRadius:99, textTransform:'capitalize' }}>{d.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
