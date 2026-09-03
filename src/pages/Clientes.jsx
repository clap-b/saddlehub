import { useState, useEffect } from 'react'
import { getClients } from '../services/odoo'

const clientsData = [
  {
    id: 1,
    name: 'Claire Moreau',
    ecurie: 'Écurie du Moulin',
    ville: 'Champagnole',
    adresseEcurie: 'Chemin des Prés, 39300 Champagnole',
    adressePerso: '12 rue des Lilas, 39300 Champagnole',
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
    historique: [
      { date: 'Mar 22 juil 2025', prestation: 'Bilan & réglage', cheval: 'Nuage', montant: '120 CHF', facture: '#1052' },
      { date: 'Mer 10 jan 2025', prestation: 'Ajustement arçon', cheval: 'Tempête', montant: '80 CHF', facture: '#1033' },
    ],
    note: 'Prévoir arçon plus étroit pour Tempête. Claire recommande souvent de nouveaux clients.',
  },
  {
    id: 2,
    name: 'Laura Petit',
    ecurie: 'Les Écuries du Val',
    ville: 'Poligny',
    adresseEcurie: 'Route du Val, 39800 Poligny',
    adressePerso: '5 allée des Roses, 39800 Poligny',
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
    historique: [
      { date: 'Mar 22 juil 2025', prestation: 'Réglage arçon', cheval: 'Éclair', montant: '80 CHF', facture: '#1053' },
    ],
    note: 'Arçon à régler — légère tension dorsale droite observée au dernier RDV.',
  },
  {
    id: 3,
    name: 'Isabelle Renard',
    ecurie: 'Haras de la Forêt',
    ville: 'Dole',
    adresseEcurie: 'Forêt de Chaux, 39100 Dole',
    adressePerso: '8 rue du Château, 39100 Dole',
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
    historique: [],
    note: 'Urgent — selle douloureuse. Contacter avant mardi.',
  },
  {
    id: 4,
    name: 'Nathalie Simon',
    ecurie: 'Haras du Lac',
    ville: 'Chalon-sur-Saône',
    adresseEcurie: 'Route du Lac, 71100 Chalon-sur-Saône',
    adressePerso: '3 impasse des Vignes, 71100 Chalon-sur-Saône',
    email: 'nathalie.simon@email.fr',
    tel: '+33 6 45 67 89 01',
    dispo: 'Jeudi, vendredi',
    contact: 'Email',
    tag: 'Nouvelle',
    tagColor: 'bg-blue-50 text-blue-600',
    dotColor: 'bg-blue-400',
    chevaux: [],
    historique: [],
    note: 'Nouveau client — fiche cheval à compléter lors du premier RDV.',
  },
  {
    id: 5,
    name: 'Hélène Roy',
    ecurie: 'Écurie du Soleil',
    ville: 'Arbois',
    adresseEcurie: 'Chemin du Soleil, 39600 Arbois',
    adressePerso: '17 rue des Vignes, 39600 Arbois',
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
    historique: [
      { date: 'Mer 10 jan 2025', prestation: 'Bilan complet', cheval: 'Soleil', montant: '120 CHF', facture: '#1031' },
    ],
    note: 'Dernier RDV il y a 6 mois — à relancer pour un bilan.',
  },
]

export default function Clients() {
  const [clients, setClients] = useState(clientsData)
  const [selected, setSelected] = useState(clientsData[0])
  const [onglet, setOnglet] = useState('infos')
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [showNouveauClient, setShowNouveauClient] = useState(false)
  const [showNouveauCheval, setShowNouveauCheval] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', ecurie: '', ville: '', email: '', tel: '', dispo: '', contact: 'SMS' })
  const [newCheval, setNewCheval] = useState({ name: '', selle: '', arcon: '', etat: '' })

  useEffect(() => {
    getClients().then(data => {
      console.log('Clients Odoo:', data)
    })
  }, [])

  function ajouterClient() {
    if (!newClient.name) return
    const client = {
      id: Date.now(),
      ...newClient,
      adresseEcurie: '',
      adressePerso: '',
      tag: 'Nouvelle',
      tagColor: 'bg-blue-50 text-blue-600',
      dotColor: 'bg-blue-400',
      chevaux: [],
      historique: [],
      note: '',
    }
    setClients(prev => [...prev, client])
    setSelected(client)
    setNewClient({ name: '', ecurie: '', ville: '', email: '', tel: '', dispo: '', contact: 'SMS' })
    setShowNouveauClient(false)
  }

  function ajouterCheval() {
    if (!newCheval.name) return
    const cheval = {
      ...newCheval,
      tag: 'OK',
      tagColor: 'bg-emerald-50 text-emerald-700',
    }
    setClients(prev => prev.map(c =>
      c.id === selected.id ? { ...c, chevaux: [...c.chevaux, cheval] } : c
    ))
    setSelected(prev => ({ ...prev, chevaux: [...prev.chevaux, cheval] }))
    setNewCheval({ name: '', selle: '', arcon: '', etat: '' })
    setShowNouveauCheval(false)
  }

  const clientsFiltres = clients.filter(c => {
    const matchRecherche = c.name.toLowerCase().includes(recherche.toLowerCase()) ||
      c.ville.toLowerCase().includes(recherche.toLowerCase())
    const matchStatut = filtreStatut === 'Tous' || c.tag === filtreStatut
    return matchRecherche && matchStatut
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* LISTE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Tous les clients</div>
          <div className="text-xs text-gray-400">{clientsFiltres.length} clients</div>
        </div>

        <input
          type="text"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400 mb-3"
        />

        <div className="flex gap-1 mb-3 flex-wrap">
          {['Tous', 'RDV mardi', 'À rappeler', 'Nouvelle', 'À relancer'].map(f => (
            <button
              key={f}
              onClick={() => setFiltreStatut(f)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                filtreStatut === f
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-gray-200 text-gray-500 hover:border-emerald-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {clientsFiltres.map(c => (
            <div
              key={c.id}
              onClick={() => { setSelected(c); setOnglet('infos') }}
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
          {clientsFiltres.length === 0 && (
            <div className="text-xs text-gray-400 italic text-center py-4">Aucun client trouvé</div>
          )}
        </div>

        <button
          onClick={() => setShowNouveauClient(true)}
          className="mt-3 w-full text-xs border border-dashed border-gray-300 text-gray-400 rounded-lg py-2 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          + Nouveau client
        </button>
      </div>

      {/* FICHE */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">{selected.name}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selected.tagColor}`}>{selected.tag}</span>
        </div>

        <div className="flex gap-1 mb-4 bg-gray-50 rounded-lg p-1">
          {['infos', 'chevaux', 'historique'].map(o => (
            <button
              key={o}
              onClick={() => setOnglet(o)}
              className={`flex-1 text-xs py-1.5 rounded-md font-semibold transition-all ${
                onglet === o ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {o === 'infos' ? 'Infos' : o === 'chevaux' ? 'Chevaux' : 'Historique'}
            </button>
          ))}
        </div>

        {onglet === 'infos' && (
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Contact</div>
              <div className="text-xs text-gray-900">{selected.email}</div>
              <div className="text-xs text-gray-400 mt-1">{selected.tel}</div>
              <div className="text-xs text-gray-400 mt-1">Contact préféré : {selected.contact}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Adresse de facturation</div>
              <div className="text-xs text-gray-900">🏠 {selected.adressePerso}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Adresse écurie</div>
              <div className="text-xs text-gray-900">🐴 {selected.adresseEcurie}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Disponibilités</div>
              <div className="text-xs text-gray-900">{selected.dispo}</div>
            </div>
            {selected.note && (
              <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5">
                📝 {selected.note}
              </div>
            )}
          </div>
        )}

        {onglet === 'chevaux' && (
          <div>
            {selected.chevaux.length === 0 ? (
              <div className="text-xs text-gray-400 italic">Aucun cheval enregistré pour l'instant.</div>
            ) : (
              selected.chevaux.map(h => (
                <div key={h.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-sm flex-shrink-0">🐴</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900">{h.name}</div>
                    <div className="text-xs text-gray-400">{h.selle} · {h.arcon} · {h.etat}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.tagColor}`}>{h.tag}</span>
                </div>
              ))
            )}
            <button
              onClick={() => setShowNouveauCheval(true)}
              className="mt-3 w-full text-xs border border-dashed border-gray-300 text-gray-400 rounded-lg py-2 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
            >
              + Ajouter un cheval
            </button>
          </div>
        )}

        {onglet === 'historique' && (
          <div>
            {selected.historique.length === 0 ? (
              <div className="text-xs text-gray-400 italic">Aucune séance passée.</div>
            ) : (
              selected.historique.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900">{h.prestation} — {h.cheval}</div>
                    <div className="text-xs text-gray-400">{h.date} · Facture {h.facture} · Odoo</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">{h.montant}</span>
                </div>
              ))
            )}
            <div className="mt-3 bg-blue-50 text-blue-700 text-xs rounded-lg p-2.5">
              🔗 Historique synchronisé avec Odoo
            </div>
          </div>
        )}
      </div>

      {/* POPUP NOUVEAU CLIENT */}
      {showNouveauClient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setShowNouveauClient(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-gray-900">Nouveau client</div>
              <button onClick={() => setShowNouveauClient(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Nom', field: 'name', placeholder: 'Prénom Nom' },
                { label: 'Écurie', field: 'ecurie', placeholder: 'Nom de l\'écurie' },
                { label: 'Ville', field: 'ville', placeholder: 'Ville' },
                { label: 'Email', field: 'email', placeholder: 'email@exemple.fr' },
                { label: 'Téléphone', field: 'tel', placeholder: '+33 6 ...' },
                { label: 'Disponibilités', field: 'dispo', placeholder: 'Ex : Mardi matin' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <div className="text-xs text-gray-400 font-semibold mb-1">{label}</div>
                  <input
                    type="text"
                    value={newClient[field]}
                    onChange={e => setNewClient(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button onClick={ajouterClient} className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700">
                  Ajouter
                </button>
                <button onClick={() => setShowNouveauClient(false)} className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP NOUVEAU CHEVAL */}
      {showNouveauCheval && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setShowNouveauCheval(false)}>
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-gray-900">Nouveau cheval — {selected.name}</div>
              <button onClick={() => setShowNouveauCheval(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Nom du cheval', field: 'name', placeholder: 'Ex : Nuage' },
                { label: 'Selle actuelle', field: 'selle', placeholder: 'Ex : Passier Optima' },
                { label: 'Arçon', field: 'arcon', placeholder: 'Ex : Arçon 33' },
                { label: 'État', field: 'etat', placeholder: 'Ex : Bon état' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <div className="text-xs text-gray-400 font-semibold mb-1">{label}</div>
                  <input
                    type="text"
                    value={newCheval[field]}
                    onChange={e => setNewCheval(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button onClick={ajouterCheval} className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700">
                  Ajouter
                </button>
                <button onClick={() => setShowNouveauCheval(false)} className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}