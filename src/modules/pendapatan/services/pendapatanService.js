import api from '../../../services/api'

// Revenue = PAID transactions summed by amount (matches the backend's own
// report/dashboard definition — only paid transactions count as income).
export function listTransactions({ startDate, endDate, paymentStatus = 'PAID', page = 1, limit = 500 } = {}) {
  return api.get('/transactions', { params: { startDate, endDate, paymentStatus, page, limit } })
}

export function listExpenses({ startDate, endDate, page = 1, limit = 500 } = {}) {
  return api.get('/expenses', { params: { startDate, endDate, page, limit } })
}

export function createExpense(payload) {
  return api.post('/expenses', payload)
}
