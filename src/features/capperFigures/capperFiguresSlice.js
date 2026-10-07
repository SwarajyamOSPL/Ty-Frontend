import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data: one entered figure for a capper's assigned account (website).
const initialState = { items: loadJSON('capperFigures', []) } // [{ id, capperId, accountId, website, figure, fromDate, toDate, createdAt }]

const slice = createSlice({
  name: 'capperFigures',
  initialState,
  reducers: {
    addCapperFigure: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload) // newest first
      },
      prepare: ({ capperId, accountId, website, figure, fromDate, toDate }) => ({
        payload: { id: nanoid(), capperId, accountId, website, figure, fromDate, toDate, createdAt: new Date().toISOString() },
      }),
    },
  },
})

export const { addCapperFigure } = slice.actions
export const selectCapperFigures = (s) => s.capperFigures.items

export default slice.reducer
