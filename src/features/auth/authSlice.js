import { createSlice } from '@reduxjs/toolkit'

// Dummy auth: any non-empty username/password is accepted.
// The "session" is just the username kept in localStorage (not real security).
const KEY = 'auth_user'

const read = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null // storage unavailable
  }
}

const write = (value) => {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
  } catch {
    // storage unavailable
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: read() },
  reducers: {
    login: (state, { payload }) => {
      state.user = payload
      write(payload)
    },
    logout: (state) => {
      state.user = null
      write(null)
    },
  },
})

export const { login, logout } = authSlice.actions
export const selectUser = (s) => s.auth.user

export default authSlice.reducer
