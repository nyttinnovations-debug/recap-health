import { useParams, useNavigate } from 'react-router-dom'
import { hospitalPatients, globalPatterns, getLocalizedPatientData, getLocalizedHospitalPatients, getLocalizedGlobalPatterns } from '../data/mockData'
import { useLang } from '../context/LanguageContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

const SC = {
  stable:    { color:'#059669', bg:'rgba(5,150,105,0.08)',  border:'rgba(5,150,105,0.2)' },
  attention: { color:'#B45309', bg:'rgba(180,83,9,0.08)',   border:'rgba(180,83,9,0.2)'  },
  urgent:    { color:'#DC2626', bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.22)'},
}

// Generate matched global data for the patient's profile
function getMatchedInsights(patient, lang) {
  const gp = getLocalizedGlobalPatterns(lang)
  const bmarks = gp.recoveryBenchmarks['Laparoscopic Cholecystectomy']
  const totalMatched = 247
  const diabetic = patient.comorbidities?.includes('Type 2 Diabetes')

  // Build comparison chart data: patient score vs global average
  const stored = JSON.parse(localStorage.getItem('recap_checkins') || '[]')
  const globalAvg = gp.recoveryByDay

  const comparison = globalAvg.map(g => {
    const patientEntry = stored.find(c => c.day === g.day)
    return {
      day: g.day,
      globalAvg: parseFloat((g.avgScore).toFixed(1)),
      patientScore: patientEntry ? patientEntry.score : null,
    }
  })

  const complications = [
    { name: 'Wound infection', n: 12, pct: 4.9, timing: 'Day 4-7', watch: 'Redness, warmth, or discharge at wound site', risk: diabetic ? 'elevated' : 'normal' },
    { name: 'Mild fever', n: 44, pct: 17.8, timing: 'Day 2-4', watch: 'Temperature above 38 degreesC', risk: 'normal' },
    { name: 'Reduced mobility', n: 61, pct: 24.7, timing: 'Day 3-6', watch: 'Unable to walk 10 min by Day 5', risk: 'normal' },
    { name: 'Nausea / vomiting', n: 29, pct: 11.7, timing: 'Day 1-3', watch: 'Unable to keep food down', risk: 'normal' },
  ]

  const milestones = bmarks.milestones.map(m => ({
    ...m,
    patientExpected: diabetic && m.day <= 10 ? `${m.avg - 8}-${m.avg - 4}%` : `${m.avg}%`,
    note: diabetic && m.day <= 10 ? 'May be slower due to diabetes' : 'On track with global average',
  }))

  return { totalMatched, comparison, complications, milestones, diabetic }
}

function CompTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'10px 14px', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', fontSize:'0.68rem', marginBottom:4 }}>Day {label}</div>
      {payload.map(p => p.value !== null && (
        <div key={p.dataKey} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }} />
          <span style={{ fontSize:'0.78rem', color:'#374151' }}>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  )
}

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const locList = getLocalizedHospitalPatients(lang)
  const patient = locList.find(p => p.id === id) || locList[0]
  const sc = SC[patient.status]
  const insights = getMatchedInsights(patient, lang)

  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.08)', padding:'0 32px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:60, display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('/hospital')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', color:'#6B7280', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>
            ← Back
          </button>
          <div style={{ width:1, height:28, background:'rgba(0,0,0,0.1)' }} />
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1rem', color:'#111827' }}>{ t('prof_title')}</div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <a href={`tel:${patient.phone}`} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'rgba(26,115,232,0.08)', border:'1px solid rgba(26,115,232,0.2)', color:'#1A73E8', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem', textDecoration:'none' }}>
              📞 {t('hosp_call')}
            </a>
            {patient.status === 'urgent' && (
              <button style={{ padding:'7px 14px', borderRadius:10, background:'#DC2626', color:'#fff', border:'none', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem', cursor:'pointer' }}>
                🚨 {t('hosp_alert')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:24 }}>

          {/* LEFT: Patient info */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Profile card */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,rgba(26,115,232,0.1),rgba(109,40,217,0.1))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:'1px solid rgba(0,0,0,0.07)', flexShrink:0 }}>👤</div>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#111827' }}>{patient.name}</div>
                  <div style={{ color:'#6B7280', fontSize:'0.75rem' }}>{patient.age} yrs · {patient.id}</div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                {[
                  ['Surgery', patient.surgery],
                  ['Recovery Day', `Day ${patient.day} / 30`],
                  ['Last Check-In', patient.lastCheckIn],
                  ['Ward', t('hosp_at_home') + ` · Day ${patient.day}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ padding:'10px 12px', borderRadius:10, background:'#F9FAFB', border:'1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize:'0.6rem', color:'#9CA3AF', fontFamily:'Syne,sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</div>
                    <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#111827', marginTop:3 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ padding:'12px 14px', borderRadius:12, background:sc.bg, border:`1px solid ${sc.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:sc.color, fontSize:'0.85rem' }}>
                    {patient.status === 'urgent' ? '🚨 Immediate Action' : patient.status === 'attention' ? '⚠ Needs Attention' : '✅ Stable'}
                  </div>
                  {patient.flag && <div style={{ fontSize:'0.72rem', color:'#6B7280', marginTop:2 }}>{patient.flag}</div>}
                </div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.4rem', color:sc.color }}>{patient.score}<span style={{ fontSize:'0.8rem', fontWeight:600, color:'#9CA3AF' }}>/16</span></div>
              </div>
            </div>

            {/* Comorbidities */}
            {patient.comorbidities?.length > 0 && (
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:18, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize:'0.68rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Comorbidities</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {patient.comorbidities.map(c => (
                    <span key={c} style={{ padding:'4px 10px', borderRadius:99, background:'rgba(180,83,9,0.08)', border:'1px solid rgba(180,83,9,0.2)', fontSize:'0.72rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#B45309' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Global match badge */}
            <div style={{ background:'linear-gradient(135deg,rgba(109,40,217,0.07),rgba(26,115,232,0.07))', border:'1px solid rgba(109,40,217,0.15)', borderRadius:16, padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:'1.1rem' }}>🌍</span>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#6D28D9', fontSize:'0.85rem' }}>{ t('prof_global_match')}</div>
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.5rem', color:'#111827', marginBottom:4 }}>{insights.totalMatched}</div>
              <div style={{ fontSize:'0.78rem', color:'#6B7280', lineHeight:1.5 }}>
                patients globally matched this profile:<br />
                <strong style={{ color:'#374151' }}>{patient.surgery}</strong> · {patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'}{insights.diabetic ? ' · T2DM' : ''}
              </div>
            </div>
          </div>

          {/* RIGHT: Global intelligence */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Section title */}
            <div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.3rem', color:'#111827', margin:'0 0 4px' }}>{ t('prof_global_title')}</h2>
              <p style={{ color:'#6B7280', fontSize:'0.82rem', margin:0 }}>
                Insights from {insights.totalMatched} patients with {patient.surgery}, similar age ({patient.age - 5}-{patient.age + 5}y), {insights.diabetic ? 'Type 2 Diabetes' : 'no major comorbidities'}
              </p>
            </div>

            {/* Comparison chart */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.9rem' }}>{ t('prof_score_title')}</div>
                <div style={{ color:'#9CA3AF', fontSize:'0.72rem', marginTop:2 }}>{ t('prof_score_sub')}</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={insights.comparison} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="day" tick={{ fill:'#9CA3AF', fontSize:10 }} tickLine={false} axisLine={false} label={{ value:'Day', position:'insideBottom', fill:'#9CA3AF', fontSize:9, dy:10 }} />
                  <YAxis domain={[0,16]} tick={{ fill:'#9CA3AF', fontSize:10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CompTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'0.72rem', color:'#6B7280' }} />
                  <Line type="monotone" dataKey="globalAvg" name="Global Average" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                  <Line type="monotone" dataKey="patientScore" name="This Patient" stroke="#1A73E8" strokeWidth={2.5} dot={{ fill:'#1A73E8', r:4, strokeWidth:2, stroke:'#fff' }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Known complications */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.9rem', marginBottom:14 }}>
                Complications in Matched Population
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {insights.complications.map((c, i) => (
                  <div key={i} style={{ padding:'14px', borderRadius:12, background: c.risk==='elevated' ? 'rgba(220,38,38,0.05)' : '#F9FAFB', border:`1px solid ${c.risk==='elevated' ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.07)'}` }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.82rem' }}>{c.name}</div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1rem', color: c.pct > 15 ? '#D97706' : '#374151' }}>
                        {c.pct}%
                      </div>
                    </div>
                    <div style={{ fontSize:'0.68rem', color:'#6B7280', marginBottom:4 }}>
                      <span style={{ color:'#9CA3AF' }}>Timing: </span>{c.timing}
                    </div>
                    <div style={{ fontSize:'0.68rem', color:'#6B7280', marginBottom:6 }}>
                      <span style={{ color:'#9CA3AF' }}>Watch for: </span>{c.watch}
                    </div>
                    {c.risk === 'elevated' && (
                      <span style={{ fontSize:'0.6rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#DC2626', background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', padding:'2px 6px', borderRadius:99 }}>
                        ↑ Risk: Diabetes
                      </span>
                    )}
                    {/* Mini bar */}
                    <div style={{ height:4, borderRadius:2, background:'#E5E7EB', marginTop:8, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min(c.pct * 3.5, 100)}%`, borderRadius:2, background: c.pct > 15 ? '#D97706' : '#1A73E8' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:'rgba(109,40,217,0.06)', border:'1px solid rgba(109,40,217,0.15)' }}>
                <div style={{ fontSize:'0.75rem', color:'#6D28D9', lineHeight:1.6 }}>
                  <strong>Among {insights.totalMatched} matched patients:</strong> Most complications occurred between Day 3-7. Patients with reduced mobility had 2.4x higher infection rates. {insights.diabetic ? '⚠ Diabetic patients showed 30% slower wound healing -- monitor closely from Day 5.' : ''}
                </div>
              </div>
            </div>

            {/* Recovery milestones */}
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.9rem', marginBottom:14 }}>
                Expected Milestones for This Profile
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {insights.milestones.map((m, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom: i < insights.milestones.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'rgba(109,40,217,0.08)', border:'1px solid rgba(109,40,217,0.15)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ fontSize:'0.55rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#6D28D9', lineHeight:1 }}>DAY</div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1rem', color:'#6D28D9', lineHeight:1 }}>{m.day}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
                        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#111827', fontSize:'0.82rem' }}>{m.metric}</span>
                        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:900, color:'#059669', fontSize:'0.95rem' }}>{m.avg}{m.unit}</span>
                      </div>
                      <div style={{ fontSize:'0.72rem', color:'#6B7280', lineHeight:1.5 }}>{m.insight}</div>
                      {m.note.includes('slower') && (
                        <span style={{ fontSize:'0.62rem', color:'#B45309', fontFamily:'Syne,sans-serif', fontWeight:600 }}>⚠ {m.note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
