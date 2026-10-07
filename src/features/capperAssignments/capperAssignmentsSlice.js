import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data. A capper is assigned a website of one of the created accounts.
const initialState = { items: loadJSON('capperAssignments', []) } // [{ id, capperId, accountId, website, createdAt }]

const slice = createSlice({
  name: 'capperAssignments',
  initialState,
  reducers: {
    assignCapper: {
      reducer: (state, { payload }) => {
        const exists = state.items.some(
          (a) => a.capperId === payload.capperId && a.accountId === payload.accountId && a.website === payload.website,
        )
        if (!exists) state.items.unshift(payload) // newest first
      },
      prepare: ({ capperId, accountId, website }) => ({
        payload: { id: nanoid(), capperId, accountId, website, createdAt: new Date().toISOString() },
      }),
    },
    unassignCapper: (state, { payload: id }) => {
      state.items = state.items.filter((a) => a.id !== id)
    },
  },
})

export const { assignCapper, unassignCapper } = slice.actions
export const selectCapperAssignments = (s) => s.capperAssignments.items

export default slice.reducer
