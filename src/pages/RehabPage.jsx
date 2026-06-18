import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import BottomNav from '../components/BottomNav'
import Aziza from '../components/Aziza'
import { useLang } from '../context/LanguageContext'
import { patientData } from '../data/mockData'

const TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    nameUz: 'Asosiy',
    nameRu: 'Базовый',
    price: '29,000 UZS',
    usd: '$2.27',
    duration: '4 weeks',
    durationUz: '4 hafta',
    durationRu: '4 недели',
    color: '#1A73E8',
    bg: 'rgba(26,115,232,0.07)',
    border: 'rgba(26,115,232,0.2)',
    features: [
      '12 guided exercise sessions',
      'Animated step-by-step instructions',
      'Daily 10-min routine',
      'Pain tracking before & after',
      'Completion log',
    ],
    featuresUz: [
      '12 ta yo\'naltirilgan mashq sessiyasi',
      'Animatsiyali bosqichma-bosqich ko\'rsatmalar',
      'Kunlik 10 daqiqalik mashg\'ulot',
      'Oldin va keyin og\'riqni kuzatish',
      'Bajarilish jurnali',
    ],
    featuresRu: [
      '12 управляемых сеансов упражнений',
      'Анимированные пошаговые инструкции',
      'Ежедневные 10-минутные упражнения',
      'Отслеживание боли до и после',
      'Журнал выполнения',
    ],
    icon: '🧘',
    popular: false,
  },
  {
    id: 'complete',
    name: 'Complete',
    nameUz: 'To\'liq',
    nameRu: 'Полный',
    price: '59,000 UZS',
    usd: '$4.61',
    duration: '8 weeks',
    durationUz: '8 hafta',
    durationRu: '8 недель',
    color: '#059669',
    bg: 'rgba(5,150,105,0.07)',
    border: 'rgba(5,150,105,0.2)',
    features: [
      'Everything in Basic',
      '28 progressive exercise sessions',
      'Surgery-specific exercise library',
      'Weekly difficulty progression',
      'Progress analytics chart',
      'Aziza daily coaching messages',
    ],
    featuresUz: [
      'Asosiydagi hamma narsa',
      '28 ta progressiv mashq sessiyasi',
      'Operatsiyaga xos mashqlar kutubxonasi',
      'Haftalik qiyinchilik progressi',
      'Jarayon tahlil grafigi',
      'Azizaning kunlik coaching xabarlari',
    ],
    featuresRu: [
      'Всё из Базового',
      '28 прогрессивных упражнений',
      'Библиотека упражнений для операции',
      'Еженедельное повышение сложности',
      'Аналитика прогресса',
      'Ежедневные сообщения Азизы',
    ],
    icon: '💪',
    popular: true,
  },
  {
    id: 'rehab_consult',
    name: 'Rehab + Consult',
    nameUz: 'Reabilitatsiya + Maslahat',
    nameRu: 'Реабилитация + Консультация',
    price: '99,000 UZS',
    usd: '$7.73',
    duration: '8 weeks + video physio',
    durationUz: '8 hafta + video fizioterapevt',
    durationRu: '8 недель + видео физиотерапевт',
    color: '#6D28D9',
    bg: 'rgba(109,40,217,0.07)',
    border: 'rgba(109,40,217,0.2)',
    features: [
      'Everything in Complete',
      '1-on-1 video physio session',
      'Personalised exercise prescription',
      'Direct physio messaging',
      'Certificate of completion',
    ],
    featuresUz: [
      'To\'liq paketdagi hamma narsa',
      '1 ta video fizioterapevt sessiyasi',
      'Shaxsiylashtirilgan mashq retsepti',
      'Fizioterapevt bilan to\'g\'ridan-to\'g\'ri muloqot',
      'Bajarilish sertifikati',
    ],
    featuresRu: [
      'Всё из Полного',
      '1 видеосессия с физиотерапевтом',
      'Персональное назначение упражнений',
      'Прямой чат с физиотерапевтом',
      'Сертификат о завершении',
    ],
    icon: '🩺',
    popular: false,
  },
]

// Post-cholecystectomy exercises
const EXERCISES = {
  basic: [
    { name:{en:'Deep Breathing',uz:'Chuqur nafas olish',ru:'Glubokoe dyhaniye'}, emoji:'🫁', duration:'5 min',
      desc:{en:'Slow diaphragmatic breathing to expand lungs and reduce gas pain from CO2',uz:"Diafragma bilan sekin nafas olish -- o'pka va CO2 gazidan qorin og'rig'ini kamaytiradi",ru:'Medlennoe diafragmalnoe dyhaniye dlya rasshireniya lyogkikh i snizheniya boli ot CO2'},
      days:{en:'Every day',uz:'Har kuni',ru:'Kazhdyy den'} },
    { name:{en:'Ankle Pumps',uz:'Tovon mashqi',ru:'Nasosy dlya lodyzhki'}, emoji:'🦶', duration:'3 min',
      desc:{en:'Flex and point feet repeatedly to prevent blood clots while resting',uz:'Dam olayotganda qon ivishining oldini olish uchun oyoqni qayta-qayta bukib yozing',ru:'Sgibajte i razgibajte stopy povtorno dlya profilaktiki tromboza vo vremya otdykha'},
      days:{en:'Every day',uz:'Har kuni',ru:'Kazhdyy den'} },
    { name:{en:'Gentle Walking',uz:'Yengil yurish',ru:'Lyogkaya khodba'}, emoji:'🚶', duration:'10 min',
      desc:{en:'Slow indoor walking to stimulate digestion and improve circulation',uz:"Hazm va qon aylanishini yaxshilash uchun uyda sekin yurish",ru:'Medlennaya khodba v pomeshchenii dlya stimulyacii pishchevareniya i krovoobrashcheniya'},
      days:{en:'Day 1-7',uz:'1-7 kun',ru:'Den 1-7'} },
    { name:{en:'Shoulder Rolls',uz:'Yelka aylanishi',ru:'Vrashcheniye plechami'}, emoji:'🤸', duration:'3 min',
      desc:{en:'Gentle shoulder circles to relieve referred shoulder pain from surgery gas',uz:"Jarrohlik gazidan yelka og'rig'ini kamaytirish uchun yengil yelka aylanishi",ru:'Legkie krugovye dvizheniya plechami dlya snyatiya otrazhonnoy boli ot gaza'},
      days:{en:'Day 2+',uz:'2-kundan',ru:'Den 2+'} },
  ],
  complete: [
    { name: 'Core Activation', emoji: '⚡', duration: '8 min', desc: 'Gentle pelvic tilts and lower ab engagement -- no sit-ups', days: 'Week 2' },
    { name: 'Posture Corrector', emoji: '🧍', duration: '5 min', desc: 'Wall standing and chin tucks to correct hunched post-op posture', days: 'Week 2+' },
    { name: 'Light Stretching', emoji: '🧘', duration: '10 min', desc: 'Full body gentle stretches focusing on tight abdominal fascia', days: 'Week 3' },
    { name: 'Walking Progression', emoji: '🏃', duration: '20 min', desc: 'Outdoor walking with gradual pace increase over 4 weeks', days: 'Week 2-4' },
  ],
}

function PaymentModal({ tier, onClose }) {
  const [step, setStep] = useState('choose') // choose | paying | success
  const [method, setMethod] = useState(null)

  const handlePay = () => {
    setStep('paying')
    setTimeout(() => setStep('success'), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: 24, paddingBottom: 40 }} className="animate-slide-up">

        {step === 'choose' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Complete Purchase</div>
              <div style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: 4 }}>{tier.name} · {tier.price} ({tier.usd})</div>
            </div>

            <div style={{ fontSize: '0.7rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Choose Payment Method</div>

            {[
              { id: 'click', name: 'Click', color: '#00A3FF', icon: '⚡', desc: 'Pay with Click Uzbekistan' },
              { id: 'payme', name: 'Payme', color: '#00C49F', icon: '💳', desc: 'Pay with Payme' },
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `2px solid ${method === m.id ? m.color : 'rgba(0,0,0,0.08)'}`, background: method === m.id ? `${m.color}08` : '#fff', cursor: 'pointer', marginBottom: 10, transition: 'all 0.2s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{m.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{m.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>{m.desc}</div>
                </div>
                {method === m.id && <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>✓</span></div>}
              </button>
            ))}

            <button onClick={handlePay} disabled={!method}
              className="btn-primary" style={{ width: '100%', marginTop: 8, opacity: method ? 1 : 0.4, fontSize: '0.95rem' }}>
              Pay {tier.price} →
            </button>
          </>
        )}

        {step === 'paying' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⏳</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#111827', marginBottom: 6 }}>{ t('rehab_processing')}</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{ t('rehab_wait')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A73E8', animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }} className="animate-scale-in">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(5,150,105,0.1)', border: '2px solid rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem' }}>✅</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#059669', fontSize: '1.2rem', marginBottom: 6 }}>{t('rehab_success')}</div>
            <div style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: 20 }}>{tier.name} plan activated · {tier.duration}</div>
            <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>{ t('rehab_start')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RehabPage() {
  const { lang } = useLang()
  const [selected, setSelected] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [purchased, setPurchased] = useState(null)
  const p = patientData

  const getName = (tier) => lang === 'uz' ? tier.nameUz : lang === 'ru' ? tier.nameRu : tier.name
  const getDuration = (tier) => lang === 'uz' ? tier.durationUz : lang === 'ru' ? tier.durationRu : tier.duration
  const getFeatures = (tier) => lang === 'uz' ? tier.featuresUz : lang === 'ru' ? tier.featuresRu : tier.features

  return (
    <div className="page">
      <PageHeader
        title={lang === 'uz' ? 'Reabilitatsiya' : lang === 'ru' ? 'Реабилитация' : 'Recovery Exercises'}
        subtitle={lang === 'uz' ? 'Xoletsistektomiyadan keyingi mashqlar' : lang === 'ru' ? 'Упражнения после холецистэктомии' : 'Post-cholecystectomy rehabilitation'}
        backTo="/dashboard"
      />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 0' }}>

        {/* Aziza welcome */}
        <Aziza context="rehab_welcome" data={{ name: p.name.split(' ')[0] }} />

        {/* Tier cards */}
        <div style={{ fontSize: '0.68rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          {lang === 'uz' ? 'PAKET TANLANG' : lang === 'ru' ? 'ВЫБЕРИТЕ ПАКЕТ' : 'CHOOSE YOUR PACKAGE'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {TIERS.map(tier => {
            const isSelected = selected === tier.id
            const isPurchased = purchased === tier.id
            return (
              <div key={tier.id}
                onClick={() => setSelected(isSelected ? null : tier.id)}
                style={{ background: '#fff', border: `2px solid ${isSelected ? tier.color : 'rgba(0,0,0,0.08)'}`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: isSelected ? `0 4px 20px ${tier.color}20` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>

                {/* Popular badge */}
                {tier.popular && (
                  <div style={{ background: tier.color, padding: '5px 0', textAlign: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '0.65rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.1em' }}>
                      ⭐ {lang === 'uz' ? 'ENG MASHHUR' : lang === 'ru' ? 'ПОПУЛЯРНЫЙ' : 'MOST POPULAR'}
                    </span>
                  </div>
                )}

                <div style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: tier.bg, border: `1px solid ${tier.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{tier.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#111827', fontSize: '1rem' }}>{getName(tier)}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>{getDuration(tier)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, color: tier.color, fontSize: '1rem' }}>{tier.price}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>{tier.usd}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="animate-slide-up">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                        {getFeatures(tier).map((f, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: tier.bg, border: `1px solid ${tier.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <span style={{ color: tier.color, fontSize: '0.6rem', fontWeight: 800 }}>✓</span>
                            </div>
                            <span style={{ color: '#374151', fontSize: '0.8rem', lineHeight: 1.5 }}>{f}</span>
                          </div>
                        ))}
                      </div>

                      {isPurchased ? (
                        <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', textAlign: 'center' }}>
                          <span style={{ color: '#059669', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>✅ Activated · {getDuration(tier)}</span>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); setShowPayment(tier) }}
                          style={{ width: '100%', padding: '12px', borderRadius: 12, background: tier.color, color: '#fff', border: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', boxShadow: `0 2px 8px ${tier.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span>⚡</span>
                          {lang === 'uz' ? 'Click/Payme orqali to\'lash' : lang === 'ru' ? 'Оплатить через Click/Payme' : 'Pay with Click / Payme'}
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  )}

                  {!isSelected && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                        {lang === 'uz' ? 'Ko\'rish uchun bosing' : lang === 'ru' ? 'Нажмите, чтобы посмотреть' : 'Tap to see details'}
                      </span>
                      <span style={{ color: tier.color, fontSize: '0.85rem' }}>↓</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sample exercises */}
        <div style={{ fontSize: '0.68rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          {lang === 'uz' ? 'NAMUNAVIY MASHQLAR' : lang === 'ru' ? 'ПРИМЕР УПРАЖНЕНИЙ' : 'SAMPLE EXERCISES'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {EXERCISES.basic.map((ex, i) => (
            <div key={i} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(26,115,232,0.07)', border: '1px solid rgba(26,115,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{ex.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#111827', fontSize: '0.85rem' }}>{ex.name[lang]||ex.name.en}</span>
                  <span style={{ fontSize: '0.68rem', color: '#1A73E8', fontFamily: 'Syne, sans-serif', fontWeight: 700, background: 'rgba(26,115,232,0.08)', border: '1px solid rgba(26,115,232,0.15)', padding: '2px 7px', borderRadius: 99 }}>{ex.duration}</span>
                </div>
                <div style={{ color: '#6B7280', fontSize: '0.75rem', lineHeight: 1.5 }}>{ex.desc[lang]||ex.desc.en}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.65rem', marginTop: 3 }}>📅 {ex.days[lang]||ex.days.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="card" style={{ padding: 14, marginBottom: 16, borderColor: 'rgba(180,83,9,0.2)', background: 'rgba(180,83,9,0.04)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ color: '#6B7280', fontSize: '0.76rem', lineHeight: 1.6, margin: 0 }}>
              {lang === 'uz'
                ? 'Mashqlarni boshlashdan oldin shifokoringiz yoki BSMI fizioterapevti bilan maslahatlashing. Og\'riq kuchaysa darhol to\'xtating.'
                : lang === 'ru'
                ? 'Перед началом упражнений проконсультируйтесь с врачом или физиотерапевтом BSMI. При усилении боли немедленно прекратите.'
                : 'These exercises have been designed with post-cholecystectomy recovery in mind. Always consult your surgeon before starting. Stop immediately if pain worsens.'}
            </p>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <PaymentModal
          tier={showPayment}
          onClose={() => {
            setPurchased(showPayment.id)
            setShowPayment(false)
          }}
        />
      )}

      <BottomNav />
    </div>
  )
}
