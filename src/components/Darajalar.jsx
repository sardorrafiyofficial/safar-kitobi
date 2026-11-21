import { useTil } from '../lib/i18n.jsx'

// Darajalar tuman.json'dan olinadi: joylar soni har tumanda har xil bo'lishi mumkin
export default function Darajalar({ darajalar, jami, olingan }){
  const { t, L } = useTil()
  const kerak = d => d.joylar === 'hammasi' ? jami : d.joylar
  const rang = { bronza: '#b07a45', kumush: '#8f9aa3', oltin: 'rgb(var(--oltin))' }
  return (
    <section className="varaq p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-sarlavha font-bold text-xl">{t('daraja')}</h2>
        <span className="font-bold tabular-nums">{olingan} / {jami} {t('sahifa')}</span>
      </div>
      <div className="h-2.5 rounded-full bg-chiziq overflow-hidden mb-4">
        <div className="h-full bg-oltin transition-all" style={{ width: `${jami ? olingan / jami * 100 : 0}%` }} />
      </div>
      <ol className="grid gap-2">
        {darajalar.map(d => {
          const n = kerak(d), ochiq = olingan >= n
          return (
            <li key={d.id} className={`flex items-center gap-3 rounded-xl border p-3 ${ochiq ? 'border-oltin bg-oltin/10' : 'border-chiziq'}`}>
              <span className="w-9 h-9 rounded-full grid place-items-center font-extrabold text-white shrink-0" style={{ background: rang[d.id] }}>{n}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{t(d.id)} {ochiq && <span className="text-oltin">· {t('ochildi')}</span>}</div>
                <div className="text-sm text-kul">{L(d.sovga)}</div>
              </div>
              {!ochiq && <span className="text-xs text-kul whitespace-nowrap">{n - olingan} {t('qoldi')}</span>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
