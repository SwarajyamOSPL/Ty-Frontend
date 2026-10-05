import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import {
  createCapper, deleteCapper, fetchCappers, fetchUnregistered, setCapperAccounts, updateCapper,
} from './cappersThunks'

const mutations = [createCapper, updateCapper, setCapperAccounts, deleteCapper]

const setActive = (s, id, active) => {
  const c = s.items.find((x) => x.id === id)
  if (c) c.active = active
}

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  unregistered: [],
  saving: false,
  error: null,
}

const cappersSlice = createSlice({
  name: 'cappers',
  initialState,
  reducers: {
    clearCapperError: (s) => {
      s.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCappers.pending, (s, action) => {
        if (!action.meta.arg?.silent) s.status = 'loading'
        s.error = null
      })
      .addCase(fetchCappers.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.items = payload
      })
      .addCase(fetchCappers.rejected, (s, { payload, error }) => {
        s.status = 'failed'
        s.error = payload ?? error.message
      })
      .addCase(fetchUnregistered.fulfilled, (s, { payload }) => {
        s.unregistered = payload
      })
      .addCase(updateCapper.pending, (s, { meta }) => {
        const { id, active } = meta.arg
        if (typeof active === 'boolean') setActive(s, id, active)
      })
      .addCase(updateCapper.rejected, (s, { meta }) => {
        const { id, active } = meta.arg
        if (typeof active === 'boolean') setActive(s, id, !active)
      })
      .addMatcher(isAnyOf(...mutations.map((m) => m.pending)), (s) => {
        s.saving = true
        s.error = null
      })
      .addMatcher(isAnyOf(...mutations.map((m) => m.fulfilled)), (s) => {
        s.saving = false
      })
      .addMatcher(isAnyOf(...mutations.map((m) => m.rejected)), (s, { payload, error }) => {
        s.saving = false
        s.error = payload ?? error.message
      })
  },
})

export const { clearCapperError } = cappersSlice.actions
export const selectCappers = (s) => s.cappers.items
export const selectCappersStatus = (s) => s.cappers.status
export const selectUnregistered = (s) => s.cappers.unregistered
export const selectCappersSaving = (s) => s.cappers.saving
export const selectCappersError = (s) => s.cappers.error

export default cappersSlice.reducer
