import { supabase, namunaRejimi } from './supabase.js'

// Sahifalar (muhrlar) bilan ishlash. 1-bosqich: telefonda (localStorage).
// 2-bosqich: Supabase'dagi claim_stamp funksiyasi — GPS va QR kaliti serverda tekshiriladi.
const KEY = 'safar_sahifalar'
const qurilma = () => { try { let id = localStorage.getItem('safar_qurilma'); if(!id){ id = crypto.randomUUID(); localStorage.setItem('safar_qurilma', id) } return id } catch { return 'nomalum' } }

export function mahalliy(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } }
function saqla(o){ try { localStorage.setItem(KEY, JSON.stringify(o)) } catch {} }

export function olinganmi(id){ return Boolean(mahalliy()[id]) }
export function tumanSahifalari(prefix){ return Object.keys(mahalliy()).filter(k => k.startsWith(prefix + '/')) }

// Sahifani olish. joyId = "qashqadaryo/kitob/kenglik-stansiyasi", kalit = QR ichidagi ?k=
export async function sahifaOl({ joyId, kalit, gps }){
  if (!namunaRejimi){
    const { data, error } = await supabase.rpc('claim_stamp', {
      p_place: joyId, p_key: kalit, p_lat: gps?.lat ?? null, p_lng: gps?.lng ?? null, p_device: qurilma() })
    if (error) throw error
    if (!data?.ok) return data          // { ok:false, sabab:'uzoq' | 'kalit' | 'tez' }
  }
  const o = mahalliy(); o[joyId] = { vaqt: new Date().toISOString() }; saqla(o)
  return { ok: true }
}
