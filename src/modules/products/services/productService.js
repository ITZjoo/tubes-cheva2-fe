import api from '../../../services/api'

export async function listServices({ all } = {}) {
  const res = await api.get('/services', { params: all ? { all: true } : undefined })
  return Array.isArray(res) ? res : (res?.data ?? [])
}

export async function getService(id) {
  return api.get(`/services/${id}`)
}

export async function createService(payload) {
  return api.post('/services', payload)
}

export async function updateService(id, payload) {
  return api.put(`/services/${id}`, payload)
}

export async function deleteService(id) {
  return api.delete(`/services/${id}`)
}
