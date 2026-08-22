// Calcule les distances entre tous les points via Distance Matrix API
export async function calculerDistances(points) {
  const service = new window.google.maps.DistanceMatrixService()
  
  const result = await service.getDistanceMatrix({
    origins: points,
    destinations: points,
    travelMode: window.google.maps.TravelMode.DRIVING,
    unitSystem: window.google.maps.UnitSystem.METRIC,
  })

  // Construit une matrice de distances en km
  const matrice = result.rows.map(row =>
    row.elements.map(el => el.distance?.value || 999999)
  )

  return matrice
}

// Algorithme greedy TSP — trouve l'ordre optimal des stops
export function optimiserTournee(matrice, indexDepart = 0) {
  const n = matrice.length
  const visites = new Set([indexDepart])
  const ordre = [indexDepart]
  let current = indexDepart

  while (visites.size < n) {
    let meilleur = -1
    let meilleurDist = Infinity

    for (let i = 0; i < n; i++) {
      if (!visites.has(i) && matrice[current][i] < meilleurDist) {
        meilleurDist = matrice[current][i]
        meilleur = i
      }
    }

    visites.add(meilleur)
    ordre.push(meilleur)
    current = meilleur
  }

  return ordre
}

// Calcule le coût carburant estimé
export function calculerCoutCarburant(distanceKm, prixLitre = 1.87, consommation = 10) {
  const litres = (distanceKm / 100) * consommation
  return Math.round(litres * prixLitre)
}