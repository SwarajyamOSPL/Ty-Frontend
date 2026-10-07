import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data. Swap the reducers for API thunks when the backend is ready.
const initialState = { items: loadJSON('partners', []) } // [{ id, name, createdAt }]

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    addPartner: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload) // newest first
      },
      prepare: (name) => ({ payload: { id: nanoid(), name, createdAt: new Date().toISOString() } }),
    },
  },
})

export const { addPartner } = partnersSlice.actions
export const selectPartners = (s) => s.partners.items

export default partnersSlice.reducer
