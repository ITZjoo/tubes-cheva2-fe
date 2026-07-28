import api from '../../../services/api'

export async function getStats() {
  return api.get('/dashboard/stats')
}

export async function getRecentOrders(limit = 10) {
  return api.get('/dashboard/recent-orders', { params: { limit } })
}

export async function getRevenueChart({ year, month } = {}) {
  return api.get('/dashboard/revenue-chart', { params: { year, month } })
}
