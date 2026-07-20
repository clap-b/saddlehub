const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'tournee', label: 'Planifier tournée' },
  { id: 'materiel', label: 'Matériel & check-list' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'demandes', label: 'Demandes reçues' },
  { id: 'seance', label: 'Résumés de séance' },
  { id: 'calendrier', label: 'Calendrier' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <div className="w-52 h-screen bg-white border-r border-gray-200 flex flex-col">
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
            onClick={() => onNavigate(item.id)}
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
      </div>
    </div>
  )
}