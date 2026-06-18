import os

BASE = os.path.expanduser('~/recap2/src')

def patch(rel, old, new, label=''):
    path = os.path.join(BASE, rel)
    with open(path, encoding='utf-8') as f: c = f.read()
    if old in c:
        with open(path, 'w', encoding='utf-8') as f: f.write(c.replace(old, new, 1))
        print(f'  OK: {label}')
        return True
    print(f'  SKIP: {label}')
    return False

def add_keys(lang, keys):
    path = os.path.join(BASE, f'translations/{lang}.js')
    with open(path, encoding='utf-8') as f: c = f.read()
    c = c.rstrip().rstrip('}').rstrip() + ',\n' + keys + '\n}\n'
    with open(path, 'w', encoding='utf-8') as f: f.write(c)
    print(f'  Updated {lang}.js')

print('=== Translation keys ===')
add_keys('en', "  ci_pain_none2:'None', ci_pain_mild:'Mild', ci_pain_moderate:'Moderate', ci_pain_severe:'Severe',\n  ci_day_complete:'Day Complete', ci_nurse_name:'Aziza - RECAP Nurse',\n  prof_surgery:'Surgery', prof_rec_day:'Recovery Day', prof_last_checkin:'Last Check-In', prof_ward:'Ward',\n  prof_comorbidities:'Comorbidities', prof_complications:'Complications in Matched Population',\n  prof_milestones:'Expected Milestones for This Profile', prof_global_match:'Global Match Found',\n  prof_global_title:'Global Intelligence - Matched Profile', prof_score_title:'Recovery Score: This Patient vs Global Average',\n  prof_score_sub:'Lower score = better recovery. Dotted line = global average.',\n  prof_timing:'Timing:', prof_watch:'Watch for:', prof_risk_diabetes:'Risk: Diabetes',\n  hosp_status_urgent:'Urgent', hosp_status_watch:'Watch', hosp_status_stable:'Stable',\n  hosp_dashboard_label:'Hospital Dashboard', hosp_no_results:'No patients match your search',\n  land_number_confirmed:'Number confirmed', land_confirm_btn:'Confirm Number \u2713',\n  gl_layer:'Global Intelligence Layer', gl_patterns:'Recovery Patterns',\n  gl_dist_title:'Recovery Distribution by Day', gl_dist_sub:'Patient status across all tracked Lap. Cholecystectomy cases',\n  gl_comorbidity:'Comorbidity Pattern - Diabetes', gl_milestones:'Recovery Milestones',\n  gl_patients_tracked:'Patients Tracked', gl_countries:'Countries', gl_surgery_types:'Surgery Types',\n  gl_derived:'Derived from', gl_diabetic_patients:'diabetic patients',\n  ci_range_stable:'Stable (0)', ci_range_urgent:'Urgent (16)',\n  ana_stable_range:'Stable \u22644', ana_watch_range:'Watch 5-9', ana_urgent_range:'Urgent 10+',\n  ana_score_decreased:'decreased', ana_score_increased:'increased', ana_pts_since:'pts since Day 1',")

add_keys('uz', "  ci_pain_none2:\"Yo'q\", ci_pain_mild:'Engil', ci_pain_moderate:\"O'rtacha\", ci_pain_severe:'Kuchli',\n  ci_day_complete:'Kun yakunlandi', ci_nurse_name:'Aziza - RECAP Hamshira',\n  prof_surgery:'Operatsiya', prof_rec_day:'Tuzalish kuni', prof_last_checkin:'Oxirgi tekshiruv', prof_ward:'Palata',\n  prof_comorbidities:\"Qo'shimcha kasalliklar\", prof_complications:'Mos bemorlardagi asoratlar',\n  prof_milestones:'Kutilayotgan bosqichlar', prof_global_match:'Global moslik topildi',\n  prof_global_title:\"Global razvedka - Mos profil\", prof_score_title:\"Tuzalish bali: Bemor va global o'rtacha\",\n  prof_score_sub:\"Past ball = yaxshi tuzalish. Nuqtali chiziq = global o'rtacha.\",\n  prof_timing:'Vaqt:', prof_watch:'Kuzating:', prof_risk_diabetes:'Xavf: Diabet',\n  hosp_status_urgent:'Shoshilinch', hosp_status_watch:'Kuzatuv', hosp_status_stable:'Barqaror',\n  hosp_dashboard_label:'Kasalxona paneli', hosp_no_results:\"Qidiruv bo'yicha bemor topilmadi\",\n  land_number_confirmed:'Raqam tasdiqlandi', land_confirm_btn:\"Raqamni tasdiqlash \u2713\",\n  gl_layer:'Global razvedka qatlami', gl_patterns:'Tuzalish naqshlari',\n  gl_dist_title:\"Kunlar bo'yicha tuzalish taqsimoti\", gl_dist_sub:'Barcha kuzatilgan Lap. Xoletsistektomiya holatlari',\n  gl_comorbidity:\"Qo'shimcha kasallik naqshi - Diabet\", gl_milestones:'Tuzalish bosqichlari',\n  gl_patients_tracked:'Kuzatilgan bemorlar', gl_countries:'Mamlakatlar', gl_surgery_types:'Operatsiya turlari',\n  gl_derived:\"Ma'lumot asosi:\", gl_diabetic_patients:'ta diabetli bemor',\n  ci_range_stable:'Barqaror (0)', ci_range_urgent:'Shoshilinch (16)',\n  ana_stable_range:'Barqaror \u22644', ana_watch_range:'Kuzatuv 5-9', ana_urgent_range:'Shoshilinch 10+',\n  ana_score_decreased:'kamaydi', ana_score_increased:'oshdi', ana_pts_since:'ball 1-kundan beri',")

add_keys('ru', "  ci_pain_none2:'Net', ci_pain_mild:'Lyogkaya', ci_pain_moderate:'Umerennaya', ci_pain_severe:'Silnaya',\n  ci_day_complete:'Den zavershyon', ci_nurse_name:'Aziza - Medsestra RECAP',\n  prof_surgery:'Operaciya', prof_rec_day:'Den vyzdorovleniya', prof_last_checkin:'Posledniy osmotr', prof_ward:'Palata',\n  prof_comorbidities:'Komorbidnosti', prof_complications:'Oslozhneniya v sootvetstvuyushchey populyacii',\n  prof_milestones:'Ozhidaemye etapy dlya etogo profilya', prof_global_match:'Globalnoye sootvetstviye najdeno',\n  prof_global_title:'Globalnyj intellekt - Sootvetstvuyushchiy profil', prof_score_title:'Ball vyzdorovleniya: Pacient vs globalnyj sredniy',\n  prof_score_sub:'Nizhe ball = luchshe. Punktirnaya liniya = globalnyj sredniy.',\n  prof_timing:'Vremya:', prof_watch:'Sledite za:', prof_risk_diabetes:'Risk: Diabet',\n  hosp_status_urgent:'Srochno', hosp_status_watch:'Nablyudeniye', hosp_status_stable:'Stabilno',\n  hosp_dashboard_label:'Panel bolnicy', hosp_no_results:'Net pacientov sootvetstvuyushchikh poisku',\n  land_number_confirmed:'Nomer podtverzhdyon', land_confirm_btn:'Podtverdit nomer \u2713',\n  gl_layer:'Globalnyj intellekt', gl_patterns:'Patterny vyzdorovleniya',\n  gl_dist_title:'Raspredeleniye po dnyam', gl_dist_sub:'Status pacientov po vsem sluchayam Lap. Holecistektomii',\n  gl_comorbidity:'Pattern komorbidnosti - Diabet', gl_milestones:'Etapy vyzdorovleniya',\n  gl_patients_tracked:'Pacientov otslezheno', gl_countries:'Stran', gl_surgery_types:'Tipov operacij',\n  gl_derived:'Na osnove', gl_diabetic_patients:'diabeticheskikh pacientov',\n  ci_range_stable:'Stabilno (0)', ci_range_urgent:'Srochno (16)',\n  ana_stable_range:'Stabilno \u22644', ana_watch_range:'Nablyudeniye 5-9', ana_urgent_range:'Srochno 10+',\n  ana_score_decreased:'snizilsya', ana_score_increased:'vyros', ana_pts_since:'balla s Dnya 1',")

print('=== Page patches ===')
patch('pages/SurgeryInfo.jsx', "import { patientData } from '../data/mockData'", "import { patientData, getLocalizedPatientData } from '../data/mockData'", 'SurgeryInfo import')
patch('pages/SurgeryInfo.jsx', "  const { t } = useLang()\n  const { surgery, recoveryGuide } = patientData", "  const { t, lang } = useLang()\n  const { surgery, recoveryGuide } = getLocalizedPatientData(lang)", 'SurgeryInfo localize')
patch('pages/MedicineInfo.jsx', "  const { t } = useLang()\n  const { medicines } = patientData", "  const { t, lang } = useLang()\n  const { medicines } = getLocalizedPatientData(lang)", 'MedicineInfo localize')
patch('pages/FollowUpSchedule.jsx', "  const { t } = useLang()\n  const { followUps, surgeon, hospital, dayOfRecovery } = patientData", "  const { t, lang } = useLang()\n  const { followUps, surgeon, hospital, dayOfRecovery } = getLocalizedPatientData(lang)", 'FollowUpSchedule localize')
patch('pages/PatientDashboard.jsx', "import { patientData } from '../data/mockData'", "import { patientData, getLocalizedPatientData } from '../data/mockData'", 'PatientDashboard import')
patch('pages/PatientDashboard.jsx', "  const { t } = useLang()\n  const p = patientData", "  const { t, lang } = useLang()\n  const p = getLocalizedPatientData(lang)", 'PatientDashboard localize')
patch('pages/PatientLanding.jsx', "import { patientData } from '../data/mockData'", "import { patientData, getLocalizedPatientData } from '../data/mockData'", 'PatientLanding import')
patch('pages/PatientLanding.jsx', "  const { t } = useLang()\n  const [step, setStep] = useState('info')", "  const { t, lang } = useLang()\n  const [step, setStep] = useState('info')", 'PatientLanding lang')
patch('pages/PatientLanding.jsx', "  const p = patientData\n\n  const handleContinue", "  const p = getLocalizedPatientData(lang)\n\n  const handleContinue", 'PatientLanding localize')
patch('pages/PatientLanding.jsx', '                  Confirm Number \u2713', "{t('land_confirm_btn')}", 'Confirm button')
patch('pages/GlobalIntelligence.jsx', "import { globalPatterns } from '../data/mockData'", "import { globalPatterns, getLocalizedGlobalPatterns } from '../data/mockData'\nimport { useLang } from '../context/LanguageContext'", 'GlobalIntelligence import')
patch('pages/GlobalIntelligence.jsx', "  const navigate = useNavigate()\n  const gp = globalPatterns", "  const navigate = useNavigate()\n  const { t, lang } = useLang()\n  const gp = getLocalizedGlobalPatterns(lang)", 'GlobalIntelligence localize')
patch('pages/GlobalIntelligence.jsx', "{label:'Patients Tracked',value:gp.totalPatients.toLocaleString(),icon:'👥',color:'#6D28D9'},{label:'Countries',value:gp.countries,icon:'🌍',color:'#1A73E8'},{label:'Surgery Types',value:gp.surgeryTypes.length,icon:'⚕',color:'#059669'}", "{label:t('gl_patients_tracked'),value:gp.totalPatients.toLocaleString(),icon:'👥',color:'#6D28D9'},{label:t('gl_countries'),value:gp.countries,icon:'🌍',color:'#1A73E8'},{label:t('gl_surgery_types'),value:gp.surgeryTypes.length,icon:'⚕',color:'#059669'}", 'GL stat labels')
patch('pages/GlobalIntelligence.jsx', ">Recovery Patterns<", ">{t('gl_patterns')}<", 'GL Recovery Patterns')
patch('pages/GlobalIntelligence.jsx', ">Recovery Distribution by Day<", ">{t('gl_dist_title')}<", 'GL dist title')
patch('pages/GlobalIntelligence.jsx', ">Patient status across all tracked Lap. Cholecystectomy cases<", ">{t('gl_dist_sub')}<", 'GL dist sub')
patch('pages/GlobalIntelligence.jsx', ">Comorbidity Pattern -- Diabetes<", ">{t('gl_comorbidity')}<", 'GL comorbidity')
patch('pages/GlobalIntelligence.jsx', ">Recovery Milestones<", ">{t('gl_milestones')}<", 'GL milestones')
patch('pages/GlobalIntelligence.jsx', ">Global Intelligence Layer<", ">{t('gl_layer')}<", 'GL layer label')
patch('pages/HospitalDashboard.jsx', ">Hospital Dashboard<", ">{t('hosp_dashboard_label')}<", 'Hosp dashboard label')
patch('pages/HospitalDashboard.jsx', ">No patients match your search<", ">{t('hosp_no_results')}<", 'Hosp no results')
patch('pages/HospitalDashboard.jsx', "'🚨 Urgent' : p.status === 'attention' ? '⚠ Watch' : '✓ Stable'", "t('hosp_status_urgent') : p.status === 'attention' ? t('hosp_status_watch') : t('hosp_status_stable')", 'Hosp status labels')
patch('pages/CheckInResult.jsx', "Day Complete", "' ' + t('ci_day_complete')", 'CheckIn Day Complete')
patch('pages/CheckInResult.jsx', ">Stable (0)<", ">{t('ci_range_stable')}<", 'CI range stable')
patch('pages/CheckInResult.jsx', ">Urgent (16)<", ">{t('ci_range_urgent')}<", 'CI range urgent')
patch('pages/DailyCheckIn.jsx', "{[{r:[0,2],l:'None',e:'😊',c:'#059669'},{r:[3,4],l:'Mild',e:'😐',c:'#65A30D'},{r:[5,7],l:'Moderate',e:'😕',c:'#D97706'},{r:[8,10],l:'Severe',e:'😣',c:'#DC2626'}].map(chip=>{", "{[{r:[0,2],lk:'ci_pain_none2',e:'😊',c:'#059669'},{r:[3,4],lk:'ci_pain_mild',e:'😐',c:'#65A30D'},{r:[5,7],lk:'ci_pain_moderate',e:'😕',c:'#D97706'},{r:[8,10],lk:'ci_pain_severe',e:'😣',c:'#DC2626'}].map(chip=>{", 'Pain chips keys')
patch('pages/DailyCheckIn.jsx', "{chip.l}</div>", "{t(chip.lk)}</div>", 'Pain chip labels')
patch('pages/DailyCheckIn.jsx', ">Aziza - RECAP Nurse<", ">{t('ci_nurse_name')}<", 'Aziza nurse label')
patch('pages/RecoveryAnalytics.jsx', "Score {trend<=0?'decreased':'increased'} by {Math.abs(trend)} pts since Day 1", "Score {trend<=0?t('ana_score_decreased'):t('ana_score_increased')} by {Math.abs(trend)} {t('ana_pts_since')}", 'Analytics trend text')

print('\nAll done!')
