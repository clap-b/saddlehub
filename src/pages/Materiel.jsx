import { useState, useEffect } from 'react'
import { getProduits } from '../services/odoo'

const stockInitial = [
  {
    lieu: 'Camion CH 🇨🇭',
    items: [
      { id: 1, nom: 'Passier Optima', type: 'Selle', statut: 'Disponible' },
      { id: 2, nom: 'Wintec Pro', type: 'Selle', statut: 'En prêt chez Claire Moreau — Écurie du Moulin' },
      { id: 3, nom: 'Childéric CSO', type: 'Selle', statut: 'Disponible' },
      { id: 4, nom: 'Kit réglage arçon', type: 'Outil', statut: 'Disponible' },
      { id: 5, nom: 'Jauge gabarit', type: 'Outil', statut: 'Disponible' },
    ]
  },
  {
    lieu: 'Camion FR 🇫🇷',
    items: [
      { id: 6, nom: 'Antarès Contact', type: 'Selle', statut: 'Disponible' },
      { id: 7, nom: 'Devoucoux Biarritz', type: 'Selle', statut: 'Disponible' },
      { id: 8, nom: "Tapis d'essai", type: 'Accessoire', statut: 'Disponible' },
      { id: 9, nom: "Sangles d'essai", type: 'Accessoire', statut: 'Disponible' },
    ]
  },
  {
    lieu: 'Local CH 🇨🇭',
    items: [
      { id: 10, nom: 'Stubben Scandica', type: 'Selle', statut: 'Disponible' },
      { id: 11, nom: 'Arçon XL', type: 'Outil', statut: 'Disponible' },
      { id: 12, nom: 'Bourrelets mousse', type: 'Accessoire', statut: 'Disponible' },
    ]
  },
  {
    lieu: 'Local FR 🇫🇷',
    items: [
      { id: 13, nom: 'Pessoa Genesis', type: 'Selle', statut: 'Disponible' },
      { id: 14, nom: 'Kit nettoyage', type: 'Accessoire', statut: 'Disponible' },
    ]
  },
]

const checklist = [
  { label: 'Selles chargées dans le camion', cat: 'Matériel', done: true },
  { label: 'Outils & kit réglage', cat: 'Matériel', done: true },
  { label: 'Fiches clients imprimées', cat: 'Admin', done: false },
  { label: 'Téléphone chargé', cat: 'Perso', done: false },
  { label: 'Terminal paiement', cat: 'Admin', done: false },
  { label: 'Itinéraire ouvert — Google Maps', cat: 'Trajet', done: false },
  { label: '3 clients confirmés par SMS', cat: 'Clients', done: false },
  { label: 'Repas & eau pour la journée', cat: 'Perso', done: false },
]

const statutColor = (statut) => {
  if (statut === 'Disponible') return 'bg-emerald-50 text-emerald-700'
  if (statut.startsWith('En prêt')) return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

export default function Materiel() {
  const [stock, setStock] = useState(stockInitial)
  const [checks, setChecks] = useState(checklist)
  const [stockOuvert, setStockOuvert] = useState('Camion CH 🇨🇭')
  const [filtre, setFiltre] = useState('Tous')
  const [showAjout, setShowAjout] = useState(false)
  const [nouvelArticle, setNouvelArticle] = useState({ nom: '', type: 'Selle', statut: 'Disponible' })
  const [editItem, setEditItem] = useState(null)
  const [editStatut, setEditStatut] = useState('')

  useEffect(() => {
    getProduits().then(data => {
      console.log('Produits Odoo:', data)
    })
  }, [])

  function toggleCheck(i) {
    const next = [...checks]
    next[i] = { ...next[i], done: !next[i].done }
    setChecks(next)
  }

  function ajouterArticle() {
    if (!nouvelArticle.nom) return
    const newId = Math.max(...stock.flatMap(s => s.items.map(i => i.id))) + 1
    setStock(prev => prev.map(s =>
      s.lieu === stockOuvert
        ? { ...s, items: [...s.items, { id: newId, ...nouvelArticle }] }
        : s
    ))
    setNouvelArticle({ nom: '', type: 'Selle', statut: 'Disponible' })
    setShowAjout(false)
  }

  function supprimerArticle(itemId) {
    setStock(prev => prev.map(s => ({
      ...s,
      items: s.items.filter(i => i.id !== itemId)
    })))
  }

  function sauvegarderStatut(itemId) {
    setStock(prev => prev.map(s => ({
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, statut: editStatut } : i)
    })))
    setEditItem(null)
  }

  const doneCount = checks.filter(c => c.done).length
  const progress = Math.round((doneCount / checks.length) * 100)

  const stockActuel = stock.find(s => s.lieu === stockOuvert)
  const itemsFiltres = filtre === 'Tous'
    ? stockActuel.items
    : stockActuel.items.filter(i => i.type === filtre)

  const enPret = stock.flatMap(s => s.items).filter(i => i.statut.startsWith('En prêt'))

  return (
    <div className="flex flex-col gap-4">

      {/* STOCK */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Stock de matériel</div>
          <button
            onClick={() => setShowAjout(!showAjout)}
            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {/* FORMULAIRE AJOUT */}
        {showAjout && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-700">Nouvel article — {stockOuvert}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Nom</div>
                <input
                  type="text"
                  value={nouvelArticle.nom}
                  onChange={e => setNouvelArticle(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Ex : Passier Optima"
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Type</div>
                <select
                  value={nouvelArticle.type}
                  onChange={e => setNouvelArticle(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none"
                >
                  <option>Selle</option>
                  <option>Outil</option>
                  <option>Accessoire</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={ajouterArticle} className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded-lg hover:bg-emerald-700 font-semibold">
                Ajouter
              </button>
              <button onClick={() => setShowAjout(false)} className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* TABS LIEUX */}
        <div className="flex gap-1 mb-4 bg-gray-50 rounded-lg p-1 flex-wrap">
          {stock.map(s => (
            <button
              key={s.lieu}
              onClick={() => setStockOuvert(s.lieu)}
              className={`flex-1 text-xs py-1.5 rounded-md font-semibold transition-all ${
                stockOuvert === s.lieu ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {s.lieu}
            </button>
          ))}
        </div>

        {/* FILTRES TYPE */}
        <div className="flex gap-2 mb-3">
          {['Tous', 'Selle', 'Outil', 'Accessoire'].map(f => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                filtre === f
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-gray-200 text-gray-500 hover:border-emerald-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LISTE ITEMS */}
        <div className="flex flex-col gap-2">
          {itemsFiltres.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900">{item.nom}</div>
                <div className="text-xs text-gray-400">{item.type}</div>
              </div>
              {editItem === item.id ? (
  <div className="flex items-center gap-1">
    <select
      value={editStatut.startsWith('En prêt') ? 'En prêt' : editStatut}
      onChange={e => setEditStatut(e.target.value)}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 outline-none"
    >
      <option value="Disponible">Disponible</option>
      <option value="En prêt">En prêt chez...</option>
      <option value="En réparation">En réparation</option>
      <option value="Vendu">Vendu</option>
    </select>
    {editStatut.startsWith('En prêt') && (
      <input
        type="text"
        value={editStatut.startsWith('En prêt') ? editStatut : 'En prêt chez '}
        onChange={e => {
  if (e.target.value === 'En prêt') {
    setEditStatut('En prêt chez ')
  } else {
    setEditStatut(e.target.value)
  }
}}
        placeholder="En prêt chez..."
        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 outline-none w-36"
      />
    )}
    <button onClick={() => sauvegarderStatut(item.id)} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-lg">✓</button>
    <button onClick={() => setEditItem(null)} className="text-xs text-gray-400 px-1">✕</button>
  </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => { setEditItem(item.id); setEditStatut(item.statut) }}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold cursor-pointer hover:opacity-80 ${statutColor(item.statut)}`}
                  >
                    {item.statut}
                  </span>
                  <button
                    onClick={() => supprimerArticle(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
          {itemsFiltres.length === 0 && (
            <div className="text-xs text-gray-400 italic text-center py-4">Aucun article dans ce lieu</div>
          )}
        </div>

        {/* EN PRÊT */}
        {enPret.length > 0 && (
          <div className="mt-3 bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5">
            <div>⚠️ Selle(s) en prêt en ce moment :</div>
            {enPret.map((item, i) => (
              <div key={i} className="mt-1 font-semibold">· {item.nom} — {item.statut.replace('En prêt ', '')}</div>
            ))}
          </div>
        )}
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