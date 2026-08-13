import api from '../../../services/api'

// Revenue = PAID transactions summed by amount (matches the backend's own
// report/dashboard definition — only paid transactions count as income).
export function listTransactions({ startDate, endDate, paymentStatus = 'PAID', page = 1, limit = 500 } = {}) {
  return api.get('/transactions', { params: { startDate, endDate, paymentStatus, page, limit } })
}

export function listExpenses({ startDate, endDate, page = 1, limit = 500 } = {}) {
  return api.get('/expenses', { params: { startDate, endDate, page, limit } })
}

// Used by ExpenseDetailModal ("Lihat Detail").
export function getExpense(id) {
  return api.get(`/expenses/${id}`)
}

// payload: { date, category, fundingSource, amount, description, receipt? }
// If a receipt file is attached, send multipart/form-data; otherwise a plain
// JSON body is enough. Adjust here if the backend expects a different field
// name for the uploaded nota/struk.
export function createExpense(payload) {
  const { receipt, ...rest } = payload
  if (!receipt) {
    return api.post('/expenses', rest)
  }
  const formData = new FormData()
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value)
  })
  formData.append('receipt', receipt)
  return api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}