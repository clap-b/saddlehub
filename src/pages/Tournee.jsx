import { useState, useEffect } from 'react'
import { Map, Marker, useMap } from '@vis.gl/react-google-maps'

const clients = [
  { id: 1, name: 'Claire Moreau', zone: 'Champagnole · Jura', dispo: '✓ Dispo matin', dispoColor: 'text-emerald-500', km: '95 km', selected: true },
  { id: 2, name: 'Laura Petit', zone: 'Poligny · Jura', dispo: '✓ Dispo mardi', dispoColor: 'text-emerald-500', km: '+18 km', selected: true },
  { id: 3, name: 'Emma Favre', zone: 'Lons-le-Saunier · Jura', dispo: '✓ Dispo apr.-midi', dispoColor: 'text-emerald-500', km: '+28 km', selected: true },
  { id: 4, name: 'Sophie Blanc', zone: 'Orgelet · Jura', dispo: '↻ Demande en attente', dispoColor: 'text-amber-500', km: '+22 km', selected: false },
  { id: 5, name: 'Marie Duval', zone: 'Pontarlier · Doubs', dispo: '↻ Demande en attente', dispoColor: 'text-amber-500', km: '+35 km', selected: false },
  { id: 6, name: 'Hélène Roy', zone: 'Arbois · Jura', dispo: '✗ Indisponible', dispoColor: 'text-red-500', km: '', selected: false, disabled: true },
]

const stops = [
  { name: '🟢 Départ — Coppet (CH)', sub: '07h30 · Chargement terminé', pills: [] },
  { name: 'Claire Moreau — Champagnole', sub: '09h00 · Écurie du Moulin', pills: ['95 km depuis départ', '~1h00', 'Passier Optima + arçon'] },
  { name: 'Laura Petit — Poligny', sub: '11h00 · Les Écuries du Val', pills: ['+18 km', '~1h00', 'Réglage arçon'] },
  { name: 'Emma Favre — Lons-le-Saunier', sub: '14h00 · Écurie privée', pills: ['+28 km', '~1h30', 'Essai nouvelle selle'] },
  { name: '⛽ Station Total — Bourg-en-Bresse', sub: '~15h45 · +5 min · Sur le trajet A39', pills: ['~18 L · 1.87 €/L · ~33 €', 'Ouverte 24h'], fuel: true },
  { name: '🏁 Destination — Chalon-sur-Saône', sub: '~17h00 · +83 km', dest: true },
]

function TrajetRoute({ waypoints }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !window.google) return

    const directionsService = new window.google.maps.DirectionsService()
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1D9E75',
        strokeWeight: 4,
      }
    })

    directionsRenderer.setMap(map)

    directionsService.route({
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1).map(p => ({ location: p, stopover: true })),
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
      }
    })

    return () => directionsRenderer.setMap(null)
  }, [map, waypoints])

  return null
}

export default function Tournee() {
  const [optimised, setOptimised] = useState(false)
  const [selected, setSelected] = useState(clients.map(c => c.selected))

  function toggleclient(i) {
    if (clients[i].disabled) return
    const next = [...selected]
    next[i] = !next[i]
    setSelected(next)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* PARAMÈTRES */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Paramètres de la tournée</div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-400">Jour :</span>
          <input type="date" defaultValue="2026-07-22" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500" />
          <span className="text-xs text-gray-400">Départ :</span>
          <input type="text" defaultValue="Coppet, CH" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500 w-28" />
          <span className="text-xs text-gray-400">Destination :</span>
<input type="text" defaultValue="" placeholder="Optionnel — dernier client par défaut" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500 w-52" />
          <button
            onClick={() => setOptimised(true)}
            className="bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            🗺 Optimiser le trajet
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['Jura', 'Saône-et-Loire', 'Ain', 'Doubs', 'Vaud (CH)'].map(z => (
            <button key={z} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* ALGO BOX */}
      {optimised && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <div className="text-xs font-bold text-emerald-700 mb-1">✓ Optimisation automatique — Google Maps API</div>
          <div className="text-xs text-emerald-500 mb-2">Tu choisis une date → l'app suggère automatiquement les clients dispos ce jour-là, optimise l'ordre des stops et calcule le trajet. Si aucune destination n'est définie, le dernier client devient le point d'arrivée.</div>
          <div className="flex gap-2 flex-wrap">
            {['clients filtrées par dispo', 'Distances calculées via Maps API', 'Ordre optimisé (TSP)', 'Durées estimées', 'Fenêtres horaires respectées'].map(s => (
              <span key={s} className="text-xs bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded-md">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">

        {/* clients DISPONIBLES */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-gray-900">clients disponibles mardi</div>
            <div className="text-xs text-gray-400">Clique pour ajouter / retirer</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {clients.map((c, i) => (
              <div
                key={c.id}
                onClick={() => toggleclient(i)}
                className={`border rounded-xl p-3 relative transition-all ${
                  c.disabled ? 'opacity-40 cursor-not-allowed' :
                  selected[i] ? 'border-emerald-500 bg-emerald-50 cursor-pointer' :
                  'border-gray-200 cursor-pointer hover:border-emerald-300'
                }`}
              >
                <div className="text-xs font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">📍 {c.zone}</div>
                <div className={`text-xs mt-1 ${c.dispoColor}`}>{c.dispo}</div>
                {c.km && (
                  <span className="absolute top-2 right-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-semibold">{c.km}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TRAJET */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm font-bold text-gray-900 mb-3">Trajet optimisé — Google Maps</div>

          {/* CARTE GOOGLE MAPS */}
<div className="rounded-xl overflow-hidden border border-gray-100 mb-3" style={{height: '220px'}}>
  <Map
  defaultCenter={{ lat: 46.8182, lng: 6.1 }}
  defaultZoom={7}
  mapId="saddlehub-map"
  gestureHandling="greedy"
  disableDefaultUI={true}
>
  {/* Départ — vert */}
  <Marker
    position={{ lat: 46.3167, lng: 6.1833 }}
    title="Départ — Coppet"
    icon={{
      path: window.google?.maps.SymbolPath.CIRCLE,
      fillColor: '#1D9E75',
      fillOpacity: 1,
      strokeColor: '#0F6E56',
      strokeWeight: 2,
      scale: 10,
    }}
  />
  {/* Stop 1 */}
  <Marker position={{ lat: 46.6167, lng: 5.9167 }} title="Claire Moreau — Champagnole" label={{ text: '1', color: 'white', fontWeight: 'bold' }} />
  {/* Stop 2 */}
  <Marker position={{ lat: 46.6667, lng: 5.7 }} title="Laura Petit — Poligny" label={{ text: '2', color: 'white', fontWeight: 'bold' }} />
  {/* Stop 3 */}
  <Marker position={{ lat: 46.6833, lng: 5.55 }} title="Emma Favre — Lons-le-Saunier" label={{ text: '3', color: 'white', fontWeight: 'bold' }} />
  {/* Arrivée — rouge */}
  <Marker
    position={{ lat: 46.7833, lng: 4.8500 }}
    title="Arrivée — Chalon-sur-Saône"
    icon={{
      path: window.google?.maps.SymbolPath.CIRCLE,
      fillColor: '#E24B4A',
      fillOpacity: 1,
      strokeColor: '#A32D2D',
      strokeWeight: 2,
      scale: 10,
    }}
  />
  <TrajetRoute waypoints={[
    { lat: 46.3167, lng: 6.1833 },
    { lat: 46.6167, lng: 5.9167 },
    { lat: 46.6667, lng: 5.7 },
    { lat: 46.6833, lng: 5.55 },
    { lat: 46.7833, lng: 4.8500 },
  ]} />
</Map>
</div>

{/* LÉGENDE */}
<div className="flex gap-4 mb-3 flex-wrap">
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
    Départ
  </div>
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    <div className="w-3 h-3 rounded-full bg-red-400"></div>
    Stops clients
  </div>
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    <div className="w-3 h-3 rounded-full bg-red-600"></div>
    Arrivée
  </div>
  <div className="flex items-center gap-1.5 text-xs text-gray-500">
    <div className="w-3 h-3 rounded-full bg-emerald-400 opacity-60"></div>
    Trajet optimisé
  </div>
</div>
          {/* STATS */}
          <div className="flex gap-4 mb-3 flex-wrap">
            {[
              { val: '224 km', lab: 'Total trajet' },
              { val: '5h30', lab: 'Durée totale' },
              { val: '3 RDV', lab: 'Stops' },
              { val: '07h30', lab: 'Départ' },
              { val: '~38 CHF', lab: '⛽ Carburant', color: 'text-amber-700' },
            ].map(s => (
              <div key={s.lab}>
                <div className={`text-base font-bold ${s.color || 'text-gray-900'}`}>{s.val}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.lab}</div>
              </div>
            ))}
          </div>

          {/* STOPS */}
          <div className="flex flex-col gap-0">
            {stops.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 ${
                    s.dest ? 'bg-red-500 border-red-500' :
                    s.fuel ? 'bg-amber-50 border-amber-400' :
                    i === 0 ? 'bg-emerald-500 border-emerald-500' :
                    'bg-white border-emerald-500'
                  }`}></div>
                  {i < stops.length - 1 && <div className="w-px h-6 bg-gray-200"></div>}
                </div>
                <div className="pb-3 flex-1">
                  <div className={`text-xs font-semibold ${s.dest ? 'text-red-500' : s.fuel ? 'text-amber-700' : 'text-gray-900'}`}>{s.name}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                  {s.pills && s.pills.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {s.pills.map(p => (
                        <span key={p} className={`text-xs px-1.5 py-0.5 rounded-md ${s.fuel ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{p}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg p-2.5">
            ✓ Trajet optimisé — 224 km au lieu de ~310 km. Économie : 86 km et 1h45.
          </div>
        </div>
      </div>
    </div>
  )
}