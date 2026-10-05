import { createSlice } from '@reduxjs/toolkit'
import { deleteSiteLogin, fetchSiteLogins, saveSiteLogin } from './siteLoginsThunks'

const initialState = { items: [], status: 'idle', saving: false, error: null }

const siteLoginsSlice = createSlice({
  name: 'siteLogins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteLogins.pending, (s, action) => {
        if (!action.meta.arg?.silent) s.status = 'loading'
        s.error = null
      })
      .addCase(fetchSiteLogins.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.items = payload
      })
      .addCase(fetchSiteLogins.rejected, (s, { payload, error }) => {
        s.status = 'failed'
        s.error = payload ?? error.message
      })
      .addCase(saveSiteLogin.pending, (s) => {
        s.saving = true
        s.error = null
      })
      .addCase(saveSiteLogin.fulfilled, (s) => {
        s.saving = false
      })
      .addCase(saveSiteLogin.rejected, (s, { payload }) => {
        s.saving = false
        s.error = payload
      })
      .addCase(deleteSiteLogin.rejected, (s, { payload }) => {
        s.error = payload
      })
  },
})

export const selectSiteLogins = (s) => s.siteLogins.items
export const selectSiteLoginsStatus = (s) => s.siteLogins.status
export const selectSiteLoginsSaving = (s) => s.siteLogins.saving
export const selectSiteLoginsError = (s) => s.siteLogins.error

export default siteLoginsSlice.reducer
