import { useState, useRef, useEffect } from 'react'
import { patientData } from '../data/mockData'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import { useLang } from '../context/LanguageContext'

const API_URL = import.meta.env.PROD ? '/api/claude' : '/v1/messages'

const SUGGESTED = {
  en: [
    'Is my pain level normal on day 2?',
    'When can I eat normal food again?',
    'Can I shower today?',
    'My wound looks slightly red -- should I worry?',
    'I missed my Amoxicillin dose, what do I do?',
    'When can I drive again?',
  ],
  uz: [
    "2-kunda og'riq darajam normalmi?",
    "Qachon normal ovqat yeyishim mumkin?",
    "Bugun dush qabul qilsam bo'ladimi?",
    "Yarams biroz qizargan -- xavotirlanishim kerakmi?",
    "Amoksitsillin dozasini o'tkazib yubordim, nima qilishim kerak?",
    "Qachon mashina haydashim mumkin?",
  ],
  ru: [
    'Normal li moj uroven boli na den 2?',
    'Kogda mogu est normalnuyu edu?',
    'Mogu li ya prinyat dush segodnya?',
    'Moya rana nemnogo pokrasnela -- stoit li volnovatsya?',
    'Ya propustil dozu Amoksicillina chto delat?',
    'Kogda mogu snova vodit mashinu?',
  ],
}

const DEMO_RESPONSES = {
  en: [
    `That's a very common concern on Day 2, Amir! After a laparoscopic cholecystectomy, some soreness around the small incision sites is completely expected. You may also feel shoulder or upper back pain -- this is from the CO2 gas used during surgery and usually fades by Day 3.\n\nIf your pain is manageable with your Tramadol and not getting worse, you're on track. If it's severe, sharp, or feels deep inside rather than at the wound sites -- call the hospital.`,
    `Yes, you can shower today, Amir! After 48 hours post-discharge, a quick shower is safe:\n\n• Keep it short and use warm (not hot) water\n• Pat the wound sites gently dry -- never rub\n• No soaking baths, hot tubs, or swimming for 2 weeks\n\nKeeping clean actually helps prevent infection. You're doing great! 🚿`,
    `Missing one Amoxicillin dose happens -- don't panic, Amir. If less than 4 hours: take it now. If more than 4 hours: skip and take the next dose at the regular time. Never double-dose. Complete the full 7-day course even if you feel better.`,
    `On Day 2, your diet should still be gentle, Amir:\n\n✅ Clear soups and broths\n✅ Yogurt, mashed potato, toast\n✅ Plenty of water (8+ glasses)\n\n❌ Avoid fatty, fried, or spicy foods. Most patients return to normal eating by Day 7-10.`,
  ],
  uz: [
    `Bu 2-kunda juda keng tarqalgan holat, Amir! Laparoskopik xoletsistektomiyadan so'ng kichik kesmalar atrofida og'riq kutilgan holat. Yelka va orqa og'rig'i ham bo'lishi mumkin -- bu jarrohlikdagi CO2 gazidan va 3-4 kunga to'liq o'tib ketadi.\n\nTramadol bilan og'riq boshqarilayotgan bo'lsa va yomonlashmayotgan bo'lsa -- siz to'g'ri yo'ldasiz. Agar kuchli, o'tkir yoki yara joyi ichidan og'risa -- kasalxonaga qo'ng'iroq qiling.`,
    `Ha, bugun dush qabul qilsangiz bo'ladi, Amir! Chiqishdan 48 soat o'tgach qisqa dush xavfsiz:\n\n• Qisqa va iliq suv bilan\n• Yara joylarini ehtiyotkorlik bilan quritib quritib oling -- ishqalamang\n• Kamida 2 hafta vanna, basseyn qabul qilmang\n\nTozalik infektsiyaning oldini olishga yordam beradi! 🚿`,
    `Amoksitsillin dozasini o'tkazib yuborish bo'ladi -- vahima qilmang, Amir. 4 soatdan kam o'tgan bo'lsa: hozir qabul qiling. 4 soatdan ko'p bo'lsa: o'tkazib yuboring va keyingi dozani odatdagi vaqtda qabul qiling. Hech qachon ikki doza qabul qilmang. Yaxshilanib ketgan bo'lsangiz ham 7 kunlik kursni to'liq tugatng.`,
    `2-kunda ovqat hali yengil bo'lishi kerak, Amir:\n\n✅ Tiniq sho'rvalar\n✅ Qatiq, kartoshka pyuresi, tost\n✅ Ko'p suv (8+ stakan)\n\n❌ Yog'li, qovurilgan, achchiq ovqatlardan saqlaning. Ko'pchilik 7-10 kunda normal ovqatlanishga qaytadi.`,
  ],
  ru: [
    `Eto ochen rasprostranyonnaya problema na Den 2, Amir! Posle laparoskopicheskoy holecistektomii boleznennye oshchushcheniya vokrug razrezov -- norma. Bol v pleche i spine tozhe vozmozhna -- eto gaz CO2 ot operacii i prohodit k Dnyu 3-4.\n\nEsli bol kontroliruetsya Tramadolom i ne usilivaetsya -- vy na vernom puti. Esli ochen silnaya ili glubokaya -- zvonite v bolnicu.`,
    `Da, segodnya mozhno prinyat dush, Amir! Cherez 48 chasov posle vypivki kratkiy dush bezopasен:\n\n• Kratkiy i teplovoy vodoy\n• Akkuratno promokajte rany -- ne trite\n• Nikakikh vann i bassejna minimum 2 nedeli\n\nChistota pomogaet predotvratit infekciyu! 🚿`,
    `Propustit dozu Amoksicillina byvaet -- ne panikujte, Amir. Menee 4 chasov: primite sejchas. Bolee 4 chasov: propustite i primite sleduyushchuyu dozu v obychnoe vremya. Nikogda ne dvojte dozu. Zavershite polnyj 7-dnevnyj kurs dazhe esli luchshe.`,
    `Na Den 2 dieta dolzhna byt lyogkoy, Amir:\n\n✅ Prozrachnye supy i bulon\n✅ Jogurt, kartofelnoe pyure, tost\n✅ Bolshe vody (8+ stakov)\n\n❌ Izbegajte zhirnoj, zharёnoj i ostroj edy. Bolshinstvo pacientov vozvrashchayutsya k normalnomu pitaniyu k Dnyu 7-10.`,
  ],
}
let demoIdx = 0

async function callClaude(messages, system, lang='en') {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system, messages }),
    })
    if (!res.ok) throw new Error('api error')
    const data = await res.json()
    return data.content?.[0]?.text || ''
  } catch {
    const responses = DEMO_RESPONSES[lang] || DEMO_RESPONSES.en
    const r = responses[demoIdx % responses.length]
    demoIdx++
    return r
  }
}

export default function AskRecap() {
  const { t, lang } = useLang()
  const p = patientData
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('ask_greeting').replace('{name}', p.name.split(' ')[0]) },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const langName = lang === 'uz' ? 'Uzbek' : lang === 'ru' ? 'Russian' : 'English'
  const system = `You are RECAP, a compassionate AI recovery assistant for post-surgical patients.
Patient: ${p.name}, ${p.age}y, ${patientData.gender?.en || patientData.gender}. Surgery: ${patientData.surgery.name?.en || patientData.surgery.name} on ${patientData.surgery.date}. Day ${patientData.dayOfRecovery} of recovery. Comorbidities: ${patientData.comorbidities?.en?.join(', ') || patientData.comorbidities?.join(', ')}.
Medications: ${patientData.medicines.map(m => m.name).join(', ')}.
IMPORTANT: Always respond in the same language the patient is using. If lang is 'uz' respond in Uzbek, if 'ru' respond in Russian, otherwise English. Always respond ONLY in ${langName}. Be warm, clear, specific to their surgery and day. Use their first name. Max 3-4 paragraphs. For urgent symptoms (high fever, severe pain, wound discharge) recommend calling 103 immediately.`

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const next = [...messages, { role: 'user', content: msg }]
    setMessages(next)
    setLoading(true)
    const reply = await callClaude(next.map(m => ({ role: m.role, content: m.content })), system, lang)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column', height:'100vh', paddingBottom:0 }}>
      <PageHeader
        title={t('ask_title')}
        subtitle={t('ask_sub')}
        backTo="/dashboard"
        rightEl={
          <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.2)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#059669', animation:'pulse 2s infinite' }} />
            <span style={{ color:'#059669', fontSize:'0.65rem', fontFamily:'Syne,sans-serif', fontWeight:700 }}>{t('ask_live')}</span>
          </div>
        }
      />

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 140px', maxWidth:560, margin:'0 auto', width:'100%' }}>
        {messages.length === 1 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:'0.7rem', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>{t('ask_quick')}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {(SUGGESTED[lang] || SUGGESTED.en).map(q => (
                <button key={q} onClick={() => send(q)} style={{ padding:'8px 12px', borderRadius:20, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', color:'#374151', fontSize:'0.75rem', cursor:'pointer', transition:'all 0.15s', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#1A73E8'; e.currentTarget.style.color='#1A73E8' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,0,0,0.1)'; e.currentTarget.style.color='#374151' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start', gap:8 }} className="animate-slide-up">
              {m.role === 'assistant' && (
                <div style={{ width:32, height:32, borderRadius:10, background:'rgba(26,115,232,0.1)', border:'1px solid rgba(26,115,232,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', flexShrink:0, alignSelf:'flex-end' }}>🤖</div>
              )}
              <div style={{
                maxWidth:'78%', padding:'12px 16px', borderRadius:18,
                background: m.role==='user' ? '#1A73E8' : '#fff',
                color: m.role==='user' ? '#fff' : '#111827',
                border: m.role==='user' ? 'none' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                borderBottomRightRadius: m.role==='user' ? 4 : 18,
                borderBottomLeftRadius: m.role==='assistant' ? 4 : 18,
              }}>
                <p style={{ fontSize:'0.85rem', lineHeight:1.65, margin:0, whiteSpace:'pre-wrap' }}>{m.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', gap:8 }} className="animate-fade-in">
              <div style={{ width:32, height:32, borderRadius:10, background:'rgba(26,115,232,0.1)', border:'1px solid rgba(26,115,232,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', flexShrink:0 }}>🤖</div>
              <div style={{ padding:'14px 16px', borderRadius:18, borderBottomLeftRadius:4, background:'#fff', border:'1px solid rgba(0,0,0,0.08)', display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#1A73E8', opacity:0.6, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ position:'fixed', bottom:64, left:0, right:0, padding:'12px 16px', background:'rgba(245,247,250,0.97)', backdropFilter:'blur(16px)', borderTop:'1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth:560, margin:'0 auto', display:'flex', gap:8 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={t('ask_placeholder')}
            rows={1}
            style={{ flex:1, resize:'none', maxHeight:90, overflowY:'auto', paddingRight:'0.75rem', fontSize:'0.88rem', lineHeight:'1.5' }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            style={{ width:44, height:44, borderRadius:12, border:'none', cursor: input.trim()&&!loading ? 'pointer' : 'not-allowed', background: input.trim()&&!loading ? '#1A73E8' : '#E5E7EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s', boxShadow: input.trim()&&!loading ? '0 2px 8px rgba(26,115,232,0.3)' : 'none' }}>
            <span style={{ color: input.trim()&&!loading ? '#fff' : '#9CA3AF', fontSize:'1rem', fontWeight:800 }}>↑</span>
          </button>
        </div>
        <div style={{ textAlign:'center', marginTop:5, fontSize:'0.62rem', color:'#9CA3AF' }}>{t('ask_disclaimer')}</div>
      </div>

      <BottomNav />
    </div>
  )
}
