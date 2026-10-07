import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data: one entered figure for a partner's assigned account (website).
const initialState = { items: loadJSON('figures', []) } // [{ id, partnerId, accountId, website, figure, fromDate, toDate, createdAt }]

const figuresSlice = createSlice({
  name: 'figures',
  initialState,
  reducers: {
    addFigure: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload) // newest first
      },
      prepare: ({ partnerId, accountId, website, figure, fromDate, toDate }) => ({
        payload: { id: nanoid(), partnerId, accountId, website, figure, fromDate, toDate, createdAt: new Date().toISOString() },
      }),
    },
  },
})

export const { addFigure } = figuresSlice.actions
export const selectFigures = (s) => s.figures.items

export default figuresSlice.reducer
