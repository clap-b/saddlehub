import { useState, useEffect } from 'react'
import { getPistes } from '../services/odoo'

const demandes = [
  {
    id: 1,
    name: 'Isabelle Renard',
    email: 'isabelle.renard@email.fr',
    phone: '+33634567890',
    source: '📱 Instagram',
    message: '"Ma jument a des blessures sur le dos, la selle semble trop petite"',
    ville: 'Dole',
    temps: 'Reçu il y a 2h',
    urgence: 'Urgent',
    dotColor: 'bg-red-500',
    tagColor: 'bg-red-50 text-red-600',
  },
  {
    id: 2,
    name: 'Sophie Blanc',
    email: 'sophie.blanc@email.fr',
    phone: '+33611223344',
    source: '💬 WhatsApp',
    message: '"Disponible lundi ou jeudi, je suis dans le Jura"',
    ville: 'Orgelet · Nouvelle cliente',
    temps: 'Reçu hier',
    urgence: 'À placer',
    dotColor: 'bg-amber-400',
    tagColor: 'bg-amber-50 text-amber-700',
  },
  {
    id: 3,
    name: 'Marie Duval',
    email: 'marie.duval@email.fr',
    phone: '+33655667788',
    source: '📩 SMS',
    message: '"Bonjour, recommandée par Claire Moreau. Je suis sur Pontarlier."',
    ville: 'Pontarlier · Nouvelle cliente',
    temps: 'Reçu il y a 2 jours',
    urgence: 'À placer',
    dotColor: 'bg-amber-400',
    tagColor: 'bg-amber-50 text-amber-700',
  },
]

export default function Demandes({ onNavigate }) {
  const [traitees, setTraitees] = useState([])
  const [pistesOdoo, setPistesOdoo] = useState([])
  const [popupContact, setPopupContact] = useState(null)

  useEffect(() => {
    getPistes().then(data => {
      if (data.length > 0) setPistesOdoo(data)
    })
  }, [])

  function marquerTraitee(id) {
    setTraitees(prev => [...prev, id])
  }

  function ouvrirEmail(email) {
    window.location.href = 'mailto:' + email
  }

  function ouvrirWhatsApp(phone) {
    const numero = phone.replace(/\s/g, '').replace(/\+/g, '')
    window.open('https://wa.me/' + numero)
  }

  const toutesLesDemandes = [
    ...demandes,
    ...pistesOdoo.map(p => ({
      id: 'odoo-' + p.id,
      name: p.partner_name || p.name,
      email: p.email_from || null,
      phone: p.phone || null,
      source: '🔗 Odoo CRM',
      message: p.description || 'Demande via formulaire Odoo',
      ville: p.city || 'Non précisé',
      temps: new Date(p.create_date).toLocaleDateString('fr-FR'),
      urgence: 'Nouveau',
      dotColor: 'bg-purple-500',
      tagColor: 'bg-purple-50 text-purple-700',
    }))
  ]

  const enAttente = toutesLesDemandes.filter(d => !traitees.includes(d.id))
  const faites = toutesLesDemandes.filter(d => traitees.includes(d.id))

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Demandes reçues</div>
          {enAttente.length > 0 && (
            <div className="text-xs font-semibold text-red-500">{enAttente.length} non traitée{enAttente.length > 1 ? 's' : ''}</div>
          )}
        </div>

        <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5 mb-4">
          Sophie Blanc (Jura) et Marie Duval (Doubs) sont sur le même axe que la tournée de mardi — pense à les grouper.
        </div>

        {pistesOdoo.length > 0 && (
          <div className="bg-purple-50 text-purple-700 text-xs rounded-lg p-2.5 mb-4">
            🔗 {pistesOdoo.length} nouvelle{pistesOdoo.length > 1 ? 's' : ''} demande{pistesOdoo.length > 1 ? 's' : ''} reçue{pistesOdoo.length > 1 ? 's' : ''} via Odoo CRM
          </div>
        )}

        {enAttente.length === 0 && (
          <div className="text-xs text-gray-400 italic text-center py-4">Toutes les demandes sont traitées.</div>
        )}

        {enAttente.map(d => (
          <div key={d.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${d.dotColor}`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="text-xs font-semibold text-gray-900">{d.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.tagColor}`}>{d.urgence}</span>
              </div>
              <div className="text-xs text-gray-400">{d.source} · {d.ville}</div>
              <div className="text-xs text-gray-500 mt-1 italic">{d.message}</div>
              <div className="text-xs text-gray-300 mt-1">{d.temps}</div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button
                onClick={() => setPopupContact(d)}
                className="text-xs border border-emerald-500 text-emerald-600 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
              >
                Contacter
              </button>
              <button
                onClick={() => onNavigate('tournee')}
                className="text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                Placer tournée
              </button>
  
              <button
                onClick={() => marquerTraitee(d.id)}
                className="text-xs border border-gray-200 text-gray-400 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                Traité
              </button>
            </div>
          </div>
        ))}
      </div>

      {faites.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm font-bold text-gray-900 mb-3">Traitées récemment</div>
          {faites.map(d => (
            <div key={d.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 opacity-50">
              <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900 line-through">{d.name}</div>
                <div className="text-xs text-gray-400">{d.source} · {d.ville}</div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Traité</span>
            </div>
          ))}
        </div>
      )}

      {popupContact && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setPopupContact(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-gray-900">{popupContact.name}</div>
              <button onClick={() => setPopupContact(null)} className="text-gray-400 hover:text-gray-600">X</button>
            </div>
            <div className="flex flex-col gap-3">
              {popupContact.email && (
                <button
                  onClick={() => ouvrirEmail(popupContact.email)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors w-full text-left"
                >
                  <span className="text-lg">📧</span>
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="text-xs font-semibold text-gray-900">{popupContact.email}</div>
                  </div>
                </button>
              )}
              {popupContact.phone && (
                <button
                  onClick={() => ouvrirWhatsApp(popupContact.phone)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors w-full text-left"
                >
                  <span className="text-lg">💬</span>
                  <div>
                    <div className="text-xs text-gray-400">WhatsApp</div>
                    <div className="text-xs font-semibold text-gray-900">{popupContact.phone}</div>
                  </div>
                </button>
              )}
              {!popupContact.email && !popupContact.phone && (
                <div className="text-xs text-gray-400 italic text-center py-2">
                  Aucune coordonnée disponible
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}