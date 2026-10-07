import { createSlice, nanoid } from '@reduxjs/toolkit'
import { colorFor, DEFAULT_CAPPERS } from '@/utils/capperColors'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data. Starts with the 16 colour cappers; more can be created.
const seed = () => {
  const createdAt = new Date().toISOString()
  return DEFAULT_CAPPERS.map((name) => ({ id: nanoid(), name, color: colorFor(name), createdAt }))
}

const initialState = { items: loadJSON('cappers', null) ?? seed() } // [{ id, name, color|null, createdAt }]

const cappersSlice = createSlice({
  name: 'cappers',
  initialState,
  reducers: {
    addCapper: {
      reducer: (state, { payload }) => {
        state.items.push(payload) // new cappers go to the end, after the defaults
      },
      prepare: (name) => ({
        payload: { id: nanoid(), name, color: colorFor(name), createdAt: new Date().toISOString() },
      }),
    },
  },
})

export const { addCapper } = cappersSlice.actions
export const selectCappers = (s) => s.cappers.items

export default cappersSlice.reducer
