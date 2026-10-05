import api from './api'

export const systemService = {
  getHealth: () => api.get('/health').then((r) => r.data), // status and backend (sqlite/postgres)
  getBookAccounts: () => api.get('/book-accounts').then((r) => r.data),
  masterSheetUrl: `${import.meta.env.VITE_API_BASE_URL}/master-sheet`,
}
