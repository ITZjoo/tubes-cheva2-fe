import api from '../../../services/api'

// Backend contract (tubes-cheva2-be src/routes/chat.routes.js + chat.service.js).
// Staff/admin side only — customer-facing chat is a separate future app.
// GET  /chat/conversations       -> list, each pre-shaped as
//   { id, name, role, time, lastMessage, replied, trxId, date, question, questionTime }
//   (matches ChatList / ChatDetailPanel's props directly)
// GET  /chat/conversations/:id   -> same shape + full `messages` array
// POST /chat/conversations/:id/reply  <- { body }  (the reply text)
export async function listConversations() {
  return api.get('/chat/conversations')
}

export async function getConversation(id) {
  return api.get(`/chat/conversations/${id}`)
}

export async function replyToConversation(id, body) {
  return api.post(`/chat/conversations/${id}/reply`, { body })
}
