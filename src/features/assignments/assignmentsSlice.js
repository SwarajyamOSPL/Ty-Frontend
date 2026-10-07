import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data. A partner is assigned a website of one of the created accounts.
const initialState = { items: loadJSON('assignments', []) } // [{ id, partnerId, accountId, website, createdAt }]

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    assignAccount: {
      reducer: (state, { payload }) => {
        const exists = state.items.some(
          (a) => a.partnerId === payload.partnerId && a.accountId === payload.accountId && a.website === payload.website,
        )
        if (!exists) state.items.unshift(payload) // newest first
      },
      prepare: ({ partnerId, accountId, website }) => ({
        payload: { id: nanoid(), partnerId, accountId, website, createdAt: new Date().toISOString() },
      }),
    },
    unassignAccount: (state, { payload: id }) => {
      state.items = state.items.filter((a) => a.id !== id)
    },
  },
})

export const { assignAccount, unassignAccount } = assignmentsSlice.actions
export const selectAssignments = (s) => s.assignments.items

export default assignmentsSlice.reducer
