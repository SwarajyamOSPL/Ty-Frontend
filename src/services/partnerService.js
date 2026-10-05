import api from './api'

export const partnerService = {
  getAll: () => api.get('/partners').then((r) => r.data),
  // creates or updates by name
  save: (payload) => api.post('/partners', payload).then((r) => r.data),
}
