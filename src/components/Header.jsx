import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useTil } from '../lib/i18n.jsx'

export default function Header(){
  const { til, setTil, t } = useTil()
  return (
    <header className="sticky z-[500] bg-qogoz/90 backdrop-blur border-b border-chiziq" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="wrap flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <Logo />
          <span className="font-sarlavha font-bold text-lg leading-none truncate">Safar Kitobi</span>
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/pasport" className="text-sm font-bold text-firuza whitespace-nowrap">{t('sahifalar')}</NavLink>
          <select aria-label="Til" value={til} onChange={e => setTil(e.target.value)}
            className="bg-varaq border border-chiziq rounded-lg text-sm font-bold px-2 py-1">
            <option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option>
          </select>
        </div>
      </div>
    </header>
  )
}
