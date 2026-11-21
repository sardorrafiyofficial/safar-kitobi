import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Bosh from './pages/Bosh.jsx'
import Tuman from './pages/Tuman.jsx'
import Joy from './pages/Joy.jsx'
import Pasport from './pages/Pasport.jsx'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<Bosh />} />
          <Route path="/pasport" element={<Pasport />} />
          <Route path="/:hudud/:tuman" element={<Tuman />} />
          <Route path="/joy/:hudud/:tuman/:joy" element={<Joy />} />
          <Route path="*" element={<Bosh />} />
        </Routes>
      </main>
      <footer className="wrap text-center text-sm text-kul py-6">Safar Kitobi · Royal Fix · royalfix.uz</footer>
    </div>
  )
}
