export async function getClients() {
  try {
    const response = await fetch('http://localhost:3001/api/clients')
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération clients Odoo:', err)
    return []
  }
}

export async function getContacts() {
  try {
    const response = await fetch('http://localhost:3001/api/contacts')
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération contacts Odoo:', err)
    return []
  }
}

export async function getProduits() {
  try {
    const response = await fetch('http://localhost:3001/api/produits')
    const data = await response.json()
    return data
  } catch (err) {
    console.error('Erreur récupération produits Odoo:', err)
    return []
  }
}