import { useState } from 'react'

const materielData = [
  {
    categorie: 'Selles à emporter',
    items: ['Passier Optima', 'Wintec Pro', 'Childéric CSO', 'Arçon ajustable', 'Arçon XL', 'Antarès Contact'],
    checked: [true, true, false, true, false, false],
  },
  {
    categorie: 'Équipement & outils',
    items: ['Jauge gabarit', 'Kit réglage', 'Tapis d\'essai', 'Bourrelets mousse', 'Sangles d\'essai', 'iPhone / caméra'],
    checked: [true, true, true, false, false, true],
  },
  {
    categorie: 'Documents & admin',
    items: ['Fiches clients', 'Bons commande', 'Terminal paiement'],
    checked: [true, true, false],
  },
]

const checklist = [
  { label: 'Selles chargées dans le van', cat: 'Matériel', done: true },
  { label: 'Outils & kit réglage', cat: 'Matériel', done: true },
  { label: 'Fiches clients imprimées', cat: 'Admin', done: false },
  { label: 'Téléphone chargé', cat: 'Perso', done: false },
  { label: 'Terminal paiement', cat: 'Admin', done: false },
  { label: 'Itinéraire ouvert — Google Maps', cat: 'Trajet', done: false },
  { label: '3 clients confirmés par SMS', cat: 'Clients', done: false },
  { label: 'Repas & eau pour la journée', cat: 'Perso', done: false },
]

export default function Materiel() {
  const [mat, setMat] = useState(materielData)
  const [checks, setChecks] = useState(checklist)

  function toggleMat(catIdx, itemIdx) {
    const next = mat.map((cat, ci) => {
      if (ci !== catIdx) return cat
      const nextChecked = [...cat.checked]
      nextChecked[itemIdx] = !nextChecked[itemIdx]
      return { ...cat, checked: nextChecked }
    })
    setMat(next)
  }

  function toggleCheck(i) {
    const next = [...checks]
    next[i] = { ...next[i], done: !next[i].done }
    setChecks(next)
  }

  const doneCount = checks.filter(c => c.done).length
  const progress = Math.round((doneCount / checks.length) * 100)

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* MATÉRIEL */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-1">Matériel — Tournée Jura · Mardi 22 juillet</div>
        <div className="bg-blue-50 text-blue-700 text-xs rounded-lg p-2.5 mb-4">
          🧠 Matériel suggéré automatiquement en fonction des 3 RDV et des fiches chevaux.
        </div>

        {mat.map((cat, ci) => (
          <div key={cat.categorie} className="mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">{cat.categorie}</div>
            <div className="grid grid-cols-3 gap-1.5">
              {cat.items.map((item, ii) => (
                <div
                  key={item}
                  onClick={() => toggleMat(ci, ii)}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1.5 border rounded-lg cursor-pointer transition-all ${
                    cat.checked[ii]
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded flex-shrink-0 border flex items-center justify-center text-white ${cat.checked[ii] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                    {cat.checked[ii] && <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 5 4.5 7.5 8 3"/></svg>}
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CHECKLIST */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-gray-900">Check-list de départ</div>
          <div className="text-xs text-gray-400">Mardi matin avant 7h30</div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progression</span>
            <span>{doneCount} / {checks.length}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          {checks.map((c, i) => (
            <div
              key={c.label}
              onClick={() => toggleCheck(i)}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer group"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${c.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-emerald-400'}`}>
                {c.done && <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 5 4.5 7.5 8 3"/></svg>}
              </div>
              <div className={`flex-1 text-xs transition-all ${c.done ? 'line-through text-gray-300' : 'text-gray-900'}`}>
                {c.label}
              </div>
              <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">{c.cat}</span>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="mt-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg p-2.5 text-center font-semibold">
            ✓ Tout est prêt — bonne tournée Tammy !
          </div>
        )}
      </div>

    </div>
  )
}