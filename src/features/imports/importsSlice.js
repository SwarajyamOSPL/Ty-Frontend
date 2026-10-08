import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data: a record of which file was given to which capper.
// Only the file's details are kept (the file itself is too big for localStorage).
const initialState = { items: loadJSON('imports', []) } // [{ id, capperId, fileName, fileType, size, createdAt }]

const importsSlice = createSlice({
  name: 'imports',
  initialState,
  reducers: {
    addImport: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload) // newest first
      },
      prepare: ({ capperId, fileName, fileType, size }) => ({
        payload: { id: nanoid(), capperId, fileName, fileType, size, createdAt: new Date().toISOString() },
      }),
    },
  },
})

export const { addImport } = importsSlice.actions
export const selectImports = (s) => s.imports.items

export default importsSlice.reducer
