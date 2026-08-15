import api from '../../../services/api'

// GET /canned-questions is auth'd for either staff/admin or a logged-in
// customer; as staff it returns active-only unless `all: true` is passed.
export function listCannedQuestions({ category } = {}) {
  return api.get('/canned-questions', { params: { category: category || undefined } })
}

// Logs the lookup server-side (CannedQuestionHistory) and returns the
// matching { cannedQuestionId, category, question, answer, historyId, askedAt }.
export function askCannedQuestion({ cannedQuestionId, customerId, orderId } = {}) {
  return api.post('/canned-questions/ask', { cannedQuestionId, customerId, orderId })
}

// Admin-only audit log (paginated) of past lookups.
export function getCannedQuestionHistory({ page = 1, limit = 20 } = {}) {
  return api.get('/canned-questions/history', { params: { page, limit } })
}
