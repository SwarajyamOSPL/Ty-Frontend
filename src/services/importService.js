import api from './api'

export const importService = {
  // format: '' (auto-detect) | 'book_accounts' | 'site_logins'; weekOf: 'YYYY-MM-DD' | ''
  bulkImport: ({ file, format, weekOf, dryRun }) => {
    const body = new FormData()
    body.append('file', file)
    const params = { dry_run: dryRun }
    if (format) params.format = format
    if (weekOf) params.week_of = weekOf
    return api
      .post('/bulk-import', body, {
        params,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // large workbooks take longer than the default 15s
      })
      .then((r) => r.data)
  },
}
