import { useState } from 'react'

const seances = [
  {
    id: 1,
    client: 'Claire Moreau',
    ville: 'Champagnole',
    date: 'Mar 22 juillet · 9h00',
    ecurie: 'Écurie du Moulin',
    traitee: false,
    chevaux: ['Nuage', 'Tempête'],
    prestations: ['Bilan & réglage selle', 'Essai nouvelle selle', 'Vente selle', 'Commande matériel'],
    prestationsChecked: [true, false, false, false],
    montant: '120',
    notes: 'Arçon ajusté 33→31 cm. Nuage a bien réagi. Légère asymétrie dorsale à gauche. Revoir dans 6 mois. Tempête à re-mesurer — a perdu du muscle.',
    photos: ['🐴 Nuage', '📐 Gabarit'],
  },
  {
    id: 2,
    client: 'Laura Petit',
    ville: 'Poligny',
    date: 'Mar 22 juillet · 11h00',
    ecurie: 'Les Écuries du Val',
    traitee: false,
    chevaux: ['Éclair'],
    prestations: ['Bilan & réglage selle', 'Essai nouvelle selle', 'Vente selle', 'Commande matériel'],
    prestationsChecked: [false, false, false, false],
    montant: '',
    notes: '',
    photos: [],
  },
]

const historique = [
  { client: 'Emma Favre', ville: 'Lons-le-Saunier', date: 'Jeu 17 juil', prestation: 'Essai Childéric CSO', photos: 2, facture: '#1047', montant: '80 CHF' },
  { client: 'Nathalie Simon', ville: 'Chalon-sur-Saône', date: 'Mer 10 juil', prestation: 'Bilan & réglage', photos: 5, facture: '#1044', montant: '120 CHF' },
]

export default function Seance() {
  const [seancesState, setSeancesState] = useState(seances)
  const [ouvert, setOuvert] = useState(1)
  const [saved, setSaved] = useState([])

  function togglePrestation(seanceId, idx) {
    setSeancesState(prev => prev.map(s => {
      if (s.id !== seanceId) return s
      const next = [...s.prestationsChecked]
      next[idx] = !next[idx]
      return { ...s, prestationsChecked: next }
    }))
  }

  function updateField(seanceId, field, value) {
    setSeancesState(prev => prev.map(s => s.id !== seanceId ? s : { ...s, [field]: value }))
  }

  function sauvegarder(seanceId) {
    setSaved(prev => [...prev, seanceId])
  }

  return (
    <div className="flex flex-col gap-4">

      {/* À DOCUMENTER */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Séances à documenter</div>
          <div className="text-xs font-semibold text-red-500">
            {seancesState.filter(s => !saved.includes(s.id)).length} en attente
          </div>
        </div>

        <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5 mb-4">
          📋 Documente chaque séance pour générer la facture Odoo et garder un historique complet par cheval.
        </div>

        {seancesState.map(s => (
          <div key={s.id} className={`border rounded-xl p-4 mb-3 last:mb-0 transition-all ${saved.includes(s.id) ? 'opacity-50' : 'border-gray-200'}`}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setOuvert(ouvert === s.id ? null : s.id)}
            >
              <div>
                <div className="text-sm font-bold text-gray-900">{s.client} — {s.ville}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.date} · {s.ecurie}</div>
              </div>
              <div className="flex items-center gap-2">
                {saved.includes(s.id)
                  ? <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">✓ Enregistré</span>
                  : <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">À documenter</span>
                }
                <span className="text-gray-400 text-xs">{ouvert === s.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {ouvert === s.id && !saved.includes(s.id) && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Prestations réalisées</div>
                    {s.prestations.map((p, i) => (
                      <label key={p} className="flex items-center gap-2 text-xs text-gray-900 mb-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={s.prestationsChecked[i]}
                          onChange={() => togglePrestation(s.id, i)}
                          style={{ accentColor: '#1D9E75' }}
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Cheval concerné</div>
                    <select
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none w-full mb-3"
                    >
                      {s.chevaux.map(h => <option key={h}>{h}</option>)}
                    </select>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Montant facturé</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={s.montant}
                        onChange={e => updateField(s.id, 'montant', e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none w-16"
                      />
                      <span className="text-xs text-gray-400">CHF</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Notes de séance</div>
                  <textarea
                    value={s.notes}
                    onChange={e => updateField(s.id, 'notes', e.target.value)}
                    placeholder="Ex : arçon réglé à 33 cm, gabarit légèrement asymétrique..."
                    className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none w-full resize-none focus:border-emerald-400"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Photos & vidéos</div>
                  <div className="flex gap-2 flex-wrap">
                    {s.photos.map(p => (
                      <div key={p} className="w-16 h-16 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center gap-1">
                        <span className="text-lg">{p.split(' ')[0]}</span>
                        <span className="text-xs text-emerald-600 font-semibold">{p.split(' ')[1]}</span>
                      </div>
                    ))}
                    <label className="w-16 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                      <span className="text-2xl text-gray-300">+</span>
                      <span className="text-xs text-gray-400">Ajouter</span>
                      <input type="file" accept="image/*,video/*" multiple className="hidden" />
                    </label>
                  </div>
                  {s.photos.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">{s.photos.length} fichier{s.photos.length > 1 ? 's' : ''} · Synchronisé Odoo ✓</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => sauvegarder(s.id)}
                    className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Enregistrer → Générer facture Odoo
                  </button>
                  <button className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Aperçu facture
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HISTORIQUE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Séances récentes — documentées</div>
          <div className="text-xs text-gray-400">Synchronisé Odoo</div>
        </div>
        {historique.map(h => (
          <div key={h.client} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900">{h.client} — {h.ville}</div>
              <div className="text-xs text-gray-400">{h.date} · {h.prestation} · {h.photos} photos · Facture {h.facture} générée dans Odoo</div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Facturé</span>
              <div className="text-xs text-gray-400 mt-1">{h.montant}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 bg-blue-50 text-blue-700 text-xs rounded-lg p-2.5">
          🔗 Toutes les séances sont synchronisées en temps réel avec Odoo. Les photos sont attachées à la fiche client.
        </div>
      </div>

    </div>
  )
}