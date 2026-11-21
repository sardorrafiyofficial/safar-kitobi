import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { hududlar, tuman, joylar, joyKaliti } from '../lib/data.js'
import { mahalliy } from '../lib/sahifalar.js'
import { useTil } from '../lib/i18n.jsx'

// Turistning barcha sahifalari: faol tumanlar bo'yicha
export default function Pasport(){
  const { t, L } = useTil()
  const [qator, setQator] = useState(null)
  useEffect(() => { (async () => {
    const o = mahalliy(), h = (await hududlar()).hududlar.filter(x => x.holat === 'faol'), res = []
    for (const x of h) for (const tm of x.tumanlar){
      const jl = await joylar(x.id, tm), tj = await tuman(x.id, tm)
      res.push({ hudud: x, tuman: tm, tnom: tj.nom, joylar: jl.joylar.map(j => ({ ...j, ol: Boolean(o[joyKaliti(x.id, tm, j.id)]) })) })
    }
    setQator(res)
  })() }, [])
  if (!qator) return <div className="wrap pt-8 text-kul">…</div>
  const jami = qator.reduce((s, q) => s + q.joylar.filter(j => j.ol).length, 0)
  return (
    <div className="wrap grid gap-5 pt-5">
      <h1 className="font-sarlavha font-bold text-3xl">{t('sahifalar')}</h1>
      {jami === 0 && <p className="varaq p-4 text-kul">{t('hali_yoq')}</p>}
      {qator.map(q => (
        <section key={q.tuman} className="varaq p-4">
          <Link to={`/${q.hudud.id}/${q.tuman}`} className="font-bold text-firuza">{L(q.hudud.nom)} · {q.tnom ? L(q.tnom) : q.tuman}</Link>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-3">
            {q.joylar.map((j, i) => (
              <div key={j.id} title={L(j.nom)}
                className={`aspect-square rounded-full grid place-items-center text-sm font-extrabold ${j.ol ? 'border-[3px] border-muhr text-muhr -rotate-6' : 'border-2 border-dashed border-chiziq text-kul'}`}>
                {j.ol ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
