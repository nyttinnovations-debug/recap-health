import { useNavigate } from 'react-router-dom'
import { globalPatterns, getLocalizedGlobalPatterns } from '../data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function InsightTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff',border:'1px solid rgba(0,0,0,0.1)',borderRadius:10,padding:'10px 14px',boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#9CA3AF',fontSize:'0.68rem',marginBottom:4 }}>Day {label}</div>
      {payload.map(p=>(
        <div key={p.dataKey} style={{ display:'flex',alignItems:'center',gap:5,marginBottom:3 }}>
          <div style={{ width:8,height:8,borderRadius:'50%',background:p.fill }} />
          <span style={{ fontSize:'0.75rem',color:'#374151' }}>{p.name}: <strong>{p.value}%</strong></span>
        </div>
      ))}
    </div>
  )
}

export default function GlobalIntelligence() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const gp = getLocalizedGlobalPatterns(lang)
  const bmarks = gp.recoveryBenchmarks['Laparoscopic Cholecystectomy']

  return (
    <div style={{ minHeight:'100vh',background:'#F5F7FA' }}>
      <div style={{ background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.08)',padding:'0 32px',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',height:60,display:'flex',alignItems:'center',gap:14 }}>
          <button onClick={() => navigate('/hospital')} style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:10,border:'1px solid rgba(0,0,0,0.1)',background:'#fff',color:'#6B7280',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'0.78rem',cursor:'pointer' }}>← Back</button>
          <div>
            <span style={{ fontSize:'0.68rem',color:'#9CA3AF',fontFamily:'Syne,sans-serif',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em' }}>{t('gl_layer')}</span>
            <div style={{ fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1rem',color:'#111827' }}>{ t('gl_patterns')}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'28px 32px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24 }}>
          {[{label:t('gl_patients_tracked'),value:gp.totalPatients.toLocaleString(),icon:'👥',color:'#6D28D9'},{label:t('gl_countries'),value:gp.countries,icon:'🌍',color:'#1A73E8'},{label:t('gl_surgery_types'),value:gp.surgeryTypes.length,icon:'⚕',color:'#059669'}].map(s=>(
            <div key={s.label} style={{ background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:16,padding:'18px 20px',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',textAlign:'center' }}>
              <div style={{ fontSize:'1.4rem',marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'1.8rem',color:s.color,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'0.72rem',color:'#6B7280',fontFamily:'Syne,sans-serif',fontWeight:600,marginTop:5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:20 }}>
          <div>
            <div style={{ background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:16,padding:20,marginBottom:18,boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.9rem',marginBottom:4 }}>{ t('gl_dist_title')}</div>
              <div style={{ color:'#9CA3AF',fontSize:'0.7rem',marginBottom:14 }}>{ t('gl_dist_sub')}</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gp.recoveryByDay} margin={{ top:5,right:0,left:-20,bottom:0 }}>
                  <XAxis dataKey="day" tick={{ fill:'#9CA3AF',fontSize:10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill:'#9CA3AF',fontSize:10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<InsightTip />} />
                  <Bar dataKey="stableRate" name="Stable %" stackId="a" fill="#059669" />
                  <Bar dataKey="attentionRate" name="Watch %" stackId="a" fill="#D97706" />
                  <Bar dataKey="urgentRate" name="Urgent %" stackId="a" fill="#DC2626" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display:'flex',gap:16,marginTop:8,justifyContent:'center' }}>
                {[['#059669','Stable'],['#D97706','Watch'],['#DC2626','Urgent']].map(([c,l])=>(
                  <div key={l} style={{ display:'flex',alignItems:'center',gap:5 }}><div style={{ width:8,height:8,borderRadius:'50%',background:c }} /><span style={{ fontSize:'0.65rem',color:'#9CA3AF' }}>{l}</span></div>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(109,40,217,0.05)',border:'1px solid rgba(109,40,217,0.15)',borderRadius:16,padding:18 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}><span style={{ fontSize:'1.1rem' }}>🔗</span><div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#6D28D9',fontSize:'0.85rem' }}>{ t('gl_comorbidity')}</div></div>
              <p style={{ color:'#374151',fontSize:'0.82rem',lineHeight:1.65,margin:'0 0 10px' }}>{bmarks.diabeticPattern}</p>
              <div style={{ fontSize:'0.7rem',color:'#9CA3AF' }}>Derived from {Math.floor(gp.totalPatients*0.31).toLocaleString()} diabetic patients</div>
            </div>
          </div>

          <div>
            <div style={{ background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:16,padding:20,boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.9rem',marginBottom:14 }}>{ t('gl_milestones')}</div>
              {bmarks.milestones.map((m,i)=>(
                <div key={i} style={{ display:'flex',gap:12,paddingBottom:12,borderBottom:i<bmarks.milestones.length-1?'1px solid rgba(0,0,0,0.06)':'none',marginBottom:i<bmarks.milestones.length-1?12:0 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:'rgba(109,40,217,0.08)',border:'1px solid rgba(109,40,217,0.15)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <div style={{ fontSize:'0.52rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'#6D28D9',lineHeight:1 }}>DAY</div>
                    <div style={{ fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'0.9rem',color:'#6D28D9',lineHeight:1 }}>{m.day}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                      <span style={{ fontFamily:'Syne,sans-serif',fontWeight:700,color:'#111827',fontSize:'0.8rem' }}>{m.metric}</span>
                      <span style={{ fontFamily:'Syne,sans-serif',fontWeight:900,color:'#059669',fontSize:'0.9rem' }}>{m.avg}{m.unit}</span>
                    </div>
                    <div style={{ fontSize:'0.72rem',color:'#6B7280',lineHeight:1.5 }}>{m.insight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:16,padding:'12px 16px',borderRadius:10,background:'#fff',border:'1px solid rgba(0,0,0,0.07)',textAlign:'center' }}>
          <p style={{ color:'#9CA3AF',fontSize:'0.7rem',margin:0 }}>🔒 All data is anonymised and aggregated. Individual patient identifiers are never shared. Global Intelligence patterns should inform -- not replace -- clinical judgment.</p>
        </div>
      </div>
    </div>
  )
}
