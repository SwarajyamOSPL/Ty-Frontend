import api from './api'

export const siteLoginService = {
  getAll: (partnerId) =>
    api.get('/site-logins', { params: partnerId ? { partner_id: partnerId } : {} }).then((r) => r.data),
  getById: (id) => api.get(`/site-logins/${id}`).then((r) => r.data),
  // creates or updates
  save: (payload) => api.post('/site-logins', payload).then((r) => r.data),
  remove: (id) => api.delete(`/site-logins/${id}`).then((r) => r.data),
}
