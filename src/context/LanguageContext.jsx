import { createContext, useContext, useState } from 'react'
import en from '../translations/en'
import uz from '../translations/uz'
import ru from '../translations/ru'

const strings = { en, uz, ru }
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => strings[lang]?.[key] ?? strings.en[key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

export function LangPicker({ className }) {
  const { lang, setLang, t } = useLang()
  return (
    <div className={className || ''} style={{ display:'flex', gap:4 }}>
      {['en','uz','ru'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding:'4px 10px', borderRadius:8, fontSize:'0.72rem',
          fontFamily:'Syne,sans-serif', fontWeight:700,
          border: lang===l ? '1px solid #1A73E8' : '1px solid rgba(0,0,0,0.1)',
          background: lang===l ? '#1A73E8' : 'transparent',
          color: lang===l ? '#fff' : '#6B7280',
          cursor:'pointer', transition:'all 0.15s',
        }}>{t('lang_'+l)}</button>
      ))}
    </div>
  )
}
