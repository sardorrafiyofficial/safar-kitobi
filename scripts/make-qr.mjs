// QR kodlar va chop etiladigan taxtachalar yasaydi.
// Ishlatish:  SAYT_URL=https://royalfix.uz/safar/ npm run qr
// Natija:     chop-etish/qr/<hudud>/<tuman>/<joy>.svg         — faqat QR
//             chop-etish/qr/<hudud>/<tuman>/<joy>-taxtacha.svg — A5 taxtacha (chop etish uchun)
//             scripts/kalitlar.local.json + supabase/qr_kalitlar.sql — maxfiy kalitlar (internetga joylanmaydi!)
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import QRCode from 'qrcode'

const SAYT = (process.env.SAYT_URL || 'https://royalfix.uz/safar/').replace(/\/?$/, '/')
const DATA = 'public/data'
const KALIT_FAYL = 'scripts/kalitlar.local.json'
const kalitlar = fs.existsSync(KALIT_FAYL) ? JSON.parse(fs.readFileSync(KALIT_FAYL, 'utf8')) : {}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const hudud = JSON.parse(fs.readFileSync(`${DATA}/hududlar.json`, 'utf8')).hududlar
const sql = []

for (const h of hudud.filter(x => x.holat === 'faol')) for (const t of h.tumanlar){
  const jl = JSON.parse(fs.readFileSync(`${DATA}/${h.id}/${t}/joylar.json`, 'utf8'))
  const dir = `chop-etish/qr/${h.id}/${t}`; fs.mkdirSync(dir, { recursive: true })
  for (const j of jl.joylar){
    const id = `${h.id}/${t}/${j.id}`
    kalitlar[id] ||= crypto.randomBytes(6).toString('base64url')   // har bir joyga maxfiy kalit
    const url = `${SAYT}#/joy/${id}?k=${kalitlar[id]}`
    const qr = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#182220', light: '#ffffff' } })
    fs.writeFileSync(`${dir}/${j.id}.svg`, qr)
    const ichki = qr.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    const vb = qr.match(/viewBox="([^"]+)"/)[1]
    const taxta = `<svg xmlns="http://www.w3.org/2000/svg" width="148mm" height="210mm" viewBox="0 0 1480 2100">
  <rect width="1480" height="2100" fill="#f6f2e9"/>
  <rect x="40" y="40" width="1400" height="2020" rx="48" fill="none" stroke="#0f6f6c" stroke-width="10"/>
  <rect x="40" y="40" width="1400" height="300" rx="48" fill="#0f6f6c"/>
  <text x="740" y="190" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="96" font-weight="700" fill="#fffdf8">Safar Kitobi</text>
  <text x="740" y="275" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="44" fill="#e3b54f">Har bir joy — bir sahifa</text>
  <text x="740" y="470" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="70" font-weight="700" fill="#182220">${esc(j.nom.uz)}</text>
  <text x="740" y="545" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="40" fill="#5e6b66">${esc(j.nom.ru)} · ${esc(j.nom.en)}</text>
  <rect x="390" y="620" width="700" height="700" rx="28" fill="#ffffff" stroke="#e2dbcc" stroke-width="4"/>
  <svg x="420" y="650" width="640" height="640" viewBox="${vb}">${ichki}</svg>
  <text x="740" y="1450" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="56" font-weight="800" fill="#182220">Skanerlang va sahifani oling</text>
  <text x="740" y="1525" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="42" fill="#5e6b66">Отсканируйте и получите страницу</text>
  <text x="740" y="1590" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="42" fill="#5e6b66">Scan to collect your page</text>
  <line x1="200" y1="1720" x2="1280" y2="1720" stroke="#c9972b" stroke-width="6"/>
  <text x="740" y="1810" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="40" fill="#0f6f6c" font-weight="700">${esc(h.nom.uz)} · ${esc(t[0].toUpperCase() + t.slice(1))} · 39° N</text>
  <text x="740" y="1960" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="34" fill="#5e6b66">royalfix.uz</text>
</svg>`
    fs.writeFileSync(`${dir}/${j.id}-taxtacha.svg`, taxta)
    sql.push(`update joylar set qr_kalit = '${kalitlar[id]}' where id = '${id}';`)
    console.log('✓', id)
  }
}
fs.writeFileSync(KALIT_FAYL, JSON.stringify(kalitlar, null, 2))
fs.writeFileSync('supabase/qr_kalitlar.sql', '-- MAXFIY: internetga joylamang\n' + sql.join('\n') + '\n')
console.log(`\nSayt manzili: ${SAYT}\nKalitlar: ${KALIT_FAYL} (maxfiy)`)
