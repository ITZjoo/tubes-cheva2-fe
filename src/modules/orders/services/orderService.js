import api from '../../../services/api'
import { getStatusHops } from '../utils/orderStatus'

export async function listOrders(params = {}) {
  return api.get('/orders', { params })
}

export async function getOrder(id) {
  return api.get(`/orders/${id}`)
}

export async function createOrder(payload) {
  return api.post('/orders', payload)
}

export async function updateOrder(id, payload) {
  return api.put(`/orders/${id}`, payload)
}

async function setStatus(id, status, notes) {
  return api.patch(`/orders/${id}/status`, { status, notes })
}

// The FE lets staff jump straight to a target step; the backend only allows
// one forward transition at a time. Walk every intermediate hop so the UI's
// "jump ahead" gesture still lands on the right final status server-side.
export async function advanceStatus(id, currentBeStatus, targetFeStatus, notes) {
  const hops = getStatusHops(currentBeStatus, targetFeStatus)
  let result
  for (const status of hops) {
    result = await setStatus(id, status, notes)
  }
  return result
}

export async function trackOrder(trackingToken) {
  return api.get(`/orders/tracking/${trackingToken}`)
}
