// Ma'lumotlar public/data/ ichidagi JSON fayllardan o'qiladi.
// Yangi tuman qo'shish = yangi papka + JSON (kod o'zgarmaydi).
const base = import.meta.env.BASE_URL
const cache = new Map()
async function ol(yol){
  if (!cache.has(yol)) cache.set(yol, fetch(`${base}data/${yol}`).then(r => { if(!r.ok) throw new Error(yol); return r.json() }))
  return cache.get(yol)
}
export const hududlar = () => ol('hududlar.json')
export const tuman    = (h, t) => ol(`${h}/${t}/tuman.json`)
export const joylar   = (h, t) => ol(`${h}/${t}/joylar.json`)
export const joyKaliti = (h, t, j) => `${h}/${t}/${j}`   // global ID: qashqadaryo/kitob/kenglik-stansiyasi
