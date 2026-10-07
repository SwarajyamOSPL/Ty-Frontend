import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '@/utils/storage'

// Dummy, in-browser data. Passwords are kept in memory only (never saved to localStorage, never shown).
const initialState = { items: loadJSON('accounts', []) } // [{ id, username, password?, websites[], createdAt }]

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: {
      reducer: (state, { payload }) => {
        state.items.unshift(payload) // newest first
      },
      prepare: ({ username, password, websites }) => ({
        payload: { id: nanoid(), username, password, websites, createdAt: new Date().toISOString() },
      }),
    },
  },
})

export const { addAccount } = accountsSlice.actions
export const selectAccounts = (s) => s.accounts.items

export default accountsSlice.reducer
