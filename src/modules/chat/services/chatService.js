import api from '../../../services/api'

export function getConversations() {
  return api.get('/chat/conversations')
}

export function getConversation(id) {
  return api.get(`/chat/conversations/${id}`)
}

export function replyToConversation(id, body) {
  return api.post(`/chat/conversations/${id}/reply`, { body })
}
