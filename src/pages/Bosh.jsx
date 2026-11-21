import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Xarita from '../components/Xarita.jsx'
import { hududlar } from '../lib/data.js'
import { useTil } from '../lib/i18n.jsx'

// Bosh sahifa: O'zbekiston xaritasi va 14 ta hudud
export default function Bosh(){
  const { t, L } = useTil(), nav = useNavigate()
  const [h, setH] = useState([])
  useEffect(() => { hududlar().then(d => setH(d.hududlar)) }, [])
  const ochish = x => x.holat === 'faol' && x.tumanlar[0] && nav(`/${x.id}/${x.tumanlar[0]}`)
  return (
    <div className="wrap grid gap-5 pt-5">
      <section>
        <div className="tag">O'zbekiston · Uzbekistan</div>
        <h1 className="font-sarlavha font-bold text-[clamp(30px,8vw,46px)] leading-[1.05] mt-1">{t('shior')}</h1>
        <p className="text-kul mt-2 max-w-[56ch]">{t('kirish')}</p>
      </section>
      <Xarita markaz={{ lat: 41.2, lng: 64.6 }} zoom={5} balandlik={360}
        nuqtalar={h.map(x => ({ id: x.id, gps: x.gps, nom: L(x.nom), belgi: x.holat === 'faol' ? '✓' : '·', klass: x.holat === 'faol' ? '' : 'tez', bosish: () => ochish(x) }))} />
      <section>
        <h2 className="font-sarlavha font-bold text-xl mb-3">{t('hududlar')}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {h.map(x => (
            <li key={x.id}>
              {x.holat === 'faol'
                ? <Link to={`/${x.id}/${x.tumanlar[0]}`} className="varaq flex justify-between items-center p-3 hover:border-firuza">
                    <span className="font-bold">{L(x.nom)}</span><span className="text-xs font-bold text-white bg-firuza rounded-full px-2 py-0.5">{t('faol')}</span></Link>
                : <div className="varaq flex justify-between items-center p-3 opacity-70">
                    <span className="font-bold">{L(x.nom)}</span><span className="text-xs text-kul">{t('tez_kunda')}</span></div>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
