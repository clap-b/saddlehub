const ODOO_URL = import.meta.env.VITE_ODOO_URL
const ODOO_DB = import.meta.env.VITE_ODOO_DB
const ODOO_USER = import.meta.env.VITE_ODOO_USER
const ODOO_PASSWORD = import.meta.env.VITE_ODOO_PASSWORD

async function odooCall(model, method, args = [], kwargs = {}) {
  const response = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args,
        kwargs,
      }
    })
  })
  const data = await response.json()
  return data.result
}

export async function getOdooClients() {
  const uid = await authenticate()
  return await odooCall('res.partner', 'search_read', 
    [[['customer_rank', '>', 0]]],
    { fields: ['name', 'email', 'phone', 'street', 'city'], uid }
  )
}

async function authenticate() {
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
  return data.result.uid
}

export async function getOdooProducts() {
  return await odooCall('product.product', 'search_read',
    [[]],
    { fields: ['name', 'list_price', 'categ_id', 'description'] }
  )
}