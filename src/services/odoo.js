const ODOO_URL = import.meta.env.VITE_ODOO_URL
const ODOO_DB = import.meta.env.VITE_ODOO_DB
const ODOO_USER = import.meta.env.VITE_ODOO_USER
const ODOO_PASSWORD = import.meta.env.VITE_ODOO_PASSWORD

export async function testConnexion() {
  try {
    const response = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_DB,
          login: ODOO_USER,
          password: ODOO_PASSWORD,
        }
      })
    })
    const data = await response.json()
    if (data.result?.uid) {
      console.log('✅ Connexion Odoo réussie ! UID:', data.result.uid)
      return data.result.uid
    } else {
      console.error('❌ Connexion échouée:', data)
      return null
    }
  } catch (err) {
    console.error('❌ Erreur réseau:', err)
    return null
  }
}

export async function getClients() {
  const uid = await testConnexion()
  if (!uid) return []

  const response = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'res.partner',
        method: 'search_read',
        args: [[['customer_rank', '>', 0]]],
        kwargs: {
          fields: ['name', 'email', 'phone', 'street', 'city'],
          limit: 50,
        }
      }
    })
  })
  const data = await response.json()
  return data.result || []
}