export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

// "YYYY-MM-DD" from a date input; parsed as a local day so the date never shifts by timezone
export const formatDay = (ymd) => (ymd ? formatDate(`${ymd}T00:00:00`) : '—')
