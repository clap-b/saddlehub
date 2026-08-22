import { useState } from 'react'

const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'tournee', label: 'Planifier tournée' },
  { id: 'materiel', label: 'Matériel & check-list' },
  { id: 'clients', label: 'Clients' },
  { id: 'demandes', label: 'Demandes reçues' },
  { id: 'seance', label: 'Résumés de séance' },
  { id: 'calendrier', label: 'Calendrier' },
]

export default function Sidebar({ current, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(id) {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-52 h-screen bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm font-bold text-gray-900">
            saddle<span className="text-emerald-600">hub</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Tammy · Espace Pro</div>
        </div>
        <nav className="flex-1 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-l-2 ${
                current === item.id
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border-emerald-500'
                  : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400 space-y-1">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>Google Calendar</div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>Google Maps API</div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>Odoo · synchro active</div>
          <button onClick={onLogout} className="mt-3 w-full text-xs text-gray-400 hover:text-red-500 transition-colors text-left">→ Se déconnecter</button>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-bold text-gray-900">
          saddle<span className="text-emerald-600">hub</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-500 hover:text-gray-900"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l12 12M4 16L16 4"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 5h16M2 10h16M2 15h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 bottom-0 z-40 bg-white border-t border-gray-100 overflow-y-auto">
          <nav className="py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full text-left px-6 py-4 text-sm transition-colors border-l-4 ${
                  current === item.id
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border-emerald-500'
                    : 'text-gray-500 border-transparent hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-600">
              → Se déconnecter
            </button>
          </div>
        </div>
      )}
    </>
  )
}