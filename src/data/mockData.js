// ─── Localize helper ───────────────────────────────────────────────────────
function _loc(obj, lang) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(i => _loc(i, lang))
  if ('en' in obj && ('uz' in obj || 'ru' in obj)) return obj[lang] ?? obj.en
  const out = {}
  for (const [k,v] of Object.entries(obj)) out[k] = _loc(v, lang)
  return out
}
export function getLocalizedPatientData(lang='en') { return _loc(patientData, lang) }
export function getLocalizedHospitalPatients(lang='en') { return _loc(hospitalPatients, lang) }
export function getLocalizedGlobalPatterns(lang='en') { return _loc(globalPatterns, lang) }

// ─── Patient Record ─────────────────────────────────────────────────────────
export const patientData = {
  id: 'PT-2025-0847',
  name: 'Amir Tashkentov',
  age: 45,
  gender: { en:'Male', uz:'Erkak', ru:'Muzhskoy' },
  bloodGroup: 'B+',
  hospital: { en: 'Republican Clinical Hospital', uz: 'Respublika klinik kasalxonasi', ru: 'Respublikanskaya klinicheskaya bolnitsa' },
  city: 'Tashkent, Uzbekistan',
  ward: { en:'Surgical Ward 3', uz:"3-Jarrohlik bo'limi", ru:'Hirurgicheskoe otdeleniye 3' },
  dischargeDate: '2025-05-10',
  surgeon: 'Dr. Dilshod Yusupov',
  attendingNurse: 'Nurse Aziza Karimova',
  comorbidities: { en:['Type 2 Diabetes','Mild Hypertension'], uz:["2-tur diabet","Yengil gipertenziya"], ru:['Diabet 2 tipa','Lyogkaya gipertenziya'] },
  surgery: {
    name: { en:'Laparoscopic Cholecystectomy', uz:'Laparoskopik Xoletsistektomiya', ru:'Laparoskopicheskaya Holecistektomiya' },
    type: { en:'Laparoscopic', uz:'Laparoskopik', ru:'Laparoskopicheskiy' },
    date: '2025-05-09',
    duration: { en:'47 minutes', uz:'47 daqiqa', ru:'47 minut' },
    indication: { en:'Acute Cholecystitis with Cholelithiasis', uz:"Xolelitiyaz bilan o'tkir xoletsistit", ru:'Ostryy holecistit s holelitiyazom' },
    simpleName: { en:'Gallbladder Removal (Keyhole Surgery)', uz:"O't pufagini olib tashlash (Kalit teshigi jarrohlik)", ru:'Udaleniye zhelchnogo puzyrya (Mikroinvazivnaya operaciya)' },
    simpleExplanation: {
      en: 'Your gallbladder -- a small sac under your liver -- had developed painful stones that were blocking the flow of bile and causing dangerous inflammation. Think of it like a pipe getting clogged with rocks. Instead of one big cut, we used 4 tiny holes (less than 1cm each) to remove it safely. This is called laparoscopic or keyhole surgery.',
      uz: "O't pufagingiz -- jigaringiz ostidagi kichik xalta -- og'riqli toshlar hosil qilgan edi, ular safro oqimini to'sib, xavfli yallig'lanishga sabab bo'layotgan edi. Bu quvurga tosh tiqilishiga o'xshaydi. Bitta katta kesish o'rniga, uni xavfsiz olib tashlash uchun 4 ta kichik teshik (har biri 1 sm dan kam) ishlatdik. Bu laparoskopik yoki kalit teshigi jarrohlik deyiladi.",
      ru: "Vash zhelchnyj puzyr -- nebolshoj meshochek pod pechenyu -- obrazoval boleznennye kamni, kotorye blokirovali ottok zhelchi i vyzyvali opasnoe vospaleniye. Predstavte trubu zabituju kamnyami. Vmesto odnogo bolshogo razreza my ispolzovali 4 krohotnyh otverstiya meneye 1 sm kazhdoe chtoby bezopasno udalit ego. Eto nazyvaetsya laparoskopicheskoj hirurgiyej.",
    },
    howItWasDone: {
      en: "We made 4 tiny cuts in your abdomen. Through one, we inserted a camera (laparoscope) so we could see everything on a screen. Through the others, we used small precision instruments to gently clip the bile duct and blood vessel, then remove the gallbladder. You were fully asleep under general anesthesia. The whole process took less than an hour.",
      uz: "Qorningizda 4 ta kichik kesim qildik. Biridan kamera (laparoskop) kiritdik, shunda hamma narsani ekranda ko'rishimiz mumkin bo'ldi. Qolganlaridan safro yo'li va qon tomirini ehtiyotkorlik bilan mahkamlab, keyin o't pufagini olib tashladik. Umumiy narkoz ostida uxlayotgan edingiz. Jarayon bir soatdan kam vaqt oldi.",
      ru: "My sdelali 4 krohotnyh razreza v zhivote. Cherez odin vstavili kameru laparoskop chtoby videt vsyo na ekrane. Cherez drugiye ispolzovali tochnye instrumenty dlya zazima zhelchnogo protoka i udaleniya puzyrya. Vy spali pod obshhim narkozom. Ves process zanyal meneye chasa.",
    },
    whyLaparoscopic: {
      en: "Laparoscopic surgery means 3-4x faster recovery, significantly less pain, tiny scars that fade within months, lower infection risk, and you were up walking the same day -- something that would take weeks with traditional open surgery.",
      uz: "Laparoskopik jarrohlik 3-4 barobar tezroq tuzalishni, ancha kam og'riqni, oylar ichida yo'qoladigan kichik chandiqlarni, past infektsiya xavfini anglatadi va siz o'sha kuni yura boshladingiz -- an'anaviy ochiq jarrohlik bilan bu haftalar talab qilardi.",
      ru: "Laparoskopicheskaya hirurgiya oznachayet vyzdorovleniye v 3-4 raza bystree znachitelno menshe boli krohotnyye rubcy kotoryye propadayut za mesyacy menshij risk infekcii i vy hodili v tot zhe den -- pri tradicionnoj otkrytoj operacii eto zanyalo by nedeli.",
    },
    keyFacts: {
      en: ["You can live a completely normal life without a gallbladder","Your liver still produces bile -- it just flows directly to your intestine","Most people feel 80% normal by day 7-10","You are expected to make a full recovery by day 30"],
      uz: ["O't pufagisiz mutlaqo normal hayot kechirish mumkin","Jigaringiz safro ishlab chiqarishda davom etadi -- u to'g'ridan-to'g'ri ichakka oqadi","Ko'pchilik 7-10 kunida 80% normal his qiladi","30 kuniga to'liq tuzalish kutilmoqda"],
      ru: ["Mozhno zhit polnostyu normalnoj zhiznyu bez zhelchnogo puzyrya","Pechenh po-prezhnemu vyrabatyvayet zhelch ona techet pryamo v kishechnik","Bolshinstvo lyudej chuvstvuyut sebya na 80% normalno k dnyu 7-10","Ozhidaetsya polnoe vyzdorovleniye k dnyu 30"],
    },
  },
  medicines: [
    {
      id:'med-1', name:'Tramadol 50mg', genericName:'Tramadol Hydrochloride',
      type:{en:'Painkiller (Opioid)',uz:"Og'riq qoldiruvchi (Opioid)",ru:'Obezbolivayusheye (Opioid)'},
      dosage:{en:'1 tablet',uz:'1 tabletka',ru:'1 tabletka'},
      frequency:{en:'Every 8 hours',uz:'Har 8 soatda',ru:'Kazhdye 8 chasov'},
      duration:{en:'5 days',uz:'5 kun',ru:'5 dnej'},
      withFood:true,
      purpose:{en:'Relieves moderate post-operative pain. Blocks pain signals from reaching your brain.',uz:"O'rtacha operatsiyadan keyingi og'riqni kamaytiradi. Og'riq signallarini miyangizga yetib borishidan to'sadi.",ru:'Snimayet umerennuyu posleoperacionnuyu bol. Blokiruet signaly boli ot dostizheniya mozga.'},
      important:{en:'Do NOT drive or operate machinery while taking this.',uz:'Bu dori qabul qilayotganda MASHINA HAYDAMANG va mexanizmlarni boshqarmang.',ru:'NE vedite mashinu i ne rabotajte s mehanizmami pri priyome etogo preparata.'},
      sideEffects:{en:['Drowsiness','Nausea','Dizziness','Constipation'],uz:["Uyquchanlik","Ko'ngil aynish","Bosh aylanishi","Ich qotish"],ru:['Sonlivost','Toshnota','Golovokruzheniye','Zapor']},
      severity:['moderate','mild','mild','mild'], color:'#00D4FF', times:['08:00','16:00','00:00'], daysRemaining:3,
    },
    {
      id:'med-2', name:'Omeprazole 20mg', genericName:'Omeprazole',
      type:{en:'Stomach Protector (PPI)',uz:'Oshqozon himoyachisi (PPI)',ru:'Zashhita zheludka (IPP)'},
      dosage:{en:'1 capsule',uz:'1 kapsul',ru:'1 kapsula'},
      frequency:{en:'Once daily -- 30 min before breakfast',uz:'Kuniga bir marta -- nonushtadan 30 daqiqa oldin',ru:'Odin raz v den -- za 30 minut do zavtraka'},
      duration:{en:'14 days',uz:'14 kun',ru:'14 dnej'},
      withFood:false,
      purpose:{en:'Protects your stomach lining and reduces acid while your body heals. Prevents ulcers.',uz:'Tanangiz tuzalayotganda oshqozon shilliq qavatini himoya qiladi. Yaralarning oldini oladi.',ru:'Zashhishayet slizisuyu obolochku zheludka i snizhayet kislotnost. Predotvrashhayet yazvy.'},
      important:{en:'Take 30 minutes before eating for best effect.',uz:"Eng yaxshi ta'sir uchun ovqatlanishdan 30 daqiqa oldin qabul qiling.",ru:'Prinimajte za 30 minut do edy dlya nailuchshego effekta.'},
      sideEffects:{en:['Mild headache','Stomach pain (rare)'],uz:["Engil bosh og'rig'i","Oshqozon og'rig'i (kam uchraydi)"],ru:['Lyogkaya golovnaya bol','Bol v zheludke (redko)']},
      severity:['mild','mild'], color:'#7C5CFC', times:['07:30'], daysRemaining:12,
    },
    {
      id:'med-3', name:'Amoxicillin 500mg', genericName:'Amoxicillin Trihydrate',
      type:{en:'Antibiotic',uz:'Antibiotik',ru:'Antibiotik'},
      dosage:{en:'1 capsule',uz:'1 kapsul',ru:'1 kapsula'},
      frequency:{en:'Every 8 hours',uz:'Har 8 soatda',ru:'Kazhdye 8 chasov'},
      duration:{en:'7 days',uz:'7 kun',ru:'7 dnej'},
      withFood:true,
      purpose:{en:'Prevents bacterial infection at the surgical sites. Critical -- complete the full course.',uz:"Jarrohlik joylarida bakterial infektsiyaning oldini oladi. Muhim -- to'liq kursni tugatish kerak.",ru:'Predotvrashhayet bakterialnuyu infekciju v mestah operacii. Vazhno -- zavershite polnyj kurs.'},
      important:{en:'Complete the full 7-day course even if you feel better. Stopping early causes antibiotic resistance.',uz:"Yaxshilanib ketgan bo'lsangiz ham 7 kunlik to'liq kursni tugatng. Erta to'xtatish antibiotiklarga chidamlilikka olib keladi.",ru:'Zavershite polnyj 7-dnevnyj kurs dazhe esli vam stalo luchshe. Dosrochnaya otmena vyzyvayet antibiotikoustojchivost.'},
      sideEffects:{en:['Diarrhea','Rash (stop if rash occurs)','Mild nausea'],uz:["Ich ketish","Toshma (toshma chiqsa to'xtating)","Engil ko'ngil aynish"],ru:['Diyareya','Syp (prekratite pri poyavlenii sypi)','Lyogkaya toshnota']},
      severity:['mild','stop-medication','mild'], color:'#00E5A0', times:['08:00','16:00','00:00'], daysRemaining:5,
    },
  ],
  recoveryGuide: {
    walking: [
      {period:{en:'Day 1-2',uz:'1-2 kun',ru:'Den 1-2'},instruction:{en:'Short walks of 5-10 min around the house, 3x daily',uz:'Uyda 5-10 daqiqalik qisqa sayrlar, kuniga 3 marta',ru:'Korotkiye progulki 5-10 min po domu 3 raza v den'},icon:'🐌'},
      {period:{en:'Day 3-7',uz:'3-7 kun',ru:'Den 3-7'},instruction:{en:'15-20 minute gentle walks outdoors, twice daily',uz:'Tashqarida 15-20 daqiqalik yengil sayrlar, kuniga ikki marta',ru:'Nezhnyye progulki 15-20 minut na ulice dvazhdy v den'},icon:'🚶'},
      {period:{en:'Week 2-3',uz:'2-3 hafta',ru:'Nedelya 2-3'},instruction:{en:'30-minute walks daily. Increase pace gradually',uz:'Kunlik 30 daqiqalik sayrlar. Suratni asta-sekin oshiring',ru:'30-minutnye progulki ezhednevno. Postepenno uvelichivajte temp'},icon:'🏃'},
      {period:{en:'Week 4+',uz:'4+ hafta',ru:'Nedelya 4+'},instruction:{en:'Return to normal walking. Light jogging if comfortable',uz:"Normal yurishga qayting. Qulay bo'lsa engil yugurish",ru:'Vozvrat k normalnoj hodbe. Lyogkaya probezhhka esli komfortno'},icon:'⚡'},
    ],
    lifting: [
      {period:{en:'Week 1',uz:'1-hafta',ru:'Nedelya 1'},limit:{en:'Nothing over 500g',uz:"500g dan og'ir narsa ko'tarmang",ru:'Nichego tyazhelee 500g'},example:{en:'Lighter than a full water bottle',uz:"To'la suv shishasidan yengilroq",ru:'Legche polnoj butylki vody'},safe:false},
      {period:{en:'Week 2-3',uz:'2-3 hafta',ru:'Nedelya 2-3'},limit:{en:'Nothing over 2kg',uz:"2 kg dan og'ir narsa ko'tarmang",ru:'Nichego tyazhelee 2 kg'},example:{en:'About the weight of a laptop',uz:'Taxminan noutbuk ogirligida',ru:'Primerno ves noutbuka'},safe:false},
      {period:{en:'Week 4+',uz:'4+ hafta',ru:'Nedelya 4+'},limit:{en:'Gradually increase to normal',uz:'Asta-sekin normalga qaytaring',ru:'Postepenno uvelichivajte do normalnogo'},example:{en:'Listen to your body',uz:'Tanangizni eshiting',ru:'Slushajte svoe telo'},safe:true},
    ],
    diet: [
      {day:{en:'Day 1-2',uz:'1-2 kun',ru:'Den 1-2'},food:{en:'Clear fluids only -- water, clear broth, apple juice, herbal tea',uz:"Faqat tiniq suyuqliklar -- suv, tiniq bulyon, olma sharbati, o't choy",ru:'Tolko prozrachnye zhidkosti -- voda prozrachnyj bulyon yablochnyj sok travyanoj chaj'},icon:'💧'},
      {day:{en:'Day 3-7',uz:'3-7 kun',ru:'Den 3-7'},food:{en:'Soft foods -- yogurt, soup, mashed potato, toast, scrambled eggs',uz:'Yumshoq taomlar -- qatiq, shorva, kartoshka puresi, tost, tuxum',ru:'Myagkaya eda -- jogurt sup kartofelnoe pyure tost yaichnica'},icon:'🥣'},
      {day:{en:'Week 2',uz:'2-hafta',ru:'Nedelya 2'},food:{en:'Light meals -- boiled chicken, white rice, steamed vegetables, banana',uz:"Yengil taomlar -- qaynatilgan tovuq, oq guruch, bug'da pishirilgan sabzavot, banan",ru:'Lyogkaya eda -- otvarnoye kurica belyj ris tushenye ovoshhi banan'},icon:'🍲'},
      {day:{en:'Week 3-4',uz:'3-4 hafta',ru:'Nedelya 3-4'},food:{en:'Normal diet. Avoid fried, fatty, spicy foods for 4-6 weeks total',uz:'Normal ovqatlanish. Jami 4-6 hafta mobaynida qovurilgan yogli achchiq taomlardan saqlaning',ru:'Obychnaya dieta. Izbegajte zharenyh zhirnyh ostryh produktov v techenie 4-6 nedel'},icon:'🥗'},
      {day:{en:'Month 2+',uz:'2+ oy',ru:'Mesyac 2+'},food:{en:'Fully normal diet. Your body has adapted without a gallbladder',uz:"To'liq normal ovqatlanish. Tanangiz o't pufagisiz moslashdi",ru:'Polnostyu normalnaya dieta. Vashe telo prisposovilos bez zhelchnogo puzyrya'},icon:'🍽️'},
    ],
    sleep:{en:"Sleep flat on your back for the first week. Avoid lying on your right side for 2 weeks. Use pillows to support your abdomen when coughing or getting up.",uz:"Birinchi hafta chalqancha yoting. 2 hafta o'ng tomoningizda yotmang. Yo'talayotganda qorningizni yostiq bilan qo'llab-quvvatlang.",ru:"Spat na spine v techenie pervoj nedeli. Izbegajte lezhania na pravom boku 2 nedeli. Ispolzujte podushki dlya podderzhki zhivota pri kashle."},
    bathing:{en:"No shower for the first 48 hours. After that, quick showers only -- avoid soaking the wounds. No baths, swimming pools, or hot tubs for at least 2 weeks.",uz:"Dastlabki 48 soat dush qabul qilmang. Undan keyin faqat tezkor dush -- yaralarni ho'llamang. Kamida 2 hafta vanna yoki basseyn qabul qilmang.",ru:"Nikakogo dusha v pervye 48 chasov. Posle etogo tolko bystrye dushi izbegajte zamachaniya ran. Nikakix vann i bassejnov minimum 2 nedeli."},
    driving:{en:"Do not drive for at least 1 week. Never drive while taking Tramadol.",uz:"Kamida 1 hafta mashina haydamang. Tramadol qabul qilayotganda hech qachon haydamang.",ru:"Ne vedite mashinu minimum 1 nedelyu. Nikogda ne vedite mashinu pri priyome Tramadola."},
    returnToWork:{
      desk:{en:'1-2 weeks',uz:'1-2 hafta',ru:'1-2 nedeli'},
      physical:{en:'4-6 weeks',uz:'4-6 hafta',ru:'4-6 nedel'},
    },
    warningSigns:{
      en:["Fever above 38.5 degC","Redness, swelling, or discharge from wounds","Severe abdominal pain that worsens","Jaundice (yellowing of skin or eyes)","Vomiting that won't stop"],
      uz:["38.5 darajadan yuqori isitma","Yaralardan qizarish, shish yoki suyuqlik oqishi","Kuchayib borayotgan kuchli qorin og'rig'i","Sariqlik (teri yoki ko'zlarning sarg'ayishi)","To'xtatib bo'lmaydigan qayt"],
      ru:["Temperatura vyshe 38.5 gradusov","Krasnota otek ili vydeleniya iz ran","Silnaya brushnaya bol kotoraya usilivaetsya","Zheltukha pozzhelteniye kozhi ili glaz","Rvota kotoraya ne prekrashhaetsya"],
    },
  },
  followUps: [
    {id:'fu-1',date:'2025-05-17',dayNumber:7,type:{en:'Wound Check',uz:'Yara tekshiruvi',ru:'Proverka rany'},doctor:'Dr. Dilshod Yusupov',location:{en:'OPD Room 3, Republican Clinical Hospital',uz:'3-xona, Respublika klinik kasalxonasi',ru:'Kabinet 3, Respublikanskaya klinicheskaya bolnica'},notes:{en:'Check incision healing, remove sutures if healed',uz:"Kesmaning bitishini tekshirish, bitgan bo'lsa tikuvlarni olish",ru:'Proverka zazhivleniya razreza udaleniye shvov pri zazhivlenii'},status:'upcoming'},
    {id:'fu-2',date:'2025-05-24',dayNumber:14,type:{en:'Post-Op Review',uz:"Operatsiyadan keyingi ko'rik",ru:'Posleoperacionnyj osmotr'},doctor:'Dr. Dilshod Yusupov',location:{en:'OPD Room 3, Republican Clinical Hospital',uz:'3-xona, Respublika klinik kasalxonasi',ru:'Kabinet 3, Respublikanskaya klinicheskaya bolnica'},notes:{en:'Recovery progress review, blood glucose check',uz:"Tuzalish jarayonini ko'rib chiqish, qon glyukozasini tekshirish",ru:'Obzor progressa vyzdorovleniya proverka sakhara krovi'},status:'upcoming'},
    {id:'fu-3',date:'2025-06-08',dayNumber:29,type:{en:'Final Clearance',uz:'Yakuniy ruxsat',ru:'Itogovyy dopusk'},doctor:'Dr. Dilshod Yusupov',location:{en:'OPD Room 3, Republican Clinical Hospital',uz:'3-xona, Respublika klinik kasalxonasi',ru:'Kabinet 3, Respublikanskaya klinicheskaya bolnica'},notes:{en:'Final assessment, clearance for full activities, formal recovery completion',uz:"Yakuniy baholash, to'liq faoliyatga ruxsat, rasmiy tuzalish yakunlanishi",ru:'Finalnyj osmotr dopusk k polnoj aktivnosti oficialnoye zavershenie vyzdorovleniya'},status:'upcoming'},
  ],
  dayOfRecovery: 2,
}

export const checkInQuestions = [
  {id:'q1',question:'How is your pain today?',subtext:'Compare to how you felt yesterday',options:[{label:'Better -- less pain than yesterday',emoji:'😊',score:0,color:'stable'},{label:'About the same as yesterday',emoji:'😐',score:1,color:'attention'},{label:'Worse -- more pain than yesterday',emoji:'😟',score:2,color:'urgent'}]},
  {id:'q2',question:'Do you have a fever?',subtext:'Temperature 38 degC or above',options:[{label:'No fever, temperature feels normal',emoji:'✅',score:0,color:'stable'},{label:'Feeling warm, mild fever (37.5-38 degC)',emoji:'🌡️',score:1,color:'attention'},{label:'High fever above 38.5 degC',emoji:'🔥',score:3,color:'urgent'}]},
  {id:'q3',question:'How does your wound look?',subtext:'Check each small incision site on your belly',options:[{label:'Clean, dry, closing well',emoji:'✅',score:0,color:'stable'},{label:'Slightly pink or tender around it',emoji:'⚠️',score:1,color:'attention'},{label:'Red, swollen, warm, or leaking fluid',emoji:'🚨',score:3,color:'urgent'}]},
  {id:'q4',question:'How is your stomach today?',subtext:'Any nausea or vomiting?',options:[{label:'No nausea, feeling fine',emoji:'😊',score:0,color:'stable'},{label:'Mild nausea, no vomiting',emoji:'😐',score:1,color:'attention'},{label:'Vomiting or unable to keep food down',emoji:'🤢',score:2,color:'urgent'}]},
  {id:'q5',question:'Can you eat and drink today?',subtext:'How is your appetite compared to normal?',options:[{label:'Eating and drinking normally',emoji:'🍲',score:0,color:'stable'},{label:'Eating less than usual but managing',emoji:'🥣',score:1,color:'attention'},{label:'Barely able to eat or drink anything',emoji:'❌',score:2,color:'urgent'}]},
  {id:'q6',question:'How are you moving around?',subtext:'Can you walk or move without major issues?',options:[{label:'Moving around comfortably',emoji:'🚶',score:0,color:'stable'},{label:'Moving but with noticeable discomfort',emoji:'🐢',score:1,color:'attention'},{label:'Mostly in bed -- very difficult to move',emoji:'🛏️',score:2,color:'urgent'}]},
  {id:'q7',question:'Did you take all your medicines today?',subtext:'Including all your prescribed tablets and capsules',options:[{label:'Yes -- took every dose on time',emoji:'✅',score:0,color:'stable'},{label:'Missed one dose today',emoji:'⚠️',score:1,color:'attention'},{label:'Missed 2 or more doses',emoji:'❌',score:2,color:'urgent'}]},
  {id:'q8',question:'How is your energy level?',subtext:'Compared to a normal day before surgery',options:[{label:'Feeling reasonably good, some energy',emoji:'⚡',score:0,color:'stable'},{label:'Tired but able to do light things',emoji:'😴',score:1,color:'attention'},{label:'Very weak and exhausted, can barely get up',emoji:'💤',score:2,color:'urgent'}]},
]

export function getStatus(score) { if(score<=4)return'stable'; if(score<=9)return'attention'; return'urgent' }

export function generateMockAnalytics() {
  return [{day:1,score:14,status:'urgent',medsTaken:true},{day:2,score:11,status:'urgent',medsTaken:true},{day:3,score:9,status:'attention',medsTaken:false},{day:4,score:10,status:'attention',medsTaken:false},{day:5,score:8,status:'attention',medsTaken:true},{day:6,score:7,status:'attention',medsTaken:true},{day:7,score:5,status:'attention',medsTaken:true},{day:8,score:4,status:'stable',medsTaken:true},{day:9,score:3,status:'stable',medsTaken:true},{day:10,score:4,status:'stable',medsTaken:false},{day:11,score:5,status:'attention',medsTaken:false},{day:12,score:3,status:'stable',medsTaken:true},{day:13,score:2,status:'stable',medsTaken:true},{day:14,score:2,status:'stable',medsTaken:true},{day:15,score:1,status:'stable',medsTaken:true}]
}

export const hospitalPatients = [
  {id:'PT-2025-0847',name:'Amir Tashkentov',age:45,surgery:'Laparoscopic Cholecystectomy',day:2,lastCheckIn:'08:32 AM',status:'urgent',score:12,flag:{en:'High fever + wound concern',uz:'Yuqori isitma + yara muammosi',ru:'Vysokaya temperatura + problema s ranoj'},ward:{en:'Surgical Ward 3',uz:"3-Jarrohlik bo'limi",ru:'Hirurgicheskoe otdeleniye 3'},phone:'+998 90 123 4567'},
  {id:'PT-2025-0831',name:'Gulnora Mirzayeva',age:38,surgery:'Appendectomy',day:5,lastCheckIn:'09:15 AM',status:'stable',score:3,flag:null,ward:{en:'Surgical Ward 2',uz:"2-Jarrohlik bo'limi",ru:'Hirurgicheskoe otdeleniye 2'},phone:'+998 93 456 7890'},
  {id:'PT-2025-0819',name:'Bobur Karimov',age:62,surgery:'Hernia Repair',day:8,lastCheckIn:'07:55 AM',status:'attention',score:7,flag:{en:'Missed 2 medication doses',uz:"2 ta dori dozasi o'tkazib yuborildi",ru:'Propushcheno 2 dozy lekarstv'},ward:{en:'Surgical Ward 1',uz:"1-Jarrohlik bo'limi",ru:'Hirurgicheskoe otdeleniye 1'},phone:'+998 91 234 5678'},
  {id:'PT-2025-0808',name:'Shahlo Yuldasheva',age:29,surgery:'Laparoscopic Cholecystectomy',day:12,lastCheckIn:'10:02 AM',status:'stable',score:2,flag:null,ward:{en:'Surgical Ward 3',uz:"3-Jarrohlik bo'limi",ru:'Hirurgicheskoe otdeleniye 3'},phone:'+998 97 890 1234'},
  {id:'PT-2025-0798',name:'Jasur Nazarov',age:55,surgery:'Bowel Resection',day:4,lastCheckIn:'11:30 AM',status:'urgent',score:14,flag:{en:'Fever 38.8 degC + unable to eat',uz:'Isitma 38.8 daraja + ovqat yeyolmayapti',ru:'Temperatura 38.8 + ne mozhet est'},ward:{en:'Surgical Ward 4',uz:"4-Jarrohlik bo'limi",ru:'Hirurgicheskoe otdeleniye 4'},phone:'+998 90 567 8901'},
  {id:'PT-2025-0784',name:'Nilufar Rakhimova',age:44,surgery:'Thyroid Surgery',day:9,lastCheckIn:'08:45 AM',status:'stable',score:1,flag:null,ward:{en:'ENT Ward',uz:"LOR bo'limi",ru:'LOR otdeleniye'},phone:'+998 93 678 9012'},
  {id:'PT-2025-0772',name:'Otabek Sultonov',age:33,surgery:'Knee Arthroscopy',day:6,lastCheckIn:'09:50 AM',status:'attention',score:6,flag:{en:'Swelling noted',uz:'Shish kuzatildi',ru:'Otmechena otechnost'},ward:{en:'Ortho Ward',uz:"Ortopediya bo'limi",ru:'Ortopedicheskoe otdeleniye'},phone:'+998 94 789 0123'},
  {id:'PT-2025-0761',name:'Malika Ergasheva',age:51,surgery:'Hysterectomy',day:14,lastCheckIn:'10:25 AM',status:'stable',score:2,flag:null,ward:{en:'Gynae Ward',uz:"Ginekologiya bo'limi",ru:'Ginekologicheskoe otdeleniye'},phone:'+998 99 890 1234'},
]

export const globalPatterns = {
  totalPatients:2847, countries:12,
  surgeryTypes:['Laparoscopic Cholecystectomy','Appendectomy','Hernia Repair','Thyroidectomy','Bowel Resection'],
  recoveryBenchmarks:{
    'Laparoscopic Cholecystectomy':{
      milestones:[
        {day:1,metric:{en:'Pain Score',uz:"Og'riq bali",ru:'Ball boli'},avg:7.2,unit:'/10',insight:{en:'72% of patients report their highest pain on day 1',uz:'Bemorlarning 72% eng yuqori ogriqni 1-kunda his qiladi',ru:'72% pacientov otmechayut silnejshuyu bol v den 1'}},
        {day:3,metric:{en:'Fever Rate',uz:'Isitma darajasi',ru:'Uroven temperatury'},avg:18,unit:'%',insight:{en:'18% of patients develop mild fever by day 3',uz:'Bemorlarning 18% 3-kunga kelib engil isitmaga ega boladi',ru:'18% pacientov razvivayut lyogkuyu temperaturu k dnyu 3'}},
        {day:7,metric:{en:'Return to Light Activity',uz:'Yengil faoliyatga qaytish',ru:'Vozvrat k lyogkoj aktivnosti'},avg:78,unit:'%',insight:{en:'78% of patients walk 20+ minutes by day 7',uz:'Bemorlarning 78% 7-kunga 20+ daqiqa yuradi',ru:'78% pacientov khodyat 20+ minut k dnyu 7'}},
        {day:10,metric:{en:'Pain-Free Rate',uz:"Og'riqsiz darajasi",ru:'Uroven bez boli'},avg:65,unit:'%',insight:{en:'Most patients stop needing painkillers between day 7-10',uz:'Kupchilik bemorlar 7-10 kun oraligida ogriq qoldiruvchi kerak bolmay qoladi',ru:'Bolshinstvo pacientov perestayet nuzhdatsya v obezbolivayushchikh mezhdu dnyami 7-10'}},
        {day:14,metric:{en:'Normal Eating Rate',uz:'Normal ovqatlanish darajasi',ru:'Uroven normalnogo pitaniya'},avg:89,unit:'%',insight:{en:'89% eating fully normally by day 14',uz:'Bemorlarning 89% 14-kunga toliq normal ovqatlanadi',ru:'89% edyat polnostyu normalno k dnyu 14'}},
        {day:21,metric:{en:'Return to Work (desk)',uz:'Ishga qaytish (ofis)',ru:'Vozvrat k rabote (ofis)'},avg:92,unit:'%',insight:{en:'92% of desk-job patients return to work by day 21',uz:'Ofis xodimlarining 92% 21-kunga ishga qaytadi',ru:'92% ofisnyh rabotnikov vozvrashchayutsya k rabote k dnyu 21'}},
        {day:30,metric:{en:'Full Recovery',uz:"To'liq tuzalish",ru:'Polnoe vyzdorovleniye'},avg:97,unit:'%',insight:{en:'97% report complete recovery by day 30',uz:'97% 30-kunga toliq tuzalishni malum qiladi',ru:'97% soobshchayut o polnom vyzdorovlenii k dnyu 30'}},
      ],
      commonComplications:[
        {name:{en:'Wound infection',uz:'Yara infektsiyasi',ru:'Infektsiya rany'},rate:3.2,timing:{en:'Day 4-7',uz:'4-7 kun',ru:'Den 4-7'},action:{en:'Antibiotics usually resolve this',uz:'Antibiotiklar odatda hal qiladi',ru:'Antibiotiki obychno reshayut eto'}},
        {name:{en:'Bile leak',uz:'Safro oqishi',ru:'Utechka zhelchi'},rate:0.8,timing:{en:'Day 2-5',uz:'2-5 kun',ru:'Den 2-5'},action:{en:'Requires urgent hospital visit',uz:'Shoshilinch kasalxona tashrifi talab etiladi',ru:'Trebuyet srochnogo vizita v bolnicu'}},
        {name:{en:'Port-site hernia',uz:'Port joyi churrasi',ru:'Gryzha v meste porta'},rate:1.1,timing:{en:'Week 3-6',uz:'3-6 hafta',ru:'Nedelya 3-6'},action:{en:'Surgical correction if significant',uz:'Katta bolsa jarrohlik tuzatilishi',ru:'Hirurgicheskaya korrekciya pri neobhodimosti'}},
      ],
      diabeticPattern:{en:'Patients with Type 2 Diabetes typically take 2-3 days longer to reach pain-free status. Wound healing may be slower -- watch for infection signs from day 5+.',uz:'2-tur diabetli bemorlar ogriqsiz holatga yetish uchun odatda 2-3 kun kuprok vaqt oladi. Yara bitishi sekinroq bulishi mumkin -- 5-kundan boshlab infektsiya belgilarini kuzating.',ru:'Pacienty s diabetom 2 tipa obychno zatrachivayut na 2-3 dnya bolshe dlya dostizheniya sostoyaniya bez boli. Zazhivleniye ran mozhet byt medlennee -- sledite za priznakami infekcii s dnya 5.'},
    },
  },
  recoveryByDay:[
    {day:1,avgScore:13.4,stableRate:8,attentionRate:34,urgentRate:58},
    {day:2,avgScore:11.2,stableRate:15,attentionRate:45,urgentRate:40},
    {day:3,avgScore:9.1,stableRate:28,attentionRate:52,urgentRate:20},
    {day:5,avgScore:7.3,stableRate:45,attentionRate:46,urgentRate:9},
    {day:7,avgScore:5.2,stableRate:62,attentionRate:34,urgentRate:4},
    {day:10,avgScore:3.8,stableRate:78,attentionRate:20,urgentRate:2},
    {day:14,avgScore:2.4,stableRate:89,attentionRate:10,urgentRate:1},
    {day:21,avgScore:1.2,stableRate:95,attentionRate:5,urgentRate:0},
    {day:30,avgScore:0.5,stableRate:97,attentionRate:3,urgentRate:0},
  ],
}
