import os, re

BASE = os.path.expanduser('~/recap2/src')

# ── 1. New keys to add to each translation file ──────────────────────────────
new_keys = {
'en': """
  ci_range_stable: 'Stable (0)', ci_range_urgent: 'Urgent (16)',
  ci_nurse_label: 'Aziza - RECAP Nurse',
  up_title: 'Upload Discharge Sheet',
  up_drag: 'Drag & drop or click \u00b7 JPG, PNG, WEBP, PDF',
  up_choose: 'Choose File',
  up_tip: 'Best results: Well-lit, straight-on photo. Supports English, Russian, and Uzbek discharge sheets.',
  gl_patterns: 'Recovery Patterns',
  gl_dist_title: 'Recovery Distribution by Day',
  gl_dist_sub: 'Patient status across all tracked Lap. Cholecystectomy cases',
  gl_comorbidity: 'Comorbidity Pattern \u2014 Diabetes',
  gl_milestones: 'Recovery Milestones',
  hosp_dashboard_label: 'Hospital Dashboard',
  hosp_no_results: 'No patients match your search',
  land_confirmed: 'Number confirmed',
  prof_title: 'Patient Profile',
  prof_global_match: 'Global Match Found',
  prof_global_title: 'Global Intelligence \u2014 Matched Profile',
  prof_score_title: 'Recovery Score: This Patient vs Global Average',
  prof_score_sub: 'Lower score = better recovery. Dotted line = global average for matched profile.',
  prof_timing: 'Timing:', prof_watch: 'Watch for:',
  ana_score_label: 'Score:', ana_missed_meds: 'missed meds',
  rehab_processing: 'Processing payment\u2026', rehab_wait: 'Please wait',
  rehab_success: 'Payment Successful!', rehab_start: 'Start My Rehab \u2192',
  surg_hospital_name: 'Republican Clinical Hospital',
  surg_emergency_call: 'Emergency: 103',
""",
'uz': """
  ci_range_stable: 'Barqaror (0)', ci_range_urgent: 'Shoshilinch (16)',
  ci_nurse_label: 'Aziza - RECAP Hamshira',
  up_title: 'Chiqish varaqasini yuklash',
  up_drag: 'Sudrab tashlang yoki bosing \u00b7 JPG, PNG, WEBP, PDF',
  up_choose: 'Fayl tanlash',
  up_tip: "Eng yaxshi natija: Yoru\u0121' joydagi tekis surat. Ingliz, Rus va O'zbek varaqlari qo'llab-quvvatlanadi.",
  gl_patterns: 'Tuzalish naqshlari',
  gl_dist_title: "Kunlar bo'yicha tuzalish taqsimoti",
  gl_dist_sub: "Barcha kuzatilgan Lap. Xoletsistektomiya holatlari bo'yicha bemor holati",
  gl_comorbidity: "Qo'shimcha kasallik naqshi \u2014 Diabet",
  gl_milestones: 'Tuzalish bosqichlari',
  hosp_dashboard_label: 'Kasalxona paneli',
  hosp_no_results: "Qidiruv bo'yicha bemor topilmadi",
  land_confirmed: 'Raqam tasdiqlandi',
  prof_title: 'Bemor profili',
  prof_global_match: 'Global moslik topildi',
  prof_global_title: 'Global razvedka \u2014 Mos profil',
  prof_score_title: "Tuzalish bali: Ushbu bemor va global o'rtacha",
  prof_score_sub: "Past ball = yaxshi tuzalish. Nuqtali chiziq = global o'rtacha.",
  prof_timing: 'Vaqt:', prof_watch: 'Kuzating:',
  ana_score_label: 'Ball:', ana_missed_meds: "o'tkazilgan dorilar",
  rehab_processing: 'To\u02bclov amalga oshirilmoqda\u2026', rehab_wait: 'Iltimos kuting',
  rehab_success: 'To\u02bclov muvaffaqiyatli!', rehab_start: 'Reabilitatsiyani boshlash \u2192',
  surg_hospital_name: 'Respublika klinik kasalxonasi',
  surg_emergency_call: 'Tez yordam: 103',
""",
'ru': """
  ci_range_stable: 'Stabilno (0)', ci_range_urgent: 'Srochno (16)',
  ci_nurse_label: 'Aziza - Medsestra RECAP',
  up_title: 'Zagruzit vypisku',
  up_drag: 'Peretatshite ili kliknite \u00b7 JPG, PNG, WEBP, PDF',
  up_choose: 'Vybrat fajl',
  up_tip: 'Luchshij rezultat: Horoshee osveshcheniye, pryamoj ugol. Podderzhivayutsya RU i UZ vypiska.',
  gl_patterns: 'Patterny vyzdorovleniya',
  gl_dist_title: 'Raspredeleniye po dnyam',
  gl_dist_sub: 'Status pacientov po vsem sluchayam Lap. Holecistektomii',
  gl_comorbidity: 'Pattern komorbidnosti \u2014 Diabet',
  gl_milestones: 'Etapy vyzdorovleniya',
  hosp_dashboard_label: 'Panel bolnicy',
  hosp_no_results: 'Net pacientov sootvetstvuyushchih poisku',
  land_confirmed: 'Nomer podtverzhdyon',
  prof_title: 'Profil pacienta',
  prof_global_match: 'Globalnoye sootvetstviye najdeno',
  prof_global_title: 'Globalnyj intellekt \u2014 Sootvetstvuyushchij profil',
  prof_score_title: 'Ball vyzdorovleniya: Etot pacient vs globalnyj srednij',
  prof_score_sub: 'Nizhe ball = luchshe. Punktirnaya liniya = globalnyj srednij.',
  prof_timing: 'Vremya:', prof_watch: 'Sledite za:',
  ana_score_label: 'Ball:', ana_missed_meds: 'propushcheno lekarstv',
  rehab_processing: 'Obrabotka platezha\u2026', rehab_wait: 'Pozhalujsta podozhdite',
  rehab_success: 'Platezh uspeshen!', rehab_start: 'Nachat reabilitaciyu \u2192',
  surg_hospital_name: 'Respublikanskaya klinicheskaya bolnica',
  surg_emergency_call: 'Skoraya: 103',
"""
}

# ── 2. Page string replacements [file, old, new] ──────────────────────────────
replacements = [
  # CheckInResult
  ['pages/CheckInResult.jsx', '>Stable (0)<', ">{t('ci_range_stable')}<"],
  ['pages/CheckInResult.jsx', '>Urgent (16)<', ">{t('ci_range_urgent')}<"],
  # DailyCheckIn
  ['pages/DailyCheckIn.jsx', '>Aziza - RECAP Nurse<', ">{t('ci_nurse_label')}<"],
  # DischargeUpload
  ['pages/DischargeUpload.jsx', '>Upload Discharge Sheet<', ">{t('up_title')}<"],
  ['pages/DischargeUpload.jsx', '>Drag & drop or click \u00b7 JPG, PNG, WEBP, PDF<', ">{t('up_drag')}<"],
  ['pages/DischargeUpload.jsx', '>Choose File<', ">{t('up_choose')}<"],
  ['pages/DischargeUpload.jsx',
   '\ud83d\udca1 <strong>Best results:</strong> Well-lit, straight-on photo. Supports English, Russian, and Uzbek discharge sheets.',
   "{t('up_tip')}"],
  # GlobalIntelligence
  ['pages/GlobalIntelligence.jsx', '>Recovery Patterns<', ">{t('gl_patterns')}<"],
  ['pages/GlobalIntelligence.jsx', '>Recovery Distribution by Day<', ">{t('gl_dist_title')}<"],
  ['pages/GlobalIntelligence.jsx',
   '>Patient status across all tracked Lap. Cholecystectomy cases<',
   ">{t('gl_dist_sub')}<"],
  ['pages/GlobalIntelligence.jsx',
   '>Comorbidity Pattern -- Diabetes<',
   ">{t('gl_comorbidity')}<"],
  ['pages/GlobalIntelligence.jsx', '>Recovery Milestones<', ">{t('gl_milestones')}<"],
  # HospitalDashboard
  ['pages/HospitalDashboard.jsx', '>Hospital Dashboard<', ">{t('hosp_dashboard_label')}<"],
  ['pages/HospitalDashboard.jsx',
   '>No patients match your search<',
   ">{t('hosp_no_results')}<"],
  # PatientLanding
  ['pages/PatientLanding.jsx', '>Number confirmed<', ">{t('land_confirmed')}<"],
  # PatientProfile
  ['pages/PatientProfile.jsx', '>Patient Profile<', ">{t('prof_title')}<"],
  ['pages/PatientProfile.jsx', '>Global Match Found<', ">{t('prof_global_match')}<"],
  ['pages/PatientProfile.jsx',
   '>Global Intelligence -- Matched Profile<',
   ">{t('prof_global_title')}<"],
  ['pages/PatientProfile.jsx',
   '>Recovery Score: This Patient vs Global Average<',
   ">{t('prof_score_title')}<"],
  ['pages/PatientProfile.jsx',
   '>Lower score = better recovery. Dotted line = global average for matched profile.<',
   ">{t('prof_score_sub')}<"],
  ['pages/PatientProfile.jsx',
   "<span style={{ color:'#9CA3AF' }}>Timing: </span>",
   "<span style={{ color:'#9CA3AF' }}>{t('prof_timing')} </span>"],
  ['pages/PatientProfile.jsx',
   "<span style={{ color:'#9CA3AF' }}>Watch for: </span>",
   "<span style={{ color:'#9CA3AF' }}>{t('prof_watch')} </span>"],
  # RecoveryAnalytics
  ['pages/RecoveryAnalytics.jsx', '>Score: {d?.score}<', ">{t('ana_score_label')} {d?.score}<"],
  ['pages/RecoveryAnalytics.jsx',
   "' \u00b7 \u26a0 missed meds'",
   "' \u00b7 \u26a0 ' + t('ana_missed_meds')"],
  # RehabPage
  ['pages/RehabPage.jsx', '>Processing payment\u2026<', ">{t('rehab_processing')}<"],
  ['pages/RehabPage.jsx', '>Please wait<', ">{t('rehab_wait')}<"],
  ['pages/RehabPage.jsx', '>Payment Successful!<', ">{t('rehab_success')}<"],
  ['pages/RehabPage.jsx', '>Start My Rehab \u2192<', ">{t('rehab_start')}<"],
  # SurgeryInfo
  ['pages/SurgeryInfo.jsx', '>Republican Clinical Hospital<', ">{t('surg_hospital_name')}<"],
  ['pages/SurgeryInfo.jsx', '>Emergency: 103<', ">{t('surg_emergency_call')}<"],
]

# ── 3. Apply translation file additions ───────────────────────────────────────
for lang, keys in new_keys.items():
  path = os.path.join(BASE, 'translations', f'{lang}.js')
  with open(path, 'r') as f:
    content = f.read()
  # Insert before closing }
  content = content.rstrip()
  if not content.endswith('}'):
    print(f'Unexpected format in {lang}.js — skipping')
    continue
  content = content[:-1] + keys + '}\n'
  with open(path, 'w') as f:
    f.write(content)
  print(f'Updated {lang}.js')

# ── 4. Apply page replacements ────────────────────────────────────────────────
for rel_path, old, new in replacements:
  path = os.path.join(BASE, rel_path)
  with open(path, 'r') as f:
    content = f.read()
  if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
      f.write(content)
    print(f'Fixed: {rel_path} — replaced: {old[:40]}...')
  else:
    print(f'NOT FOUND in {rel_path}: {old[:40]}')

print('\nDone.')
