import api from './api'

export const capperService = {
  getAll: () => api.get('/cappers').then((r) => r.data),
  getUnregistered: () => api.get('/cappers/unregistered').then((r) => r.data),
  getById: (id) => api.get(`/cappers/${id}`).then((r) => r.data),
  create: (payload) => api.post('/cappers', payload).then((r) => r.data), // { name, active? }
  update: (id, payload) => api.patch(`/cappers/${id}`, payload).then((r) => r.data), // { name?, active? }
  setAccounts: (id, accounts) => api.put(`/cappers/${id}/accounts`, { accounts }).then((r) => r.data),
  remove: (id) => api.delete(`/cappers/${id}`).then((r) => r.data),
}
