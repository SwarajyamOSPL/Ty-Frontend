import { createSlice } from '@reduxjs/toolkit'
import { importData } from './importsThunks'

const initialState = {
  status: 'idle', // idle | loading | succeeded | failed
  result: null, // { file, format, sheet, dry_run, imported, skipped: [{ row, reason }] }
  error: null,
}

const importsSlice = createSlice({
  name: 'imports',
  initialState,
  reducers: {
    resetImport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(importData.pending, (s) => {
        s.status = 'loading'
        s.result = null
        s.error = null
      })
      .addCase(importData.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.result = payload
      })
      .addCase(importData.rejected, (s, { payload, error }) => {
        s.status = 'failed'
        s.error = payload ?? error.message
      })
  },
})

export const { resetImport } = importsSlice.actions
export const selectImportStatus = (s) => s.imports.status
export const selectImportResult = (s) => s.imports.result
export const selectImportError = (s) => s.imports.error

export default importsSlice.reducer
