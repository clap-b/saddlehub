import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Accueil from './pages/Accueil'
import Tournee from './pages/Tournee'
import Materiel from './pages/Materiel'
import Clients from './pages/Clientes'
import Demandes from './pages/Demandes'
import Seance from './pages/Seance'
import Calendrier from './pages/Calendrier'
import Parametres from './pages/Parametres'

export default function App() {
  const [current, setCurrent] = useState('accueil')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const pages = {
    accueil: <Accueil onNavigate={setCurrent} />,
    tournee: <Tournee />,
    materiel: <Materiel />,
    clients: <Clients />,
    demandes: <Demandes onNavigate={setCurrent} />,
    seance: <Seance />,
    calendrier: <Calendrier />,
    parametres: <Parametres />,
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-sm text-gray-400">Chargement...</div>
    </div>
  )

  if (!user) return <Login onLogin={setUser} />

  return (
    <div className="flex h-screen bg-gray-50">
  <Sidebar current={current} onNavigate={setCurrent} onLogout={() => supabase.auth.signOut()} />
  <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
    {pages[current]}
  </main>
</div>
  )
}