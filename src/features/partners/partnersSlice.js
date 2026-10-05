import { createSlice } from '@reduxjs/toolkit'
import { fetchPartners, savePartner } from './partnersThunks'

const initialState = { items: [], status: 'idle', saving: false, error: null }

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (s, action) => {
        if (!action.meta.arg?.silent) s.status = 'loading'
        s.error = null
      })
      .addCase(fetchPartners.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.items = payload
      })
      .addCase(fetchPartners.rejected, (s, { payload, error }) => {
        s.status = 'failed'
        s.error = payload ?? error.message
      })
      .addCase(savePartner.pending, (s) => {
        s.saving = true
        s.error = null
      })
      .addCase(savePartner.fulfilled, (s) => {
        s.saving = false
      })
      .addCase(savePartner.rejected, (s, { payload }) => {
        s.saving = false
        s.error = payload
      })
  },
})

export const selectPartners = (s) => s.partners.items
export const selectPartnersStatus = (s) => s.partners.status
export const selectPartnersSaving = (s) => s.partners.saving
export const selectPartnersError = (s) => s.partners.error

export default partnersSlice.reducer
