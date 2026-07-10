import api from '../../../services/api'

export async function getOrders() {
  // TODO: connect to order list endpoint
  return api.get('/orders')
}

export async function getOrder(id) {
  // TODO: connect to order detail endpoint
  return api.get(`/orders/${id}`)
}

export async function updateOrderStatus(id, status) {
  // TODO: connect to update order status endpoint
  return api.patch(`/orders/${id}/status`, { status })
}
