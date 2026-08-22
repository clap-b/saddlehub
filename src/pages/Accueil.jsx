export default function Accueil({ onNavigate }) {
  const alertes = [
    { type: 'amber', msg: 'Wintec Pro en prêt chez Claire Moreau depuis 3 semaines — à récupérer mardi' },
    { type: 'red', msg: 'Isabelle Renard à rappeler — demande urgente reçue il y a 2 jours' },
    { type: 'blue', msg: '2 séances du 22 juillet à documenter', action: 'seance', label: 'Compléter →' },
  ]

  const prochains7Jours = [
    { date: 'Lun 20', rdvs: [] },
    { date: 'Mar 21', rdvs: [] },
    { date: 'Mer 22', rdvs: ['Claire Moreau', 'Laura Petit', 'Emma Favre'] },
    { date: 'Jeu 23', rdvs: [] },
    { date: 'Ven 24', rdvs: ['Nathalie Simon'] },
    { date: 'Sam 25', rdvs: [] },
    { date: 'Dim 26', rdvs: [] },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* MÉTRIQUES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'RDV ce mois', value: '18', sub: '↑ +4 vs juin', color: 'text-emerald-500' },
          { label: 'Demandes en attente', value: '3', sub: 'À traiter', color: 'text-amber-500' },
          { label: 'Km ce mois', value: '1 240', sub: 'Optimisés par Maps', color: 'text-gray-400' },
          { label: 'Carburant ce mois', value: '142 CHF', sub: '⛽ Estimé Maps', color: 'text-amber-700' },
          { label: 'Prochaine tournée', value: 'Mardi', sub: '3 RDV · Jura', color: 'text-blue-500' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{m.label}</div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className={`text-xs mt-1 ${m.color}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* PROCHAINE TOURNÉE */}
        <div className="bg-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold">🗺 Prochaine tournée — Mardi 22 juillet</div>
            <button
              onClick={() => onNavigate('tournee')}
              className="text-xs bg-white text-emerald-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Voir le trajet →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { heure: '09h00', client: 'Claire Moreau', lieu: 'Champagnole' },
              { heure: '11h00', client: 'Laura Petit', lieu: 'Poligny' },
              { heure: '14h00', client: 'Emma Favre', lieu: 'Lons-le-Saunier' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-emerald-700 rounded-lg px-3 py-2">
                <div className="text-xs font-bold text-emerald-300 w-10">{r.heure}</div>
                <div className="flex-1 text-xs font-semibold">{r.client}</div>
                <div className="text-xs text-emerald-300">📍 {r.lieu}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-emerald-300">224 km · 5h30 · ~38 CHF carburant</div>
        </div>

        {/* RACCOURCIS RAPIDES */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm font-bold text-gray-900 mb-3">Actions rapides</div>
          <div className="grid grid-cols-2 gap-2">
            {[
  { label: '🗺 Nouvelle tournée', page: 'tournee', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: '👤 Nouveau client', page: 'clients', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: '📦 Vérifier stock', page: 'materiel', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: '📩 Demandes reçues', page: 'demandes', color: 'bg-red-50 text-red-700 border-red-200' },
].map(r => (
  <button
    key={r.label}
    onClick={() => onNavigate(r.page)}
    className={`border rounded-xl p-3 text-xs font-semibold text-left transition-all hover:shadow-sm ${r.color}`}
  >
    {r.label}
  </button>
))}
          </div>
        </div>

      </div>

      {/* ALERTES */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">⚡ Alertes</div>
        <div className="flex flex-col gap-2">
          {alertes.map((a, i) => (
            <div key={i} className={`text-xs rounded-lg p-2.5 flex items-center justify-between ${
              a.type === 'red' ? 'bg-red-50 text-red-700' :
              a.type === 'amber' ? 'bg-amber-50 text-amber-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              <span>{a.msg}</span>
              {a.action && (
                <button
                  onClick={() => onNavigate(a.action)}
                  className="ml-3 font-semibold underline flex-shrink-0"
                >
                  {a.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7 PROCHAINS JOURS */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">7 prochains jours</div>
          <button onClick={() => onNavigate('calendrier')} className="text-xs text-emerald-600">Voir calendrier →</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {prochains7Jours.map((j, i) => (
            <div
              key={i}
              onClick={() => onNavigate('calendrier')}
              className={`rounded-xl p-2 text-center cursor-pointer transition-all ${
                j.rdvs.length > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{j.date.split(' ')[0]}</div>
              <div className={`text-sm font-bold ${j.rdvs.length > 0 ? 'text-emerald-700' : 'text-gray-300'}`}>
                {j.date.split(' ')[1]}
              </div>
              {j.rdvs.length > 0 && (
                <div className="text-xs text-emerald-600 font-semibold mt-1">{j.rdvs.length} RDV</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DEMANDES */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Demandes à traiter</div>
          <button onClick={() => onNavigate('demandes')} className="text-xs text-emerald-600">Tout voir →</button>
        </div>
        {[
          { name: 'Isabelle Renard', sub: 'Instagram · selle qui blesse · Dole', color: 'bg-red-500', btn: 'Répondre', page: 'demandes' },
          { name: 'Sophie Blanc', sub: 'WhatsApp · Dispo lun/jeu · Jura', color: 'bg-amber-400', btn: 'Placer', page: 'tournee' },
          { name: 'Marie Duval', sub: 'SMS · Recommandée par Claire · Pontarlier', color: 'bg-amber-400', btn: 'Placer', page: 'tournee' },
        ].map(d => (
          <div key={d.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.color}`}></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900">{d.name}</div>
              <div className="text-xs text-gray-400 truncate">{d.sub}</div>
            </div>
            <button onClick={() => onNavigate(d.page)} className="text-xs border border-emerald-500 text-emerald-600 px-2 py-1 rounded-md flex-shrink-0 hover:bg-emerald-50">
              {d.btn}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}