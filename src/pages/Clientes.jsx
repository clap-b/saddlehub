import { useState } from 'react'

const clientes = [
  {
    id: 1,
    name: 'Claire Moreau',
    ecurie: 'Écurie du Moulin',
    ville: 'Champagnole',
    email: 'claire.moreau@email.fr',
    tel: '+33 6 12 34 56 78',
    dispo: 'Mardi, jeudi · Matin de préférence',
    contact: 'SMS',
    tag: 'RDV mardi',
    tagColor: 'bg-emerald-50 text-emerald-700',
    dotColor: 'bg-emerald-500',
    chevaux: [
      { name: 'Nuage', selle: 'Passier Optima', arcon: 'Arçon 33', etat: 'Bon', tag: 'OK', tagColor: 'bg-emerald-50 text-emerald-700' },
      { name: 'Tempête', selle: 'Selle à réviser', arcon: 'Gabarit à re-mesurer', etat: 'A maigri depuis mars', tag: 'À vérifier', tagColor: 'bg-amber-50 text-amber-700' },
    ],
    note: 'Prévoir arçon plus étroit pour Tempête. Claire recommande souvent de nouvelles clientes.',
  },
  {
    id: 2,
    name: 'Laura Petit',
    ecurie: 'Les Écuries du Val',
    ville: 'Poligny',
    email: 'laura.petit@email.fr',
    tel: '+33 6 23 45 67 89',
    dispo: 'Mardi · Toute la journée',
    contact: 'WhatsApp',
    tag: 'RDV mardi',
    tagColor: 'bg-emerald-50 text-emerald-700',
    dotColor: 'bg-emerald-500',
    chevaux: [
      { name: 'Éclair', selle: 'Wintec Pro', arcon: 'Arçon 31', etat: 'Bon', tag: 'OK', tagColor: 'bg-emerald-50 text-emerald-700' },
    ],
    note: 'Arçon à régler — légère tension dorsale droite observée au dernier RDV.',
  },
  {
    id: 3,
    name: 'Isabelle Renard',
    ecurie: 'Haras de la Forêt',
    ville: 'Dole',
    email: 'isabelle.renard@email.fr',
    tel: '+33 6 34 56 78 90',
    dispo: 'Lundi, mercredi',
    contact: 'Instagram',
    tag: 'À rappeler',
    tagColor: 'bg-red-50 text-red-600',
    dotColor: 'bg-red-500',
    chevaux: [
      { name: 'Mistral', selle: 'Selle trop petite', arcon: 'À mesurer', etat: 'Blessures sur le dos', tag: 'Urgent', tagColor: 'bg-red-50 text-red-600' },
    ],
    note: 'Urgent — selle douloureuse. Contacter avant mardi.',
  },
  {
    id: 4,
    name: 'Nathalie Simon',
    ecurie: 'Haras du Lac',
    ville: 'Chalon-sur-Saône',
    email: 'nathalie.simon@email.fr',
    tel: '+33 6 45 67 89 01',
    dispo: 'Jeudi, vendredi',
    contact: 'Email',
    tag: 'Nouvelle',
    tagColor: 'bg-blue-50 text-blue-600',
    dotColor: 'bg-blue-400',
    chevaux: [],
    note: 'Nouvelle cliente — fiche cheval à compléter lors du premier RDV.',
  },
  {
    id: 5,
    name: 'Hélène Roy',
    ecurie: 'Écurie du Soleil',
    ville: 'Arbois',
    email: 'helene.roy@email.fr',
    tel: '+33 6 56 78 90 12',
    dispo: 'Mercredi',
    contact: 'SMS',
    tag: 'À relancer',
    tagColor: 'bg-gray-100 text-gray-500',
    dotColor: 'bg-gray-300',
    chevaux: [
      { name: 'Soleil', selle: 'Antarès Contact', arcon: 'Arçon 32', etat: 'Bon', tag: 'OK', tagColor: 'bg-emerald-50 text-emerald-700' },
    ],
    note: 'Dernier RDV il y a 6 mois — à relancer pour un bilan.',
  },
]

export default function Clientes() {
  const [selected, setSelected] = useState(clientes[0])

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* LISTE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Toutes les clientes</div>
          <div className="text-xs text-gray-400">24 clientes actives</div>
        </div>
        <div className="flex flex-col">
          {clientes.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer rounded-lg px-2 transition-colors ${selected.id === c.id ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotColor}`}></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-400 truncate">{c.ecurie} · {c.ville}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.tagColor}`}>{c.tag}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-xs border border-dashed border-gray-300 text-gray-400 rounded-lg py-2 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
          + Nouvelle cliente
        </button>
      </div>

      {/* FICHE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-900">Fiche — {selected.name}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selected.tagColor}`}>{selected.tag}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Coordonnées</div>
            <div className="text-xs text-gray-900">{selected.email}</div>
            <div className="text-xs text-gray-400 mt-1">{selected.tel}</div>
            <div className="text-xs text-gray-400 mt-1">📍 {selected.ecurie}, {selected.ville}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Disponibilités</div>
            <div className="text-xs text-gray-900">{selected.dispo}</div>
            <div className="text-xs text-gray-400 mt-1">Contact préféré : {selected.contact}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Chevaux</div>
          {selected.chevaux.length === 0 ? (
            <div className="text-xs text-gray-400 italic">Aucun cheval enregistré pour l'instant.</div>
          ) : (
            selected.chevaux.map(h => (
              <div key={h.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-xs flex-shrink-0">🐴</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900">{h.name}</div>
                  <div className="text-xs text-gray-400">{h.selle} · {h.arcon} · {h.etat}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.tagColor}`}>{h.tag}</span>
              </div>
            ))
          )}
        </div>

        {selected.note && (
          <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5">
            📝 {selected.note}
          </div>
        )}
      </div>

    </div>
  )
}