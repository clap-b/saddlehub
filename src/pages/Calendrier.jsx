import { useState } from 'react'

const jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const rdvJuillet = {
  1: 'rdv', 3: 'rdv', 8: 'pending', 14: 'rdv',
  15: 'pending', 17: 'today', 22: 'rdv', 24: 'rdv', 28: 'rdv'
}

const rdvDetail = {
  22: [
    { heure: '09h00', client: 'Claire Moreau', lieu: 'Champagnole', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
    { heure: '11h00', client: 'Laura Petit', lieu: 'Poligny', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
    { heure: '14h00', client: 'Emma Favre', lieu: 'Lons-le-Saunier', tag: 'À confirmer', tagColor: 'bg-amber-50 text-amber-700' },
  ],
  24: [
    { heure: '10h00', client: 'Nathalie Simon', lieu: 'Chalon-sur-Saône', tag: 'Nouvelle', tagColor: 'bg-blue-50 text-blue-700' },
  ],
  28: [
    { heure: '09h30', client: 'Hélène Roy', lieu: 'Arbois', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
  ],
}

// Juillet 2026 commence un mercredi → 2 cases vides
const offset = 2

export default function Calendrier() {
  const [jourSelectionne, setJourSelectionne] = useState(22)

  const totalJours = 31
  const cases = []
  for (let i = 0; i < offset; i++) cases.push(null)
  for (let i = 1; i <= totalJours; i++) cases.push(i)

  function getStyle(jour) {
    if (!jour) return ''
    const type = rdvJuillet[jour]
    if (type === 'today') return 'bg-emerald-600 text-white font-bold'
    if (type === 'rdv') return 'bg-emerald-50 text-emerald-700 font-semibold'
    if (type === 'pending') return 'bg-amber-50 text-amber-700'
    return 'text-gray-400 hover:bg-gray-50'
  }

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* CALENDRIER */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-900">Juillet 2026</div>
          <div className="flex gap-2">
            <button className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-50">← Juin</button>
            <button className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-50">Août →</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {jours.map((j, i) => (
            <div key={i} className="text-center text-xs text-gray-400 py-1">{j}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cases.map((jour, i) => (
            <div
              key={i}
              onClick={() => jour && rdvJuillet[jour] && setJourSelectionne(jour)}
              className={`text-center text-xs py-2 rounded-lg transition-colors ${
                jour ? getStyle(jour) + (rdvJuillet[jour] ? ' cursor-pointer' : ' cursor-default') : ''
              } ${jourSelectionne === jour ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {jour || ''}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-400"></div>
            Tournée / RDV confirmé
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></div>
            À confirmer
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 rounded bg-emerald-600"></div>
            Aujourd'hui
          </div>
        </div>
      </div>

      {/* DÉTAIL DU JOUR */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">
          {jourSelectionne ? `RDV du ${jourSelectionne} juillet` : 'Sélectionne un jour'}
        </div>

        {jourSelectionne && rdvDetail[jourSelectionne] ? (
          <div className="flex flex-col gap-2">
            {rdvDetail[jourSelectionne].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <div className="text-xs font-bold text-gray-400 w-10 flex-shrink-0">{r.heure}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900">{r.client}</div>
                  <div className="text-xs text-gray-400">📍 {r.lieu}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${r.tagColor}`}>{r.tag}</span>
              </div>
            ))}
            <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg p-2.5">
              ✓ {rdvDetail[jourSelectionne].length} RDV ce jour — tournée Jura
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">Aucun RDV ce jour.</div>
        )}
      </div>

    </div>
  )
}