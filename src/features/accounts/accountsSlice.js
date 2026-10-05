import { createSlice } from '@reduxjs/toolkit'
import { fetchAccounts, fetchHistory, fetchReceipt, fetchRuns, runPipeline } from './accountsThunks'

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  running: false,
  receipt: null,
  runs: [],
  runsStatus: 'idle',
  history: [],
  detailStatus: 'idle', // idle | loading | succeeded | failed
  detailError: null,
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearDetail: (state) => {
      state.receipt = null
      state.history = []
      state.detailStatus = 'idle'
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state, action) => {
        if (!action.meta.arg?.silent) state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAccounts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.items = payload
      })
      .addCase(fetchAccounts.rejected, (state, { payload, error }) => {
        state.status = 'failed'
        state.error = payload ?? error.message
      })
      .addCase(fetchRuns.pending, (state) => {
        state.runsStatus = 'loading'
      })
      .addCase(fetchRuns.fulfilled, (state, { payload }) => {
        state.runsStatus = 'succeeded'
        state.runs = payload
      })
      .addCase(fetchRuns.rejected, (state) => {
        state.runsStatus = 'failed'
      })
      .addCase(fetchReceipt.pending, (state) => {
        state.detailStatus = 'loading'
        state.detailError = null
      })
      .addCase(fetchReceipt.fulfilled, (state, { payload }) => {
        state.detailStatus = 'succeeded'
        state.receipt = payload
      })
      .addCase(fetchReceipt.rejected, (state, { payload, error }) => {
        state.detailStatus = 'failed'
        state.detailError = payload ?? error.message
      })
      .addCase(fetchHistory.fulfilled, (state, { payload }) => {
        state.history = payload
      })
      .addCase(runPipeline.pending, (state) => {
        state.running = true
      })
      .addCase(runPipeline.fulfilled, (state) => {
        state.running = false
      })
      .addCase(runPipeline.rejected, (state, { payload }) => {
        state.running = false
        state.error = payload
      })
  },
})

export const { clearDetail } = accountsSlice.actions
export const selectAccounts = (s) => s.accounts.items
export const selectAccountsStatus = (s) => s.accounts.status
export const selectAccountsError = (s) => s.accounts.error
export const selectRunning = (s) => s.accounts.running
export const selectRunsStatus = (s) => s.accounts.runsStatus
export const selectRuns = (s) => s.accounts.runs
export const selectHistory = (s) => s.accounts.history
export const selectDetailStatus = (s) => s.accounts.detailStatus
export const selectDetailError = (s) => s.accounts.detailError
export const selectReceipt = (s) => s.accounts.receipt

export default accountsSlice.reducer
