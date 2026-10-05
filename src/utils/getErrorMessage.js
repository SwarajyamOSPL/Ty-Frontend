export const getErrorMessage = (error) => {
  const data = error.response?.data
  if (typeof data?.detail === 'string') return data.detail
  if (Array.isArray(data?.detail)) return data.detail.map((d) => d.msg).join(', ')
  return data?.message || error.message || 'Something went wrong'
}
