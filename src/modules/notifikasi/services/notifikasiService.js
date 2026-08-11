import api from '../../../services/api'

export function getNotifications(params = {}) {
  return api.get('/notifications', { params })
}

export function markNotificationsAsRead(ids) {
  return api.patch('/notifications/mark-read', { ids })
}

export function deleteNotifications(ids) {
  return api.delete('/notifications', { data: { ids } })
}