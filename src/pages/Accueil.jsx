export default function Accueil({ onNavigate }) {
  return (
    <div className="flex flex-col gap-4">

      {/* MÉTRIQUES */}
      <div className="grid grid-cols-5 gap-3">
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

      <div className="grid grid-cols-2 gap-4">

        {/* PROCHAINS RDV */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-gray-900">Prochains RDV</div>
            <button onClick={() => onNavigate('calendrier')} className="text-xs text-emerald-600">Voir calendrier →</button>
          </div>
          {[
            { name: 'Claire Moreau', sub: 'Champagnole · Passier Optima', date: 'Mar 22 · 9h', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
            { name: 'Laura Petit', sub: 'Poligny · Réglage arçon', date: 'Mar 22 · 11h', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
            { name: 'Emma Favre', sub: 'Lons-le-Saunier · Selle à essayer', date: 'Mar 22 · 14h', tag: 'À confirmer', tagColor: 'bg-amber-50 text-amber-700' },
            { name: 'Nathalie Simon', sub: 'Chalon-sur-Saône · Nouvelle', date: 'Jeu 24 · 10h', tag: 'Nouvelle', tagColor: 'bg-blue-50 text-blue-700' },
          ].map(r => (
            <div key={r.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900">{r.name}</div>
                <div className="text-xs text-gray-400 truncate">{r.sub}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-400 mb-1">{r.date}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.tagColor}`}>{r.tag}</span>
              </div>
            </div>
          ))}
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
          <div className="mt-3 bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5">
            💡 Sophie Blanc + Marie Duval sont sur le même axe Jura / Doubs. <button onClick={() => onNavigate('tournee')} className="underline">Voir le trajet →</button>
          </div>
          <div className="mt-2 bg-blue-50 text-blue-700 text-xs rounded-lg p-2.5">
            🔗 2 séances du 22 juillet à documenter. <button onClick={() => onNavigate('seance')} className="underline">Compléter les résumés →</button>
          </div>
        </div>

      </div>
    </div>
  )
}