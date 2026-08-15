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

// Backend contract (src/validators/expense.validator.js + prisma Expense
// model on tubes-cheva2-be): plain JSON body — { category, amount, source?,
// description?, receiptProof?, spentAt? }. The schema is .strict(), so any
// other key (e.g. the FE's old "fundingSource"/"receipt"/"date" names) gets
// rejected outright. spentAt must be a FULL ISO datetime string (z.string()
// .datetime()), not just "YYYY-MM-DD". There's no file-upload middleware on
// this route — receiptProof is a URL string, so a receipt File must be
// uploaded via POST /upload first (see uploadService.uploadFile) and only
// the resulting URL passed here, exactly like the QRIS image flow.
export function createExpense({ spentAt, category, source, amount, description, receiptProof } = {}) {
  return api.post('/expenses', {
    spentAt,
    category,
    source,
    amount,
    description,
    receiptProof,
  })
}