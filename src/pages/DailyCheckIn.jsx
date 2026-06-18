import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientData } from '../data/mockData'
import { useLang } from '../context/LanguageContext'
import { getCachedPatient, saveCheckin } from '../lib/patientSession'

const C = {
  stable:    { bg:'rgba(5,150,105,0.08)',  border:'rgba(5,150,105,0.25)',  text:'#059669', sel:'rgba(5,150,105,0.15)' },
  attention: { bg:'rgba(180,83,9,0.07)',   border:'rgba(180,83,9,0.22)',   text:'#B45309', sel:'rgba(180,83,9,0.12)' },
  urgent:    { bg:'rgba(220,38,38,0.07)',  border:'rgba(220,38,38,0.22)',  text:'#DC2626', sel:'rgba(220,38,38,0.12)' },
}

const TIPS = {
  en: {
    q1:'Be as honest as you can about your pain. Your trend helps me understand how your recovery is progressing.',
    q2:'A slight temperature in days 1-2 is normal. Above 38.5 degrees needs prompt attention.',
    q_chole_1:'Shoulder or arm pain after your surgery is from trapped CO2 gas. It fully goes away by Day 3-4. Try gentle shoulder rolls.',
    q_chole_2:'Bloating is very common after laparoscopic surgery. Short gentle walks help release the trapped gas naturally.',
    q_chole_3:'Check your skin and eyes in good lighting. Yellowing is rare but very important to catch early.',
    q_chole_4:'Your digestion is adjusting to life without a gallbladder. Pale or very dark stools need prompt attention.',
    q3:'Check all 4 small incision sites. They should look clean, dry, and gradually closing each day.',
    q4:'Nausea often improves as the anesthesia fully clears from your system over the first few days.',
    q5:'Stick to soft light foods for now. Avoid fatty or spicy food for at least 2 more weeks.',
    q6:'Short gentle walks are the best medicine right now. Even 10 minutes a few times a day makes a big difference.',
    q7:'Your antibiotic course must be completed fully - even if you feel better. Never stop early.',
    q8:'Fatigue is completely normal. Your body is using its energy to heal the surgical sites.',
  },
  uz: {
    q1:"Ogrik haqida iloji boricha halol boling. Tendensiyangiz tuzalishingizni kuzatishga yordam beradi.",
    q2:"Dastlabki 1-2 kunda biroz harorat normaldir. 38.5 dan yuqori esa e'tibor talab qiladi.",
    q_chole_1:"Yelka yoki qol ogrigi jarrohlik gazidan (CO2). 3-4 kunda to'liq o'tib ketadi.",
    q_chole_2:"Shishish laparoskopik jarrohlikdan keyin juda keng tarqalgan. Qisqa sayrlar gazni chiqarishga yordam beradi.",
    q_chole_3:"Yaxshi yoritishda terini va kozlarni tekshiring. Sariqlik kam uchraydi, lekin erta aniqlash muhim.",
    q_chole_4:"Hazm tizimingiz moslashmoqda. Och, loy rangli yoki juda qorang'i axlat e'tiborni talab qiladi.",
    q3:"4 ta kichik kesmani tekshiring. Ular toza, quruq va asta-sekin bitib borayotgan bolishi kerak.",
    q4:"Ko'ngil aynishi narkoz ketgach yaxshilanadi.",
    q5:"Hozircha yumshoq, engil ovqat ching. Yog'li va achchiq ovqatdan kamida 2 hafta saqlaning.",
    q6:"Qisqa yengil sayrlar eng yaxshi doridir. Kuniga bir necha marta 10 daqiqa ham katta farq qiladi.",
    q7:"Antibiotik kursini to'liq tugatish kerak - yaxshi his qilsangiz ham. Erta to'xtatmang.",
    q8:"Charchoq mutlaqo normaldir. Tana energiyasini jarrohlik joylarini tuzatishga sarflayapti.",
  },
  ru: {
    q1:"Budte chestny o boli. Dinamika pomogaet mne otslezhat vashye vyzdorovleniye.",
    q2:"Nebolshaya temperatura v 1-2 den normalna. Vyshe 38.5 trebuyet vnimaniya.",
    q_chole_1:"Bol v pleche posle operacii - eto gaz CO2. Polnostyu prohodit k 3-4 dnyu.",
    q_chole_2:"Vzdutiye ochen rasprostranyeno posle laparoskopii. Korotkiye progulki pomogayut vyvesti gaz.",
    q_chole_3:"Proverite kozhu i glaza pri horoshem svete. Pozzhelteniye redko, no ochen vazhno vyyavit rano.",
    q_chole_4:"Pischevareniye priysposablivaetsya. Blyednyj ili temnyj stul trebuyet vnimaniya.",
    q3:"Proverite vse 4 razreza. Dolzhny vyglyadet chisto suho i zazhivat kazhdyj den.",
    q4:"Toshnota uluchshaetsya po mere togo kak narkoz vykhodit iz organizma.",
    q5:"Myagkaya lyogkaya eda sejchas. Izbegajte zhirnoj i ostrom edy eshhe minimum 2 nedeli.",
    q6:"Korotkiye progulki - luchshee lekarstvo. Dazhe 10 minut neskolko raz v den otlichno.",
    q7:"Kurs antibiotikov dolzhen byt zavershyon polnostyu - dazhe kogda luchshe.",
    q8:"Ustalost normalna. Organizm ispolzuyet energiyu dlya zazhivleniya.",
  },
}

function painColor(v) {
  if (v<=2) return '#059669'
  if (v<=4) return '#65A30D'
  if (v<=6) return '#D97706'
  if (v<=8) return '#EA580C'
  return '#DC2626'
}
function painScore(v) { return v<=3?0:v<=6?1:2 }

function AzizaTip({ qid, lang }) {
  const { t } = useLang()
  const tip = (TIPS[lang]||TIPS.en)[qid]
  if (!tip) return null
  return (
    <>
      <style>{`
        @keyframes azizaTipSlide {
          0%   { transform: translateY(18px) scale(0.95); opacity: 0; }
          60%  { transform: translateY(-4px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes bubblePopIn {
          0%   { transform: scale(0.7); opacity: 0; transform-origin: bottom left; }
          65%  { transform: scale(1.04); opacity: 1; transform-origin: bottom left; }
          100% { transform: scale(1);   opacity: 1; transform-origin: bottom left; }
        }
        @keyframes nurseFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-4px); }
        }
      `}</style>
      <div style={{ display:'flex', alignItems:'flex-end', gap:10, marginBottom:16, animation:'azizaTipSlide 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        {/* Nurse avatar - bounces gently */}
        <div style={{ flexShrink:0, animation:'nurseFloat 3s ease-in-out infinite', position:'relative' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', overflow:'hidden', border:'2.5px solid #1A73E8', boxShadow:'0 3px 12px rgba(26,115,232,0.3)', background:'linear-gradient(135deg,#DBEAFE,#EDE9FE)' }}>
            <img
              src="/aziza.jpg"
              alt="Aziza"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.6rem;background:linear-gradient(135deg,#DBEAFE,#EDE9FE)">&#128105;&#8205;&#9877;&#65039;</div>'
              }}
            />
          </div>
          {/* Online dot */}
          <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:'#059669', border:'2px solid white' }} />
        </div>
        {/* Speech bubble - pops in after nurse */}
        <div style={{ flex:1, animation:'bubblePopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both', position:'relative' }}>
          <div style={{ background:'white', borderRadius:'14px 14px 14px 4px', padding:'11px 13px', boxShadow:'0 4px 18px rgba(0,0,0,0.1)', border:'1.5px solid rgba(26,115,232,0.2)' }}>
            <p style={{ fontSize:'0.77rem', color:'#111827', lineHeight:1.65, margin:'0 0 5px', fontFamily:'Sora,sans-serif' }}>{tip}</p>
            <span style={{ fontSize:'0.58rem', color:'#1A73E8', fontFamily:'Syne,sans-serif', fontWeight:700 }}>{t('ci_nurse_label')}</span>
          </div>
          {/* Bubble tail pointing to nurse */}
          <div style={{ position:'absolute', bottom:10, left:-7, width:0, height:0, borderTop:'7px solid transparent', borderBottom:'7px solid transparent', borderRight:'7px solid white' }} />
          <div style={{ position:'absolute', bottom:10, left:-9, width:0, height:0, borderTop:'8px solid transparent', borderBottom:'8px solid transparent', borderRight:'8px solid rgba(26,115,232,0.2)' }} />
        </div>
      </div>
    </>
  )
}

export default function DailyCheckIn() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const checkins = JSON.parse(localStorage.getItem('recap_checkins')||'[]')
  const lastCheckin = checkins.length>0 ? checkins[checkins.length-1] : null
  const yesterdayPain = lastCheckin?.painScore ?? null
  const questions = buildQuestions(t)
  const total = questions.length
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [painVal, setPainVal] = useState(yesterdayPain!==null ? Math.max(yesterdayPain-1,0) : 5)
  const q = questions[current]
  const isQ1 = current===0

  const handleNext = async () => {
    const score = isQ1 ? painScore(painVal) : (selected!==null ? q.options[selected].score : 0)
    if (!isQ1 && selected===null) return
    const na = { ...answers, [q.id]: isQ1 ? {score,painSlider:painVal} : {optionIndex:selected,score} }
    setAnswers(na)
    if (current < total-1) {
      const nq = questions[current+1]
      const prev = na[nq.id]
      if (current+1===0) setPainVal(prev?.painSlider??5)
      else setSelected(prev?.optionIndex??null)
      setCurrent(c=>c+1)
    } else {
      const totalScore = Object.values(na).reduce((s,a)=>s+(a.score||0),0)
      const st = totalScore<=4 ? 'stable' : totalScore<=9 ? 'attention' : 'urgent'
      const pilotPatient = getCachedPatient()
      // Always keep a localStorage copy (demo mode relies on it; pilot uses it for "yesterday" display)
      const stored = JSON.parse(localStorage.getItem('recap_checkins')||'[]')
      stored.push({day:patientData.dayOfRecovery,date:new Date().toISOString(),score:totalScore,answers:na,painScore:painVal})
      localStorage.setItem('recap_checkins',JSON.stringify(stored))
      if (pilotPatient) {
        await saveCheckin(pilotPatient, totalScore, st, na, painVal)
      }
      navigate('/checkin/result',{state:{score:totalScore}})
    }
  }

  const handleBack = () => {
    if (current===0) { navigate('/dashboard'); return }
    const pi = current-1
    const prev = answers[questions[pi].id]
    if (pi===0) setPainVal(prev?.painSlider??(yesterdayPain??5))
    else setSelected(prev?.optionIndex??null)
    setCurrent(pi)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F5F8FF', display:'flex', flexDirection:'column' }}>
      <div style={{ maxWidth:480, margin:'0 auto', width:'100%', flex:1, padding:'0 20px', display:'flex', flexDirection:'column' }}>

        <div style={{ paddingTop:22, paddingBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <button onClick={handleBack} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.12)', background:'#fff', color:'#374151', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>
              ← {t('ci_back')}
            </button>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.82rem', color:'#6B7280' }}>
              <span style={{ color:'#059669', fontWeight:800, fontSize:'1.1rem' }}>{current+1}</span> / {total}
            </span>
          </div>
          <div style={{ height:6, borderRadius:3, background:'#E5E7EB', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:3, width:(((current+1)/total)*100)+'%', background:'linear-gradient(90deg,#059669,#1A73E8)', transition:'width 0.4s ease' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
            <span style={{ fontSize:'0.65rem', color:'#9CA3AF' }}>Day {patientData.dayOfRecovery} {t('ci_title')}</span>
            <span style={{ fontSize:'0.65rem', color:'#9CA3AF' }}>{Math.round((current/total)*100)}{t('ci_complete')}</span>
          </div>
        </div>

        {/* Aziza tip on every question */}
        <AzizaTip qid={q.id} lang={lang} />

        <div style={{ flex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, background:'rgba(5,150,105,0.1)', border:'1px solid rgba(5,150,105,0.2)', marginBottom:12 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#059669' }} />
            <span style={{ color:'#059669', fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:700, letterSpacing:'0.1em' }}>{t('ci_question')} {current+1}</span>
          </div>

          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.4rem', color:'#111827', lineHeight:1.25, letterSpacing:'-0.025em', marginBottom:6 }}>
            {isQ1 ? t('ci_pain_title') : t(q.qKey)}
          </h2>
          <p style={{ color:'#6B7280', fontSize:'0.85rem', marginBottom:20 }}>
            {isQ1 ? t('ci_pain_sub') : t(q.sKey)}
          </p>

          {isQ1 && (
            <div style={{ marginBottom:16 }}>
              {yesterdayPain!==null && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, background:'#fff', border:'1px solid rgba(0,0,0,0.08)', marginBottom:16, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <span>📊</span>
                  <span style={{ fontSize:'0.8rem', color:'#6B7280' }}>{t('ci_pain_yesterday')}: </span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'0.95rem', color:painColor(yesterdayPain) }}>{yesterdayPain}/10</span>
                  <div style={{ flex:1, height:4, borderRadius:2, background:'#F3F4F6', overflow:'hidden', marginLeft:4 }}>
                    <div style={{ height:'100%', width:(yesterdayPain*10)+'%', background:painColor(yesterdayPain), borderRadius:2 }} />
                  </div>
                </div>
              )}
              <div style={{ textAlign:'center', marginBottom:18 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'4rem', color:painColor(painVal), lineHeight:1, transition:'color 0.2s' }}>{painVal}</div>
                <div style={{ fontSize:'0.85rem', color:'#9CA3AF' }}>/ 10</div>
              </div>
              <input type="range" min="0" max="10" value={painVal} onChange={e=>setPainVal(Number(e.target.value))} className="pain-slider" style={{ marginBottom:8 }} />
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
                <span style={{ fontSize:'0.72rem', color:'#059669', fontFamily:'Syne,sans-serif', fontWeight:600 }}>😊 {t('ci_pain_none')}</span>
                <span style={{ fontSize:'0.72rem', color:'#DC2626', fontFamily:'Syne,sans-serif', fontWeight:600 }}>{t('ci_pain_worst')} 😣</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                {[{r:[0,2],lk:'ci_pain_none2',e:'😊',c:'#059669'},{r:[3,4],lk:'ci_pain_mild',e:'😐',c:'#65A30D'},{r:[5,7],lk:'ci_pain_moderate',e:'😕',c:'#D97706'},{r:[8,10],lk:'ci_pain_severe',e:'😣',c:'#DC2626'}].map(chip=>{
                  const active = painVal>=chip.r[0] && painVal<=chip.r[1]
                  return (
                    <div key={chip.l} style={{ textAlign:'center', padding:'8px 4px', borderRadius:10, border:'1px solid '+(active?chip.c+'50':'rgba(0,0,0,0.07)'), background:active?chip.c+'12':'#fff', transition:'all 0.2s' }}>
                      <div style={{ fontSize:'1.1rem' }}>{chip.e}</div>
                      <div style={{ fontSize:'0.6rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:active?chip.c:'#9CA3AF', marginTop:2 }}>{t(chip.lk)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!isQ1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt,i)=>{
                const c = C[opt.color]
                const isSel = selected===i
                return (
                  <button key={i} onClick={()=>setSelected(i)} style={{ textAlign:'left', padding:'14px 16px', borderRadius:16, border:'1.5px solid '+(isSel?c.border:'rgba(0,0,0,0.08)'), background:isSel?c.sel:'#fff', cursor:'pointer', transition:'all 0.18s', boxShadow:isSel?'0 2px 12px '+c.text+'22':'0 1px 3px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:isSel?c.bg:'#F9FAFB', border:'1px solid '+(isSel?c.border:'rgba(0,0,0,0.07)'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.88rem', color:isSel?c.text:'#111827', lineHeight:1.3 }}>{t(opt.labelKey)}</div>
                    </div>
                    {isSel && <div style={{ width:22, height:22, borderRadius:'50%', background:c.text, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><span style={{ color:'#fff', fontSize:'0.65rem', fontWeight:800 }}>✓</span></div>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ padding:'20px 0 32px' }}>
          <button onClick={handleNext} disabled={!isQ1 && selected===null} className="btn-primary" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:(!isQ1&&selected===null)?0.4:1 }}>
            {current<total-1 ? t('ci_next') : t('ci_finish')} <span>{current<total-1?'→':'✓'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function buildQuestions(t) {
  return [
    {id:'q1',qKey:'ci_pain_title',sKey:'ci_pain_sub',isSlider:true,options:[]},
    {id:'q2',qKey:'ci_q2',sKey:'ci_q2s',options:[
      {labelKey:'ci_o_q2a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_o_q2b',emoji:'🌡️',score:1,color:'attention'},
      {labelKey:'ci_o_q2c',emoji:'🔥',score:3,color:'urgent'},
    ]},
    {id:'q_chole_1',qKey:'ci_chole_q1',sKey:'ci_chole_q1s',options:[
      {labelKey:'ci_chole_q1a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_chole_q1b',emoji:'😤',score:1,color:'attention'},
      {labelKey:'ci_chole_q1c',emoji:'🚨',score:2,color:'urgent'},
    ]},
    {id:'q_chole_2',qKey:'ci_chole_q2',sKey:'ci_chole_q2s',options:[
      {labelKey:'ci_chole_q2a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_chole_q2b',emoji:'😣',score:1,color:'attention'},
      {labelKey:'ci_chole_q2c',emoji:'🚨',score:2,color:'urgent'},
    ]},
    {id:'q_chole_3',qKey:'ci_chole_q3',sKey:'ci_chole_q3s',options:[
      {labelKey:'ci_chole_q3a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_chole_q3b',emoji:'⚠️',score:1,color:'attention'},
      {labelKey:'ci_chole_q3c',emoji:'🚨',score:3,color:'urgent'},
    ]},
    {id:'q_chole_4',qKey:'ci_chole_q4',sKey:'ci_chole_q4s',options:[
      {labelKey:'ci_chole_q4a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_chole_q4b',emoji:'⚠️',score:1,color:'attention'},
      {labelKey:'ci_chole_q4c',emoji:'🚨',score:3,color:'urgent'},
    ]},
    {id:'q3',qKey:'ci_q3',sKey:'ci_q3s',options:[
      {labelKey:'ci_o_q3a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_o_q3b',emoji:'⚠️',score:1,color:'attention'},
      {labelKey:'ci_o_q3c',emoji:'🚨',score:3,color:'urgent'},
    ]},
    {id:'q4',qKey:'ci_q4',sKey:'ci_q4s',options:[
      {labelKey:'ci_o_q4a',emoji:'😊',score:0,color:'stable'},
      {labelKey:'ci_o_q4b',emoji:'😐',score:1,color:'attention'},
      {labelKey:'ci_o_q4c',emoji:'🤢',score:2,color:'urgent'},
    ]},
    {id:'q5',qKey:'ci_q5',sKey:'ci_q5s',options:[
      {labelKey:'ci_o_q5a',emoji:'🍲',score:0,color:'stable'},
      {labelKey:'ci_o_q5b',emoji:'🥣',score:1,color:'attention'},
      {labelKey:'ci_o_q5c',emoji:'❌',score:2,color:'urgent'},
    ]},
    {id:'q6',qKey:'ci_q6',sKey:'ci_q6s',options:[
      {labelKey:'ci_o_q6a',emoji:'🚶',score:0,color:'stable'},
      {labelKey:'ci_o_q6b',emoji:'🐢',score:1,color:'attention'},
      {labelKey:'ci_o_q6c',emoji:'🛏️',score:2,color:'urgent'},
    ]},
    {id:'q7',qKey:'ci_q7',sKey:'ci_q7s',options:[
      {labelKey:'ci_o_q7a',emoji:'✅',score:0,color:'stable'},
      {labelKey:'ci_o_q7b',emoji:'⚠️',score:1,color:'attention'},
      {labelKey:'ci_o_q7c',emoji:'❌',score:2,color:'urgent'},
    ]},
    {id:'q8',qKey:'ci_q8',sKey:'ci_q8s',options:[
      {labelKey:'ci_o_q8a',emoji:'⚡',score:0,color:'stable'},
      {labelKey:'ci_o_q8b',emoji:'😴',score:1,color:'attention'},
      {labelKey:'ci_o_q8c',emoji:'💤',score:2,color:'urgent'},
    ]},
  ]
}
