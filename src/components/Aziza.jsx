import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

const PAGE_MESSAGES = {
  en: {
    '/dashboard':      (n,d) => d<=3 ? 'Welcome home, '+n+'! Your first days of recovery are the most important. I am here every day for you!' : d<=7 ? n+', you are doing great! Most patients feel better around Day 5 to 7. Keep taking your medications on time.' : 'Almost there, '+n+'! Your body has come so far. Keep walking a little more each day.',
    '/surgery':        (n)   => n+', understanding your surgery helps you heal better. Every question is a good question - tap Ask RECAP anytime!',
    '/medicines':      (n)   => 'Never skip your medications, '+n+'. Your antibiotics especially must be completed fully - even when you feel better!',
    '/analytics':      (n)   => n+', your recovery graph shows your healing journey. Each check-in you complete makes this more accurate.',
    '/followup':       (n)   => 'These appointments are very important, '+n+'. Your surgeon needs to check your wound and review your progress.',
    '/rehab':          (n)   => 'Ready to start your rehabilitation, '+n+'? These exercises are designed specifically for your cholecystectomy recovery. Start slow!',
    '/checkin/result': (n)   => 'Well done for completing your check-in today, '+n+'! Consistent daily check-ins are the key to a safe recovery.',
    '/ask':            (n)   => 'Hi '+n+'! I am here to help 24/7. Ask me anything about your recovery, medications, or how you are feeling.',
  },
  uz: {
    '/dashboard':      (n,d) => d<=3 ? 'Xush kelibsiz, '+n+'! Dastlabki kunlar eng muhim. Men har kuni siz bilan bolaman!' : d<=7 ? n+', juda yaxshi! 5-7 kunda yaxshilanadi. Dorilarni vaqtida qabul qiling.' : 'Deyarli yetib keldingiz, '+n+'! Har kuni bir oz koprok yuring.',
    '/surgery':        (n)   => n+', operatsiyangizni tushunish yaxshiroq tuzalishga yordam beradi. Har qanday savol yaxshi savol!',
    '/medicines':      (n)   => 'Dorilarni otkazib yubormang, '+n+'. Antibiotikni albatta toliq tugatish kerak!',
    '/analytics':      (n)   => n+', tuzalish grafigingiz davolash jarayoningizni korsatadi.',
    '/followup':       (n)   => 'Bu uchrashuvlar juda muhim, '+n+'. Jarrohingiz yarangizni va jarayoningizni korishi kerak.',
    '/rehab':          (n)   => 'Reabilitatsiyaga tayyormisiz, '+n+'? Bu mashqlar siz uchun maxsus!',
    '/checkin/result': (n)   => 'Bugungi tekshiruvni yakunlaganingiz uchun rahmat, '+n+'!',
    '/ask':            (n)   => 'Salom '+n+'! Men 24/7 yordam berishga tayyorman. Tuzalish haqida istalgan narsani soring.',
  },
  ru: {
    '/dashboard':      (n,d) => d<=3 ? 'Dobro pozhalovat domoj, '+n+'! Pervye dni samye vazhnye. Ya zdes kazhdyj den!' : d<=7 ? n+', vsyo horosho! Bolshinstvo pacientov chuvstvuyut uluchsheniye k 5-7 dnyu.' : 'Pochti u celi, '+n+'! Prodolzhajte hodit bolshe kazhdyj den.',
    '/surgery':        (n)   => n+', ponimaniye svoej operacii pomogaet luchshe vyzdoravlivat.',
    '/medicines':      (n)   => 'Ne propuskajte lekarstva, '+n+'. Antibiotiki osobenno vazhno zavershit polnostyu!',
    '/analytics':      (n)   => n+', vash grafik pokazyvaet put vyzdorovleniya.',
    '/followup':       (n)   => 'Eti vizity ochen vazhny, '+n+'. Vash hirurg dolzhen proverit ranu i progress.',
    '/rehab':          (n)   => 'Gotovy k reabilitacii, '+n+'? Uprazhneniya razrabotany specialno dlya vas!',
    '/checkin/result': (n)   => 'Molodec za zavershenie osmotra segodnya, '+n+'!',
    '/ask':            (n)   => 'Privet '+n+'! Ya zdes 24/7. Zadavajte lyuboj vopros o vyzdorovlenii.',
  },
}

export function getPageMessage(pathname, lang, name, day) {
  const msgs = PAGE_MESSAGES[lang] || PAGE_MESSAGES.en
  const fn = msgs[pathname]
  if (!fn) return ''
  return fn(name, day)
}

function AzizaFace({ size = 56 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2.5px solid #1A73E8', boxShadow:'0 3px 14px rgba(26,115,232,0.3)', background:'#DBEAFE' }}>
      <img
        src="/aziza.jpg"
        alt="Aziza"
        style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }}
        onError={e => {
          e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#DBEAFE,#EDE9FE);font-size:'+Math.round(size*0.5)+'px">&#128105;&#8205;&#9877;&#65039;</div>'
        }}
      />
    </div>
  )
}

export default function Aziza({ presetMessage, compact }) {
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const message = presetMessage || ''

  useEffect(() => {
    setDismissed(false)
    setVisible(false)
    setBubbleOpen(true)
    if (!message) return
    const t = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(t)
  }, [message])

  if (!message || dismissed) return null

  return (
    <>
      <style>{`
        @keyframes azizaBounce { 0%{transform:translateY(80px) scale(0.7);opacity:0} 55%{transform:translateY(-10px) scale(1.05);opacity:1} 75%{transform:translateY(4px) scale(0.98)} 100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes bubblePop { 0%{transform:scale(0.6);opacity:0;transform-origin:bottom right} 65%{transform:scale(1.06);opacity:1;transform-origin:bottom right} 100%{transform:scale(1);opacity:1} }
        @keyframes gentleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
      <div style={{ position:'fixed', bottom: compact ? 72 : 86, right:'max(10px, calc((100vw - 480px) / 2 + 10px))', zIndex:999, display:visible?'flex':'none', flexDirection:'column', alignItems:'flex-end', animation:visible?'azizaBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards':'none', pointerEvents:'none' }}>
        {bubbleOpen && (
          <div style={{ animation:'bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards', marginBottom:6, pointerEvents:'all' }}>
            <div style={{ background:'white', borderRadius:'14px 14px 4px 14px', padding:'11px 13px', boxShadow:'0 8px 28px rgba(0,0,0,0.13)', border:'1.5px solid rgba(26,115,232,0.2)', maxWidth:210, position:'relative' }}>
              <p style={{ fontSize:'0.77rem', color:'#111827', lineHeight:1.6, margin:'0 0 6px', fontFamily:'Sora,sans-serif' }}>{message}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'0.58rem', color:'#1A73E8', fontFamily:'Syne,sans-serif', fontWeight:700 }}>Aziza - RECAP Nurse</span>
                <button onClick={() => setDismissed(true)} style={{ background:'rgba(0,0,0,0.08)', border:'none', borderRadius:'50%', width:16, height:16, cursor:'pointer', fontSize:'0.55rem', color:'#6B7280', pointerEvents:'all', marginLeft:6, display:'flex', alignItems:'center', justifyContent:'center' }}>x</button>
              </div>
              <div style={{ position:'absolute', bottom:-7, right:20, width:0, height:0, borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderTop:'7px solid white' }} />
            </div>
          </div>
        )}
        <div style={{ animation:bubbleOpen?'gentleFloat 3s ease-in-out infinite':'none', pointerEvents:'all', cursor:'pointer', alignSelf:'flex-end' }} onClick={() => setBubbleOpen(v => !v)}>
          <AzizaFace size={compact ? 52 : 62} />
        </div>
      </div>
    </>
  )
}

export function AzizaFaceExport({ size }) { return null }
