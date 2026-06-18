import { supabase } from './supabase'

const KEY = 'recap_current_patient'
export const PILOT_DAYS = 14

// Is this a pilot session? Only if URL has ?patient=CODE (now or earlier this session)
export function isPilotMode() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('patient')) return true
  return localStorage.getItem(KEY) !== null
}

// Read ?patient=CODE from URL, fetch from Supabase, cache for session.
// Returns null in demo mode (caller falls back to Amir mock data).
export async function resolvePatient() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('patient')

  if (code) {
    const { data, error } = await supabase
      .from('patients').select('*').eq('patient_code', code).single()
    if (!error && data) {
      localStorage.setItem(KEY, JSON.stringify(data))
      return data
    }
  }
  const cached = localStorage.getItem(KEY)
  return cached ? JSON.parse(cached) : null
}

export function clearPilotSession() {
  localStorage.removeItem(KEY)
}

export function getCachedPatient() {
  const cached = localStorage.getItem(KEY)
  return cached ? JSON.parse(cached) : null
}

// recovery day = today - discharge_date (min 1)
export function recoveryDay(dischargeDate) {
  if (!dischargeDate) return 1
  const d = new Date(dischargeDate)
  const today = new Date()
  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 1)
}

export function pilotComplete(dischargeDate) {
  return recoveryDay(dischargeDate) > PILOT_DAYS
}

export async function saveCheckin(patient, score, status, answers, painScore) {
  const day = recoveryDay(patient.discharge_date)
  const { error } = await supabase.from('checkins').insert({
    patient_id: patient.id,
    patient_code: patient.patient_code,
    day_of_recovery: day,
    score, status, answers, pain_score: painScore,
  })
  if (!error) {
    await supabase.from('patients').update({ status }).eq('id', patient.id)
  }
  return !error
}
