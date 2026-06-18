import { Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider, useLang } from './context/LanguageContext'
import Aziza, { getPageMessage } from './components/Aziza'
import { patientData } from './data/mockData'
import { getCachedPatient } from './lib/patientSession'
import PatientLanding from './pages/PatientLanding'
import PatientDashboard from './pages/PatientDashboard'
import SurgeryInfo from './pages/SurgeryInfo'
import MedicineInfo from './pages/MedicineInfo'
import DailyCheckIn from './pages/DailyCheckIn'
import CheckInResult from './pages/CheckInResult'
import RecoveryAnalytics from './pages/RecoveryAnalytics'
import FollowUpSchedule from './pages/FollowUpSchedule'
import AskRecap from './pages/AskRecap'
import HospitalDashboard from './pages/HospitalDashboard'
import PatientProfile from './pages/PatientProfile'
import GlobalIntelligence from './pages/GlobalIntelligence'
import DischargeUpload from './pages/DischargeUpload'
import QRPage from './pages/QRPage'
import RehabPage from './pages/RehabPage'
import PatientRegister from './pages/PatientRegister'
import AuthGate from './components/AuthGate'

// Pages where the floating Aziza should NOT appear
const HIDE_AZIZA = ['/', '/hospital', '/global', '/upload', '/qr', '/register']

const PAGE_MESSAGES = {
  en: {
    '/dashboard':      (n,d) => d<=3 ? 'Welcome home, '+n+'! Your first days of recovery are the most important. I am here every day for you!' : d<=7 ? n+', you are doing great! Most patients feel better around Day 5 to 7. Keep taking your medications on time.' : 'Almost there, '+n+'! Your body has come so far. Keep walking a little more each day.',
    '/checkin':        (n)   => 'Hi '+n+'! Answer each question honestly - even small changes help me track your recovery accurately. I am right here with you!',
    '/surgery':        (n)   => n+', understanding your surgery helps you heal better. Every question is a good question - tap Ask RECAP anytime!',
    '/medicines':      (n)   => 'Never skip your medications, '+n+'. Your antibiotics especially must be completed fully - even when you feel better!',
    '/analytics':      (n)   => n+', your recovery graph shows your healing journey. Each check-in you complete makes this more accurate.',
    '/followup':       (n)   => 'These appointments are very important, '+n+'. Your surgeon needs to check your wound and review your progress in person.',
    '/rehab':          (n)   => 'Ready to start your rehabilitation, '+n+'? These exercises are designed specifically for your cholecystectomy recovery. Start slow!',
    '/ask':            (n)   => 'Hi '+n+'! I am here to help 24/7. Ask me anything about your recovery, medications, or how you are feeling.',
  },
  uz: {
    '/dashboard':      (n,d) => d<=3 ? 'Xush kelibsiz, '+n+'! Dastlabki kunlar eng muhim. Men har kuni siz bilan bolaman!' : d<=7 ? n+', juda yaxshi! 5-7 kunda yaxshilanadi. Dorilarni vaqtida qabul qiling.' : 'Deyarli yetib keldingiz, '+n+'! Har kuni bir oz koprok yuring.',
    '/checkin':        (n)   => 'Salom '+n+'! Har bir savolga halol javob bering - hatto kichik ozgarishlar ham tuzalishingizni kuzatishga yordam beradi!',
    '/surgery':        (n)   => n+', operatsiyangizni tushunish yaxshiroq tuzalishga yordam beradi.',
    '/medicines':      (n)   => 'Dorilarni otkazib yubormang, '+n+'. Antibiotikni albatta toliq tugatish kerak!',
    '/analytics':      (n)   => n+', tuzalish grafigingiz davolash jarayoningizni korsatadi.',
    '/followup':       (n)   => 'Bu uchrashuvlar juda muhim, '+n+'. Jarrohingiz yarangizni va jarayoningizni korishi kerak.',
    '/rehab':          (n)   => 'Reabilitatsiyaga tayyormisiz, '+n+'? Bu mashqlar siz uchun maxsus!',
    '/ask':            (n)   => 'Salom '+n+'! Men 24/7 yordam berishga tayyorman.',
  },
  ru: {
    '/dashboard':      (n,d) => d<=3 ? 'Dobro pozhalovat domoj, '+n+'! Pervye dni samye vazhnye. Ya zdes kazhdyj den!' : d<=7 ? n+', vsyo horosho! Bolshinstvo pacientov chuvstvuyut uluchsheniye k 5-7 dnyu.' : 'Pochti u celi, '+n+'! Prodolzhajte hodit bolshe kazhdyj den.',
    '/checkin':        (n)   => 'Privet '+n+'! Otvechajte chestno - dazhe nebolshiye izmeneniya pomogayut mne otslezhat vashe vyzdorovleniye!',
    '/surgery':        (n)   => n+', ponimaniye svoej operacii pomogaet luchshe vyzdoravlivat.',
    '/medicines':      (n)   => 'Ne propuskajte lekarstva, '+n+'. Antibiotiki osobenno vazhno zavershit polnostyu!',
    '/analytics':      (n)   => n+', vash grafik pokazyvaet put vyzdorovleniya.',
    '/followup':       (n)   => 'Eti vizity ochen vazhny, '+n+'. Vash hirurg dolzhen proverit ranu i progress.',
    '/rehab':          (n)   => 'Gotovy k reabilitacii, '+n+'? Uprazhneniya razrabotany specialno dlya vas!',
    '/ask':            (n)   => 'Privet '+n+'! Ya zdes 24/7. Zadavajte lyuboj vopros o vyzdorovlenii.',
  },
}

// Result messages based on actual check-in score
function getResultMessage(lang, name) {
  const checkins = JSON.parse(localStorage.getItem('recap_checkins') || '[]')
  const last = checkins.length > 0 ? checkins[checkins.length - 1] : null
  const score = last?.score ?? 0
  const st = score <= 4 ? 'stable' : score <= 9 ? 'attention' : 'urgent'

  const msgs = {
    en: {
      stable:    'Wonderful news, '+name+'! Your score shows you are recovering well. Keep following your routine and I will see you tomorrow!',
      attention: 'I see a few things that need monitoring, '+name+'. Do not worry - your care team has been notified. Rest well today.',
      urgent:    'I am very concerned about your answers today, '+name+'. Please contact the hospital RIGHT AWAY. Do not wait - your safety comes first.',
    },
    uz: {
      stable:    'Ajoyib xabar, '+name+'! Tuzalish yaxshi ketmoqda. Rejimingizni davom ettiring!',
      attention: 'Bir nechta kuzatish kerak bolgan holatni kormoqdaman, '+name+'. Tibbiy jamoa xabardor qilindi. Bugun yaxshi dam oling.',
      urgent:    'Bugungi javoblaringiz meni juda tashvishlandirdi, '+name+'. DARHOL kasalxona bilan bogling. Kutmang.',
    },
    ru: {
      stable:    'Prekrasno, '+name+'! Vash ball pokazyvaet chto vyzdorovleniye idyot horosho. Prodolzhajte!',
      attention: 'Vizhu neskolko momentov, '+name+'. Vasha komanda uvedomlena. Horosho otdohnite segodnya.',
      urgent:    'Ya ochen bespokoyus o vashih otvetah, '+name+'. NEMEDLENNO svyazhites s bolnicey. Ne zhdite.',
    },
  }
  return (msgs[lang] || msgs.en)[st]
}

function GlobalAziza() {
  const location = useLocation()
  const { lang } = useLang()
  const pilot = getCachedPatient()
  const name = (pilot ? pilot.name : patientData.name).split(' ')[0]
  const day = pilot ? Math.max(Math.floor((new Date() - new Date(pilot.discharge_date))/(86400000)),1) : patientData.dayOfRecovery

  if (HIDE_AZIZA.includes(location.pathname)) return null

  let message = ''

  if (location.pathname === '/checkin/result') {
    message = getResultMessage(lang, name)
  } else {
    const msgs = PAGE_MESSAGES[lang] || PAGE_MESSAGES.en
    const fn = msgs[location.pathname]
    if (!fn) return null
    message = fn(name, day)
  }

  if (!message) return null
  return <Aziza presetMessage={message} />
}

export default function App() {
  return (
    <AuthGate><LanguageProvider>
      <GlobalAziza />
      <Routes>
        <Route path="/" element={<PatientLanding />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/surgery" element={<SurgeryInfo />} />
        <Route path="/medicines" element={<MedicineInfo />} />
        <Route path="/checkin" element={<DailyCheckIn />} />
        <Route path="/checkin/result" element={<CheckInResult />} />
        <Route path="/analytics" element={<RecoveryAnalytics />} />
        <Route path="/followup" element={<FollowUpSchedule />} />
        <Route path="/ask" element={<AskRecap />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/hospital/patient/:id" element={<PatientProfile />} />
        <Route path="/global" element={<GlobalIntelligence />} />
        <Route path="/upload" element={<DischargeUpload />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="/rehab" element={<RehabPage />} />
        <Route path="/register" element={<PatientRegister />} />
      </Routes>
    </LanguageProvider></AuthGate>
  )
}
