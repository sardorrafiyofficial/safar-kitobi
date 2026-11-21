import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { joylar, joyKaliti } from '../lib/data.js'
import { masofa, joylashuv } from '../lib/geo.js'
import { olinganmi, sahifaOl } from '../lib/sahifalar.js'
import { namunaRejimi } from '../lib/supabase.js'
import { useTil } from '../lib/i18n.jsx'

// QR kod shu sahifaga olib keladi: #/joy/qashqadaryo/kitob/kenglik-stansiyasi?k=KALIT
export default function Joy(){
  const { hudud, tuman, joy } = useParams(), [sp] = useSearchParams()
  const kalit = sp.get('k')
  const { t, L } = useTil()
  const [jl, setJl] = useState(null), [holat, setHolat] = useState('tayyor'), [xabar, setXabar] = useState('')
  const id = joyKaliti(hudud, tuman, joy)
  const [ol, setOl] = useState(olinganmi(id))
  useEffect(() => { joylar(hudud, tuman).then(setJl) }, [hudud, tuman])
  if (!jl) return <div className="wrap pt-8 text-kul">…</div>
  const j = jl.joylar.find(x => x.id === joy)
  if (!j) return <div className="wrap pt-8">404</div>

  async function olish(majburiy = false){
    setHolat('tekshir'); setXabar('')
    let gps = null
    try { gps = await joylashuv() } catch { if (!majburiy){ setHolat('gps_yoq'); return } }
    if (gps && !majburiy){
      const m = masofa(gps, j.gps)
      if (m > jl.radius_m){ setHolat('uzoq'); setXabar(`${Math.round(m)} m`); return }
    }
    const r = await sahifaOl({ joyId: id, kalit, gps })
    if (r.ok){ setOl(true); setHolat('tayyor') } else { setHolat(r.sabab === 'uzoq' ? 'uzoq' : 'xato') }
  }

  return (
    <div className="wrap grid gap-5 pt-5">
      <Link to={`/${hudud}/${tuman}`} className="text-sm font-bold text-firuza">← {t('orqaga')}</Link>
      <article className="varaq p-5 relative overflow-hidden">
        <div className="tag">{L(jl.turlar[j.tur])}{!j.tasdiqlangan && ' · namuna'}</div>
        <h1 className="font-sarlavha font-bold text-[clamp(26px,7vw,36px)] leading-tight mt-1 pr-20">{L(j.nom)}</h1>
        <p className="text-kul mt-3 max-w-[60ch]">{L(j.matn)}</p>
        <div className="text-xs text-kul mt-3 tabular-nums">GPS {j.gps.lat.toFixed(4)}, {j.gps.lng.toFixed(4)}</div>
        {ol && (
          <div className="muhr-anim absolute right-4 top-4 w-24 h-24 rounded-full border-[3px] border-muhr text-muhr grid place-items-center text-center font-extrabold text-[11px] leading-tight -rotate-6">
            SAFAR<br/>KITOBI<br/>✓
          </div>
        )}
      </article>

      <section className="varaq p-5 grid gap-3">
        {ol ? <p className="font-bold text-muhr">✓ {t('olingan')}</p>
          : kalit ? (
            <>
              <button className="btn-oltin" onClick={() => olish(false)} disabled={holat === 'tekshir'}>
                {holat === 'tekshir' ? t('tekshir') : t('olish')}
              </button>
              {holat === 'uzoq' && <p className="text-muhr font-bold">{t('uzoq')} ({xabar})</p>}
              {holat === 'gps_yoq' && <p className="text-muhr">{t('gps_yoq')}</p>}
              {namunaRejimi && (holat === 'uzoq' || holat === 'gps_yoq') &&
                <button className="btn-chiziq" onClick={() => olish(true)}>{t('namuna_ol')}</button>}
            </>
          ) : <p className="text-kul">{t('qr_kerak')}</p>}
        {namunaRejimi && <p className="text-xs text-kul">{t('namuna')}: Supabase ulanmagan, sahifalar shu telefonda saqlanadi.</p>}
      </section>
    </div>
  )
}
