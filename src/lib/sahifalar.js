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

// Sovg'a kodi: daraja ochilganda bir martalik kod (7 kun amal qiladi)
const SKEY = 'safar_sovgalar'
export function sovgalar(){ try { return JSON.parse(localStorage.getItem(SKEY) || '{}') } catch { return {} } }
export async function sovgaOl({ tuman, daraja }){
  const id = `${tuman}/${daraja}`, o = sovgalar()
  if (o[id]) return { ok: true, ...o[id] }
  let kod
  if (!namunaRejimi){
    const { data, error } = await supabase.rpc('sovga_ol', { p_tuman: tuman, p_daraja: daraja, p_device: qurilma() })
    if (error) throw error
    if (!data?.ok) return data
    kod = data.kod
  } else {
    kod = 'SK-' + String(Math.floor(Math.random() * 1e6)).padStart(6, '0')
  }
  const muddat = new Date(Date.now() + 7 * 864e5).toISOString()
  o[id] = { kod, muddat }; try { localStorage.setItem(SKEY, JSON.stringify(o)) } catch {}
  return { ok: true, kod, muddat }
}
