import React, { useState } from 'react'
import { envoyerSeance, envoyerCompteRendu } from '../services/odoo'

const prestationsDetail = [
  { id: 'bilan', label: 'Bilan complet selle/cheval', prix: 120 },
  { id: 'reglage', label: 'Réglage & ajustement arçon', prix: 80 },
  { id: 'essai', label: 'Essai selle du stock', prix: 0 },
  { id: 'achat', label: 'Vente selle', prix: null },
  { id: 'forfait_dep_ch', label: 'Forfait déplacement CH', prix: 30 },
  { id: 'forfait_dep_fr', label: 'Forfait déplacement FR', prix: 45 },
  { id: 'savon', label: 'Savon / mousse nettoyante', prix: 15 },
  { id: 'tapis', label: 'Tapis', prix: 35 },
  { id: 'etrivieres', label: 'Étrivières', prix: 25 },
  { id: 'etriers', label: 'Étriers', prix: 40 },
  { id: 'sangle', label: 'Sangle', prix: 55 },
]

const seancesInit = [
  {
    id: 1,
    client: 'Claire Moreau',
    email: 'claire.moreau@email.fr',
    ville: 'Champagnole',
    date: 'Mar 22 juillet · 9h00',
    ecurie: 'Écurie du Moulin',
    chevaux: ['Nuage', 'Tempête'],
    prestationsChecked: [],
    montantManuel: '',
    notes: 'Arçon ajusté 33→31 cm. Nuage a bien réagi. Légère asymétrie dorsale à gauche. Revoir dans 6 mois.',
    photos: [],
    photosByCheval: {},
  },
  {
    id: 2,
    client: 'Laura Petit',
    email: 'laura.petit@email.fr',
    ville: 'Poligny',
    date: 'Mar 22 juillet · 11h00',
    ecurie: 'Les Écuries du Val',
    chevaux: ['Éclair'],
    prestationsChecked: [],
    montantManuel: '',
    notes: '',
    photos: [],
    photosByCheval: {},
  },
]

const historique = [
  { client: 'Emma Favre', ville: 'Lons-le-Saunier', date: 'Jeu 17 juil', prestations: ['Bilan complet selle/cheval', 'Forfait déplacement FR'], photos: 2, facture: '#1047', montant: '165 CHF' },
  { client: 'Nathalie Simon', ville: 'Chalon-sur-Saône', date: 'Mer 10 juil', prestations: ['Réglage & ajustement arçon', 'Forfait déplacement FR'], photos: 5, facture: '#1044', montant: '125 CHF' },
]

function ZoneSignature({ onSignature }) {
  const canvasRef = React.useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signed, setSigned] = useState(false)

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  function startDraw(e) {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  function draw(e) {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    const pos = getPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setSigned(true)
  }

  function stopDraw() {
    setIsDrawing(false)
    if (signed) {
      const canvas = canvasRef.current
      onSignature(canvas.toDataURL())
    }
  }

  function effacer() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSigned(false)
    onSignature(null)
  }

  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Signature du client</div>
      <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          className="w-full touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!signed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-300">✍️ Signez ici</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{signed ? '✓ Signé' : 'En attente de signature'}</span>
        <button onClick={effacer} className="text-xs text-gray-400 underline">Effacer</button>
      </div>
    </div>
  )
}

export default function Seance() {
  const [seances, setSeances] = useState(seancesInit)
  const [ouvert, setOuvert] = useState(1)
  const [saved, setSaved] = useState([])
  const [signatures, setSignatures] = useState({})
  const [saving, setSaving] = useState(false)
  const [emailsClients, setEmailsClients] = useState(
    Object.fromEntries(seancesInit.map(s => [s.id, s.email || '']))
  )
  const [compteRenduEnvoye, setCompteRenduEnvoye] = useState({})
  const [showNouvellePrestation, setShowNouvellePrestation] = useState(false)
  const [nouvellePrestation, setNouvellePrestation] = useState({ label: '', prix: '' })
  const [prestationsCustom, setPrestationsCustom] = useState([])

  function togglePrestation(seanceId, prestId) {
    setSeances(prev => prev.map(s => {
      if (s.id !== seanceId) return s
      const next = s.prestationsChecked.includes(prestId)
        ? s.prestationsChecked.filter(p => p !== prestId)
        : [...s.prestationsChecked, prestId]
      return { ...s, prestationsChecked: next }
    }))
  }

  function updateField(seanceId, field, value) {
    setSeances(prev => prev.map(s => s.id !== seanceId ? s : { ...s, [field]: value }))
  }

  function getMontantAuto(prestationsChecked) {
    const montantStandard = prestationsChecked.reduce((total, id) => {
      const p = prestationsDetail.find(p => p.id === id)
      return total + (p?.prix || 0)
    }, 0)
    const montantCustom = prestationsCustom.reduce((total, p) => total + (p.prix || 0), 0)
    return montantStandard + montantCustom
  }

  async function sauvegarder(seanceId) {
    setSaving(true)
    const seance = seances.find(s => s.id === seanceId)
    const signature = signatures[seanceId]
    const toutesPhotos = Object.values(seance.photosByCheval || {}).flat()
    const toutesLesPresations = [
      ...prestationsDetail.filter(p => seance.prestationsChecked.includes(p.id)),
      ...prestationsCustom
    ]

    await envoyerSeance(
      signature || null,
      seance.client,
      getMontantAuto(seance.prestationsChecked),
      toutesLesPresations,
      seance.notes,
      toutesPhotos
    )

    setSaved(prev => [...prev, seanceId])
    setSaving(false)
  }

  async function envoyerCR(seanceId) {
    const seance = seances.find(s => s.id === seanceId)
    const toutesLesPresations = [
      ...prestationsDetail.filter(p => seance.prestationsChecked.includes(p.id)),
      ...prestationsCustom
    ]
    await envoyerCompteRendu(
      emailsClients[seanceId],
      seance.client,
      toutesLesPresations,
      seance.notes,
      getMontantAuto(seance.prestationsChecked),
      signatures[seanceId] || null
    )
    setCompteRenduEnvoye(prev => ({ ...prev, [seanceId]: true }))
  }

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-900">Séances à documenter</div>
          <div className="text-xs font-semibold text-red-500">
            {seances.filter(s => !saved.includes(s.id)).length} en attente
          </div>
        </div>

        <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-2.5 mb-4">
          📋 Documente chaque séance pour générer la facture Odoo automatiquement.
        </div>

        {seances.map(s => (
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

                {/* PRESTATIONS */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Prestations réalisées</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {prestationsDetail.map(p => (
                      <div
                        key={p.id}
                        onClick={() => togglePrestation(s.id, p.id)}
                        className={`border rounded-lg p-2.5 cursor-pointer transition-all flex items-center justify-between ${
                          s.prestationsChecked.includes(p.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                            s.prestationsChecked.includes(p.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                          }`}>
                            {s.prestationsChecked.includes(p.id) && (
                              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 5 4.5 7.5 8 3"/></svg>
                            )}
                          </div>
                          <span className={`text-xs font-medium ${s.prestationsChecked.includes(p.id) ? 'text-emerald-700' : 'text-gray-700'}`}>
                            {p.label}
                          </span>
                        </div>
                        {p.prix !== null && (
                          <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">
                            {p.prix === 0 ? 'Gratuit' : p.prix + ' CHF'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {s.prestationsChecked.length > 0 && (
                    <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500">Total calculé automatiquement</span>
                      <span className="text-sm font-bold text-emerald-600">{getMontantAuto(s.prestationsChecked)} CHF</span>
                    </div>
                  )}

                  {/* PRESTATIONS CUSTOM */}
                  {showNouvellePrestation && (
                    <div className="mt-2 bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Prestation</div>
                          <input
                            type="text"
                            value={nouvellePrestation.label}
                            onChange={e => setNouvellePrestation(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="Ex : Nettoyage selle"
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Prix (CHF)</div>
                          <input
                            type="number"
                            value={nouvellePrestation.prix}
                            onChange={e => setNouvellePrestation(prev => ({ ...prev, prix: e.target.value }))}
                            placeholder="0"
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!nouvellePrestation.label) return
                            setPrestationsCustom(prev => [...prev, { id: 'custom-' + Date.now(), label: nouvellePrestation.label, prix: parseFloat(nouvellePrestation.prix) || 0 }])
                            setNouvellePrestation({ label: '', prix: '' })
                            setShowNouvellePrestation(false)
                          }}
                          className="flex-1 bg-emerald-600 text-white text-xs py-1.5 rounded-lg hover:bg-emerald-700 font-semibold"
                        >
                          Ajouter
                        </button>
                        <button onClick={() => setShowNouvellePrestation(false)} className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg">
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {prestationsCustom.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      {prestationsCustom.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                          <span className="text-xs font-medium text-emerald-700">{p.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600">{p.prix} CHF</span>
                            <button onClick={() => setPrestationsCustom(prev => prev.filter((_, idx) => idx !== i))} className="text-emerald-400 hover:text-red-400 text-xs">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setShowNouvellePrestation(true)}
                    className="mt-2 w-full text-xs border border-dashed border-gray-300 text-gray-400 rounded-lg py-2 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    + Ajouter une prestation
                  </button>
                </div>

                {/* NOTES */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Notes de séance</div>
                  <textarea
                    value={s.notes}
                    onChange={e => updateField(s.id, 'notes', e.target.value)}
                    placeholder="Ex : arçon réglé à 33 cm, asymétrie dorsale à surveiller..."
                    className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none w-full resize-none focus:border-emerald-400"
                    rows={3}
                  />
                </div>

                {/* PHOTOS PAR CHEVAL */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Photos par cheval</div>
                  {s.chevaux.map(cheval => (
                    <div key={cheval} className="mb-3 border border-gray-100 rounded-xl p-3">
                      <div className="text-xs font-semibold text-gray-700 mb-2">🐴 {cheval}</div>
                      <div className="flex gap-2 flex-wrap">
                        {(s.photosByCheval?.[cheval] || []).map((p, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-200 relative">
                            <img src={p} alt="photo" className="w-full h-full object-cover" />
                            <button
                              onClick={() => {
                                const updated = { ...s.photosByCheval }
                                updated[cheval] = updated[cheval].filter((_, i) => i !== idx)
                                updateField(s.id, 'photosByCheval', updated)
                              }}
                              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <label className="w-16 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                          <span className="text-2xl text-gray-300">+</span>
                          <span className="text-xs text-gray-400">{cheval}</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={e => {
                              const files = Array.from(e.target.files)
                              files.forEach(file => {
                                const reader = new FileReader()
                                reader.onload = ev => {
                                  const current = s.photosByCheval?.[cheval] || []
                                  updateField(s.id, 'photosByCheval', {
                                    ...s.photosByCheval,
                                    [cheval]: [...current, ev.target.result]
                                  })
                                }
                                reader.readAsDataURL(file)
                              })
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SIGNATURE */}
                <div className="mb-4">
                  <ZoneSignature onSignature={(sig) => setSignatures(prev => ({ ...prev, [s.id]: sig }))} />
                  {signatures[s.id] && (
                    <div className="mt-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2">
                      ✓ Signature enregistrée — sera jointe à la facture Odoo
                    </div>
                  )}
                </div>

                {/* EMAIL CLIENT */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Email du client</div>
                  <input
                    type="email"
                    value={emailsClients[s.id] || ''}
                    onChange={e => setEmailsClients(prev => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="email@client.fr"
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
                  />
                </div>

                {/* BOUTONS */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => sauvegarder(s.id)}
                      disabled={saving}
                      className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Envoi vers Odoo...' : 'Enregistrer → Facture Odoo (' + getMontantAuto(s.prestationsChecked) + ' CHF)'}
                    </button>
                    <button className="text-xs border border-gray-200 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Aperçu
                    </button>
                  </div>
                  {emailsClients[s.id] && (
                    <button
                      onClick={() => envoyerCR(s.id)}
                      className={`w-full text-xs font-semibold py-2 rounded-lg transition-colors ${
                        compteRenduEnvoye[s.id]
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {compteRenduEnvoye[s.id] ? '✓ Compte rendu envoyé !' : '📧 Envoyer compte rendu au client'}
                    </button>
                  )}
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
              <div className="text-xs text-gray-400">{h.date} · {h.prestations.join(', ')} · {h.photos} photos · Facture {h.facture}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Facturé</span>
              <div className="text-xs text-gray-400 mt-1">{h.montant}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 bg-blue-50 text-blue-700 text-xs rounded-lg p-2.5">
          🔗 Toutes les séances sont synchronisées en temps réel avec Odoo.
        </div>
      </div>

    </div>
  )
}