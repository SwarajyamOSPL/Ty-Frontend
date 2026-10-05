import api from './api'

const enc = encodeURIComponent

export const accountService = {
  // no dates: latest run, one record per account
  // with start_date / end_date (YYYY-MM-DD): every week overlapping the range, one record per account per week
  getAll: (params) => api.get('/accounts', { params }).then((r) => r.data),
  getHistory: (id) => api.get(`/accounts/${enc(id)}/history`).then((r) => r.data), // 404 if none
  getReceipt: (id) => api.get(`/accounts/${enc(id)}/receipt`).then((r) => r.data), // 404 if none
  run: () => api.post('/run').then((r) => r.data),
  getRuns: (limit = 50) => api.get('/runs', { params: { limit } }).then((r) => r.data),
}
