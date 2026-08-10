import api from '../../../services/api'

// GET /history — supports search + period + status/service filters via
// query params so the backend does the filtering (not the client).
// `api`'s response interceptor already unwraps { success, data, pagination }
// into plain data, so this returns either an array or { data, pagination }.
//
// Adjust the param names / the mapping below once the backend's actual
// field names are confirmed — this is written against the shape
// HistoryListItem / HistoryDetailCard already expect:
//   { id, code, name, date, time, changeFrom, changeTo, detail: { orderInfo, statusHistory, paymentInfo } }
export function getHistory({ search, startDate, endDate, statuses = [], services = [] } = {}) {
  const params = {}

  if (search) params.search = search
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  if (statuses.length > 0) params.status = statuses.join(',')
  if (services.length > 0) params.service = services.join(',')

  return api.get('/history', { params })
}