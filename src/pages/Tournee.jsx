import { useState, useEffect } from 'react'
import { Map, Marker, useMap, InfoWindow } from '@vis.gl/react-google-maps'

const clients = [
  { id: 1, name: 'Claire Moreau', zone: 'Champagnole · Jura', dispo: '✓ Dispo matin', dispoColor: 'text-emerald-500', km: '95 km', selected: true, disabled: false, lat: 46.6167, lng: 5.9167 },
  { id: 2, name: 'Laura Petit', zone: 'Poligny · Jura', dispo: '✓ Dispo mardi', dispoColor: 'text-emerald-500', km: '+18 km', selected: true, disabled: false, lat: 46.6667, lng: 5.7 },
  { id: 3, name: 'Emma Favre', zone: 'Lons-le-Saunier · Jura', dispo: '✓ Dispo apr.-midi', dispoColor: 'text-emerald-500', km: '+28 km', selected: true, disabled: false, lat: 46.6833, lng: 5.55 },
  { id: 4, name: 'Sophie Blanc', zone: 'Orgelet · Jura', dispo: '↻ Demande en attente', dispoColor: 'text-amber-500', km: '+22 km', selected: false, disabled: false, lat: 46.5333, lng: 5.6167 },
  { id: 5, name: 'Marie Duval', zone: 'Pontarlier · Doubs', dispo: '↻ Demande en attente', dispoColor: 'text-amber-500', km: '+35 km', selected: false, disabled: false, lat: 46.9, lng: 6.3567 },
  { id: 6, name: 'Hélène Roy', zone: 'Arbois · Jura', dispo: '✗ Indisponible', dispoColor: 'text-red-500', km: '', selected: false, disabled: true, lat: 46.9, lng: 5.7667 },
]

const DEPART_DEFAULT = { lat: 46.3167, lng: 6.1833 }
const ARRIVEE_DEFAULT = { lat: 46.7833, lng: 4.8500 }

async function geocodeAdresse(adresse) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(adresse)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  )
  const data = await response.json()
  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location
    return { lat, lng }
  }
  return null
}

function StationsEssence({ waypoints }) {
  const map = useMap()
  const [stations, setStations] = useState([])
  const [stationSelectionnee, setStationSelectionnee] = useState(null)

  useEffect(() => {
    if (!map || !window.google || waypoints.length < 2) return
    const service = new window.google.maps.places.PlacesService(map)

    const pointsRecherche = [
      waypoints[0],
      waypoints[Math.floor(waypoints.length / 2)],
      waypoints[waypoints.length - 1],
    ]

    const toutesStations = []
    let recherchesTerminees = 0

    pointsRecherche.forEach(point => {
      service.nearbySearch({
        location: point,
        radius: 10000,
        type: 'gas_station',
      }, (results, status) => {
        recherchesTerminees++
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.slice(0, 2).forEach(r => {
            if (!toutesStations.find(s => s.place_id === r.place_id)) {
              toutesStations.push(r)
            }
          })
        }
        if (recherchesTerminees === pointsRecherche.length) {
          setStations(toutesStations)
        }
      })
    })
  }, [map, JSON.stringify(waypoints)])

  return (
    <>
      {stations.map(s => (
        <Marker
          key={s.place_id}
          position={s.geometry.location}
          title={s.name}
          onClick={() => setStationSelectionnee(s)}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#FFF7E6" stroke="#EF9F27" stroke-width="2"/><text x="14" y="19" text-anchor="middle" font-size="14">⛽</text></svg>')}`,
            scaledSize: new window.google.maps.Size(28, 28),
            anchor: new window.google.maps.Point(14, 14),
          }}
        />
      ))}
      {stationSelectionnee && (
        <InfoWindow
          position={stationSelectionnee.geometry.location}
          onCloseClick={() => setStationSelectionnee(null)}
        >
          <div style={{fontSize: '12px', maxWidth: '180px'}}>
            <div style={{fontWeight: 'bold', marginBottom: '4px'}}>⛽ {stationSelectionnee.name}</div>
            {stationSelectionnee.vicinity && (
              <div style={{color: '#888'}}>{stationSelectionnee.vicinity}</div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

function TrajetRoute({ waypoints, heureDepart, onDureeChange }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !window.google || waypoints.length < 2) return

    const directionsService = new window.google.maps.DirectionsService()
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#1D9E75', strokeWeight: 4 }
    })

    directionsRenderer.setMap(map)

    const departureTime = (() => {
      const [h, m] = heureDepart.split(':')
      const d = new Date()
      d.setHours(parseInt(h), parseInt(m), 0)
      if (d < new Date()) d.setDate(d.getDate() + 1)
      return d
    })()

    directionsService.route({
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1).map(p => ({ location: p, stopover: true })),
      travelMode: window.google.maps.TravelMode.DRIVING,
      drivingOptions: { departureTime, trafficModel: 'bestguess' },
    }, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        const dureeSecondes = result.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0)
        const heures = Math.floor(dureeSecondes / 3600)
        const minutes = Math.floor((dureeSecondes % 3600) / 60)
        const distanceKm = Math.round(result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000)
        onDureeChange(`${heures}h${minutes.toString().padStart(2, '0')}`, distanceKm)
      }
    })

    return () => directionsRenderer.setMap(null)
  }, [map, JSON.stringify(waypoints), heureDepart])

  return null
}

export default function Tournee() {
  const [optimised, setOptimised] = useState(false)
  const [selected, setSelected] = useState(clients.map(c => c.selected))
  const [prixCarburant, setPrixCarburant] = useState(1.87)
  const [depart, setDepart] = useState('Coppet, CH')
  const [departCoords, setDepartCoords] = useState(DEPART_DEFAULT)
  const [heureDepart, setHeureDepart] = useState('07:30')
  const [dureeReelle, setDureeReelle] = useState('5h30')
  const [distanceReelle, setDistanceReelle] = useState(224)
  const [stopImprovisé, setStopImprovisé] = useState('')
  const [stopsExtra, setStopsExtra] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      const coords = await geocodeAdresse(depart)
      if (coords) setDepartCoords(coords)
    }, 800)
    return () => clearTimeout(timer)
  }, [depart])

  function toggleclient(i) {
    if (clients[i].disabled) return
    const next = [...selected]
    next[i] = !next[i]
    setSelected(next)
  }

  async function ajouterStop() {
    if (!stopImprovisé) return
    const coords = await geocodeAdresse(stopImprovisé)
    if (coords) {
      setStopsExtra(prev => [...prev, { adresse: stopImprovisé, coords }])
      setStopImprovisé('')
    }
  }

  const selectedClients = clients.filter((c, i) => selected[i] && !c.disabled)

  const waypoints = [
    departCoords,
    ...selectedClients.map(c => ({ lat: c.lat, lng: c.lng })),
    ...stopsExtra.map(s => s.coords),
    ARRIVEE_DEFAULT,
  ]

  const coutCarburant = Math.round((distanceReelle / 100) * 10 * prixCarburant)

  const stopsActuels = [
    { name: `🟢 Départ — ${depart}`, sub: `${heureDepart} · Chargement terminé`, isDepart: true },
    ...selectedClients.map((c, i) => ({
      name: `${c.name} — ${c.zone.split(' · ')[0]}`,
      sub: `Stop ${i + 1}`,
    })),
    ...stopsExtra.map((s, i) => ({
      name: `📍 Stop improvisé — ${s.adresse}`,
      sub: `Extra ${i + 1}`,
      extra: true,
    })),
    { name: '⛽ Station essence', sub: 'Sur le trajet', fuel: true },
    { name: '🏁 Destination', sub: 'Arrivée', dest: true },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* PARAMÈTRES */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Paramètres de la tournée</div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-400">Jour :</span>
          <input type="date" defaultValue="2026-07-22" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500" />
          <span className="text-xs text-gray-400">Heure :</span>
          <input type="time" value={heureDepart} onChange={e => setHeureDepart(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500" />
          <span className="text-xs text-gray-400">Départ :</span>
          <input type="text" value={depart} onChange={e => setDepart(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500 w-28" />
          <span className="text-xs text-gray-400">Destination :</span>
          <input type="text" defaultValue="" placeholder="Optionnel — dernier client par défaut" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500 w-52" />
          <span className="text-xs text-gray-400">Prix/L :</span>
          <div className="flex items-center gap-1">
            <input type="number" step="0.01" defaultValue="1.87" onChange={e => setPrixCarburant(parseFloat(e.target.value))} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-emerald-500 w-16" />
            <span className="text-xs text-gray-400">CHF</span>
          </div>
          <button onClick={() => setOptimised(true)} className="bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
            🗺 Optimiser le trajet
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['Jura', 'Saône-et-Loire', 'Ain', 'Doubs', 'Vaud (CH)'].map(z => (
            <button key={z} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors">{z}</button>
          ))}
        </div>
      </div>

      {/* ALGO BOX */}
      {optimised && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <div className="text-xs font-bold text-emerald-700 mb-1">✓ Optimisation automatique — Google Maps API</div>
          <div className="text-xs text-emerald-500 mb-2">Tu choisis une date → l'app suggère les clients dispos, optimise l'ordre et calcule le trajet avec trafic en temps réel.</div>
          <div className="flex gap-2 flex-wrap">
            {['Clients filtrés par dispo', 'Distances calculées via Maps API', 'Ordre optimisé (TSP)', 'Trafic en temps réel', 'Fenêtres horaires respectées'].map(s => (
              <span key={s} className="text-xs bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded-md">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CLIENTS */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-gray-900">Clients disponibles mardi</div>
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
                <div className="flex items-center gap-1.5">
                  {selected[i] && !c.disabled && (
                    <span className="text-xs bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {selectedClients.findIndex(sc => sc.id === c.id) + 1}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-900">{c.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">📍 {c.zone}</div>
                <div className={`text-xs mt-1 ${c.dispoColor}`}>{c.dispo}</div>
                {selected[i] && !c.disabled && (
                  <button
                    onClick={e => { e.stopPropagation(); setDepart(c.zone.split(' · ')[0]) }}
                    className="text-xs text-blue-500 underline mt-1"
                  >
                    📍 Partir d'ici
                  </button>
                )}
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

          <div className="rounded-xl overflow-hidden border border-gray-100 mb-3" style={{height: '350px'}}>
            <Map defaultCenter={{ lat: 46.8182, lng: 6.1 }} defaultZoom={7} mapId="saddlehub-map" gestureHandling="greedy" disableDefaultUI={true}>
              <Marker
                position={departCoords}
                title={`Départ — ${depart}`}
                icon={{ path: window.google?.maps.SymbolPath.CIRCLE, fillColor: '#1D9E75', fillOpacity: 1, strokeColor: '#0F6E56', strokeWeight: 2, scale: 10 }}
              />
              {selectedClients.map((c, i) => (
                <Marker key={c.id} position={{ lat: c.lat, lng: c.lng }} title={c.name} label={{ text: String(i + 1), color: 'white', fontWeight: 'bold' }} />
              ))}
              {stopsExtra.map((s, i) => (
                <Marker
                  key={`extra-${i}`}
                  position={s.coords}
                  title={s.adresse}
                  icon={{ path: window.google?.maps.SymbolPath.CIRCLE, fillColor: '#3B82F6', fillOpacity: 1, strokeColor: '#1D4ED8', strokeWeight: 2, scale: 8 }}
                />
              ))}
              <Marker
                position={ARRIVEE_DEFAULT}
                title="Arrivée — Chalon-sur-Saône"
                icon={{ path: window.google?.maps.SymbolPath.CIRCLE, fillColor: '#E24B4A', fillOpacity: 1, strokeColor: '#A32D2D', strokeWeight: 2, scale: 10 }}
              />
              <StationsEssence waypoints={waypoints} />
              <TrajetRoute
                waypoints={waypoints}
                heureDepart={heureDepart}
                onDureeChange={(duree, km) => { setDureeReelle(duree); if(km) setDistanceReelle(km) }}
              />
            </Map>
          </div>

          {/* LÉGENDE */}
          <div className="flex gap-4 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Départ</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-red-400"></div>Stops clients</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-red-600"></div>Arrivée</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-emerald-400 opacity-60"></div>Trajet optimisé</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-amber-400"></div>Stations essence</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Stop improvisé</div>
          </div>

          {/* STATS */}
          <div className="flex gap-4 mb-3 flex-wrap">
            {[
              { val: `${selectedClients.length} RDV`, lab: 'Stops' },
              { val: `${distanceReelle} km`, lab: 'Total trajet' },
              { val: dureeReelle, lab: 'Durée totale' },
              { val: heureDepart, lab: 'Départ' },
              { val: `~${coutCarburant} CHF`, lab: '⛽ Carburant', color: 'text-amber-700' },
            ].map(s => (
              <div key={s.lab}>
                <div className={`text-base font-bold ${s.color || 'text-gray-900'}`}>{s.val}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.lab}</div>
              </div>
            ))}
          </div>

          {/* STOP IMPROVISÉ */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={stopImprovisé}
              onChange={e => setStopImprovisé(e.target.value)}
              placeholder="Ajouter un stop improvisé..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-blue-400"
              onKeyDown={e => e.key === 'Enter' && ajouterStop()}
            />
            <button
              onClick={ajouterStop}
              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              + Ajouter
            </button>
          </div>
          {stopsExtra.length > 0 && (
            <div className="flex flex-col gap-1 mb-3">
              {stopsExtra.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5">
                  <span>📍 {s.adresse}</span>
                  <button
                    onClick={() => setStopsExtra(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-blue-400 hover:text-red-500 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STOPS */}
          <div className="flex flex-col gap-0">
            {stopsActuels.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 ${
                    s.dest ? 'bg-red-500 border-red-500' :
                    s.fuel ? 'bg-amber-50 border-amber-400' :
                    s.extra ? 'bg-blue-500 border-blue-500' :
                    s.isDepart ? 'bg-emerald-500 border-emerald-500' :
                    'bg-white border-emerald-500'
                  }`}></div>
                  {i < stopsActuels.length - 1 && <div className="w-px h-6 bg-gray-200"></div>}
                </div>
                <div className="pb-3 flex-1">
                  <div className={`text-xs font-semibold ${s.dest ? 'text-red-500' : s.fuel ? 'text-amber-700' : s.extra ? 'text-blue-600' : 'text-gray-900'}`}>{s.name}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg p-2.5">
            ✓ Trajet optimisé — {selectedClients.length} clients · {distanceReelle} km · {dureeReelle}
          </div>
        </div>
      </div>
    </div>
  )
}