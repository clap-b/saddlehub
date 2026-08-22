import { useState } from 'react'

export default function Parametres() {
  const [villeDepart, setVilleDepart] = useState('Coppet, CH')
  const [consommation, setConsommation] = useState('10')
  const [vehicule, setVehicule] = useState('Camion')
  const [tarifCH, setTarifCH] = useState('120')
  const [tarifFR, setTarifFR] = useState('')
  const [forfaitCH, setForfaitCH] = useState('30')
  const [forfaitFR, setForfaitFR] = useState('45')
  const [saved, setSaved] = useState(false)

  function sauvegarder() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      {/* TOURNÉES */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-4">Paramètres de tournée</div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Ville de départ</div>
            <input
              type="text"
              value={villeDepart}
              onChange={e => setVilleDepart(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
            />
            <div className="text-xs text-gray-400 mt-1">Utilisée comme point de départ pour toutes les tournées</div>
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Type de véhicule</div>
            <div className="flex gap-2">
              {['Camion', 'Van', 'Voiture'].map(v => (
                <div
                  key={v}
                  onClick={() => setVehicule(v)}
                  className={`border rounded-lg px-4 py-2 text-xs cursor-pointer transition-all font-medium ${
                    vehicule === v
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Consommation (L/100km)</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={consommation}
                onChange={e => setConsommation(e.target.value)}
                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-gray-400">L/100km</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Utilisée pour estimer le coût carburant de chaque tournée</div>
          </div>
        </div>
      </div>

      {/* TARIFS */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-1">Tarifs</div>
        <div className="text-xs text-gray-400 mb-4">Ces tarifs seront utilisés pour pré-remplir les factures Odoo</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Bilan & réglage — CH 🇨🇭</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tarifCH}
                onChange={e => setTarifCH(e.target.value)}
                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-gray-400">CHF</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Bilan & réglage — FR 🇫🇷</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tarifFR}
                onChange={e => setTarifFR(e.target.value)}
                placeholder="À définir"
                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-gray-400">€</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Forfait déplacement — CH 🇨🇭</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={forfaitCH}
                onChange={e => setForfaitCH(e.target.value)}
                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-gray-400">CHF</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Forfait déplacement — FR 🇫🇷</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={forfaitFR}
                onChange={e => setForfaitFR(e.target.value)}
                placeholder="À définir"
                className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-gray-400">€</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTÉGRATIONS */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-4">Intégrations</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <div className="text-xs font-semibold text-gray-900">Google Maps API</div>
              <div className="text-xs text-gray-400">Optimisation des tournées et calcul de trajet</div>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">✓ Connecté</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <div className="text-xs font-semibold text-gray-900">Odoo — Équin'Equilibre</div>
              <div className="text-xs text-gray-400">Clients, stock, facturation</div>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">⏳ En attente</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-semibold text-gray-900">Google Calendar</div>
              <div className="text-xs text-gray-400">Synchronisation des RDV et tournées</div>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">⏳ En attente</span>
          </div>
        </div>
      </div>

      <button
        onClick={sauvegarder}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
          saved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {saved ? '✓ Paramètres sauvegardés !' : 'Sauvegarder les paramètres'}
      </button>

    </div>
  )
}