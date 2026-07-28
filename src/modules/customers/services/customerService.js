import api from '../../../services/api'

export async function listCustomers({ search, page, limit } = {}) {
  return api.get('/customers', { params: { search, page, limit } })
}

export async function getCustomer(id) {
  return api.get(`/customers/${id}`)
}

export async function createCustomer(payload) {
  return api.post('/customers', payload)
}

export async function updateCustomer(id, payload) {
  return api.put(`/customers/${id}`, payload)
}
