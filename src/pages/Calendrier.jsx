import { useState } from 'react'

const jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const rdvInitiaux = {
  1: [{ heure: '09h00', client: 'Claire Moreau', lieu: 'Champagnole', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' }],
  3: [{ heure: '10h00', client: 'Laura Petit', lieu: 'Poligny', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' }],
  8: [{ heure: '09h30', client: 'Emma Favre', lieu: 'Lons-le-Saunier', tag: 'À confirmer', tagColor: 'bg-amber-50 text-amber-700' }],
  14: [{ heure: '11h00', client: 'Nathalie Simon', lieu: 'Chalon-sur-Saône', tag: 'Nouvelle', tagColor: 'bg-blue-50 text-blue-700' }],
  17: [],
  22: [
    { heure: '09h00', client: 'Claire Moreau', lieu: 'Champagnole', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
    { heure: '11h00', client: 'Laura Petit', lieu: 'Poligny', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' },
    { heure: '14h00', client: 'Emma Favre', lieu: 'Lons-le-Saunier', tag: 'À confirmer', tagColor: 'bg-amber-50 text-amber-700' },
  ],
  24: [{ heure: '10h00', client: 'Nathalie Simon', lieu: 'Chalon-sur-Saône', tag: 'Nouvelle', tagColor: 'bg-blue-50 text-blue-700' }],
  28: [{ heure: '09h30', client: 'Hélène Roy', lieu: 'Arbois', tag: 'Confirmé', tagColor: 'bg-emerald-50 text-emerald-700' }],
}

export default function Calendrier() {
  const [jourSelectionne, setJourSelectionne] = useState(22)
  const [rdvs, setRdvs] = useState(rdvInitiaux)
  const [showForm, setShowForm] = useState(false)
  const [newRdv, setNewRdv] = useState({ heure: '09h00', client: '', lieu: '' })
  const [moisActuel, setMoisActuel] = useState(6)
  const [anneeActuelle, setAnneeActuelle] = useState(2026)

  const totalJours = new Date(anneeActuelle, moisActuel + 1, 0).getDate()
  const offsetBrut = new Date(anneeActuelle, moisActuel, 1).getDay()
  const offsetCorrige = offsetBrut === 0 ? 6 : offsetBrut - 1

  const cases = []
  for (let i = 0; i < offsetCorrige; i++) cases.push(null)
  for (let i = 1; i <= totalJours; i++) cases.push(i)

  const today = new Date()
  const isCurrentMonth = today.getMonth() === moisActuel && today.getFullYear() === anneeActuelle
  const todayDay = isCurrentMonth ? today.getDate() : null

  function getStyle(jour) {
    if (!jour) return ''
    const hasRdv = rdvs[jour] && rdvs[jour].length > 0
    if (jour === todayDay) return 'bg-emerald-600 text-white font-bold'
    if (hasRdv) return 'bg-emerald-50 text-emerald-700 font-semibold'
    return 'text-gray-400 hover:bg-gray-50'
  }

  function ajouterRdv() {
    if (!newRdv.client || !newRdv.lieu) return
    const rdv = { ...newRdv, tag: 'À confirmer', tagColor: 'bg-amber-50 text-amber-700' }
    setRdvs(prev => ({
      ...prev,
      [jourSelectionne]: [...(prev[jourSelectionne] || []), rdv]
    }))
    setNewRdv({ heure: '09h00', client: '', lieu: '' })
    setShowForm(false)
  }

  function supprimerRdv(index) {
    setRdvs(prev => ({
      ...prev,
      [jourSelectionne]: prev[jourSelectionne].filter((_, i) => i !== index)
    }))
  }

  function moisPrecedent() {
    if (moisActuel === 0) { setMoisActuel(11); setAnneeActuelle(anneeActuelle - 1) }
    else setMoisActuel(moisActuel - 1)
  }

  function moisSuivant() {
    if (moisActuel === 11) { setMoisActuel(0); setAnneeActuelle(anneeActuelle + 1) }
    else setMoisActuel(moisActuel + 1)
  }

  const nomMois = new Date(anneeActuelle, moisActuel).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* CALENDRIER */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-900 capitalize">{nomMois}</div>
          <div className="flex gap-2">
            <button onClick={moisPrecedent} className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-50">←</button>
            <button onClick={moisSuivant} className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-50">→</button>
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
              onClick={() => jour && setJourSelectionne(jour)}
              className={`text-center text-xs py-2 rounded-lg transition-colors cursor-pointer ${
                jour ? getStyle(jour) : ''
              } ${jourSelectionne === jour ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {jour || ''}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-400"></div>
            RDV confirmé
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
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">
            {jourSelectionne ? `${jourSelectionne} ${nomMois}` : 'Sélectionne un jour'}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            + Ajouter RDV
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3 flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-700">Nouveau RDV — {jourSelectionne} {nomMois}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Heure</div>
                <input
                  type="text"
                  value={newRdv.heure}
                  onChange={e => setNewRdv(prev => ({ ...prev, heure: e.target.value }))}
                  placeholder="09h00"
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Client</div>
                <input
                  type="text"
                  value={newRdv.client}
                  onChange={e => setNewRdv(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="Nom du client"
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Lieu</div>
              <input
                type="text"
                value={newRdv.lieu}
                onChange={e => setNewRdv(prev => ({ ...prev, lieu: e.target.value }))}
                placeholder="Ville / Écurie"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={ajouterRdv} className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                Ajouter
              </button>
              <button onClick={() => setShowForm(false)} className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
            </div>
          </div>
        )}

        {jourSelectionne && rdvs[jourSelectionne] && rdvs[jourSelectionne].length > 0 ? (
          <div className="flex flex-col gap-2">
            {rdvs[jourSelectionne].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl group">
                <div className="text-xs font-bold text-gray-400 w-10 flex-shrink-0">{r.heure}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900">{r.client}</div>
                  <div className="text-xs text-gray-400">📍 {r.lieu}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${r.tagColor}`}>{r.tag}</span>
                <button
                  onClick={() => supprimerRdv(i)}
                  className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="mt-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg p-2.5">
              ✓ {rdvs[jourSelectionne].length} RDV ce jour
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">
            {jourSelectionne ? 'Aucun RDV ce jour — clique sur "+ Ajouter RDV"' : 'Sélectionne un jour dans le calendrier'}
          </div>
        )}
      </div>

    </div>
  )
}