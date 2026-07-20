import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Accueil from './pages/Accueil'
import Tournee from './pages/Tournee'
import Materiel from './pages/Materiel'
import Clientes from './pages/Clientes'
import Demandes from './pages/Demandes'
import Seance from './pages/Seance'
import Calendrier from './pages/Calendrier'

export default function App() {
  const [current, setCurrent] = useState('accueil')

  const pages = {
    accueil: <Accueil onNavigate={setCurrent} />,
    tournee: <Tournee />,
    materiel: <Materiel />,
    clientes: <Clientes />,
    demandes: <Demandes />,
    seance: <Seance />,
    calendrier: <Calendrier />,
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar current={current} onNavigate={setCurrent} />
      <main className="flex-1 overflow-y-auto p-6">
        {pages[current]}
      </main>
    </div>
  )
}