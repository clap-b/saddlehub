const API_URL = 'https://saddlehub-api-production.up.railway.app'

export async function getClients() {
  try {
    const response = await fetch(`${API_URL}/api/clients`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération clients Odoo:', err)
    return []
  }
}

export async function getContacts() {
  try {
    const response = await fetch(`${API_URL}/api/contacts`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération contacts Odoo:', err)
    return []
  }
}

export async function getProduits() {
  try {
    const response = await fetch(`${API_URL}/api/produits`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération produits Odoo:', err)
    return []
  }
}

export async function getRdvs() {
  try {
    const response = await fetch(`${API_URL}/api/rdvs`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération RDVs Odoo:', err)
    return []
  }
}

export async function getMetriques() {
  try {
    const response = await fetch(`${API_URL}/api/metriques`)
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération métriques:', err)
    return { rdvsMois: 0, demandesEnAttente: 0, rdvs: [], pistes: [] }
  }
}