import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Xarita from '../components/Xarita.jsx'
import Darajalar from '../components/Darajalar.jsx'
import { tuman, joylar, joyKaliti } from '../lib/data.js'
import { olinganmi } from '../lib/sahifalar.js'
import { useTil } from '../lib/i18n.jsx'

export default function Tuman(){
  const { hudud, tuman: tid } = useParams(), nav = useNavigate()
  const { t, L } = useTil()
  const [tm, setTm] = useState(null), [jl, setJl] = useState(null)
  useEffect(() => { tuman(hudud, tid).then(setTm); joylar(hudud, tid).then(setJl) }, [hudud, tid])
  if (!tm || !jl) return <div className="wrap pt-8 text-kul">…</div>
  const list = jl.joylar.map((j, i) => ({ ...j, n: i + 1, ol: olinganmi(joyKaliti(hudud, tid, j.id)) }))
  const olingan = list.filter(j => j.ol).length
  return (
    <div className="wrap grid gap-5 pt-5">
      <section>
        <div className="tag">{hudud} · 39° N</div>
        <h1 className="font-sarlavha font-bold text-[clamp(28px,7vw,40px)] leading-tight mt-1">{L(tm.nom)}</h1>
        <p className="text-kul mt-1">{L(tm.tavsif)}</p>
      </section>
      <Xarita markaz={tm.markaz} zoom={tm.zoom}
        nuqtalar={list.map(j => ({ id: j.id, gps: j.gps, nom: L(j.nom), belgi: j.ol ? '✓' : j.n, klass: j.ol ? 'olingan' : '', bosish: () => nav(`/joy/${hudud}/${tid}/${j.id}`) }))} />
      <Darajalar tuman={`${hudud}/${tid}`} darajalar={tm.darajalar} jami={list.length} olingan={olingan} />
      <section>
        <h2 className="font-sarlavha font-bold text-xl mb-3">{t('joylar')}</h2>
        <ol className="grid gap-2">
          {list.map(j => (
            <li key={j.id}>
              <Link to={`/joy/${hudud}/${tid}/${j.id}`} className="varaq flex items-center gap-3 p-3 hover:border-firuza">
                <span className={`marker shrink-0 ${j.ol ? 'olingan' : ''}`}>{j.ol ? '✓' : j.n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold truncate">{L(j.nom)}</span>
                  <span className="block text-sm text-kul">{L(jl.turlar[j.tur])}{!j.tasdiqlangan && ' · namuna'}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
