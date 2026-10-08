import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from '@/features/accounts/accountsSlice'
import assignmentsReducer from '@/features/assignments/assignmentsSlice'
import authReducer from '@/features/auth/authSlice'
import capperAssignmentsReducer from '@/features/capperAssignments/capperAssignmentsSlice'
import capperFiguresReducer from '@/features/capperFigures/capperFiguresSlice'
import cappersReducer from '@/features/cappers/cappersSlice'
import figuresReducer from '@/features/figures/figuresSlice'
import importsReducer from '@/features/imports/importsSlice'
import partnersReducer from '@/features/partners/partnersSlice'
import { saveJSON } from '@/utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    partners: partnersReducer,
    accounts: accountsReducer,
    assignments: assignmentsReducer,
    figures: figuresReducer,
    cappers: cappersReducer,
    capperAssignments: capperAssignmentsReducer,
    capperFigures: capperFiguresReducer,
    imports: importsReducer,
  },
})

// keep the dummy data across refreshes (passwords are dropped: undefined is skipped by JSON.stringify)
const PERSISTED = [
  'partners', 'accounts', 'assignments', 'figures', 'cappers', 'capperAssignments', 'capperFigures', 'imports',
]
let last = {}
store.subscribe(() => {
  const state = store.getState()
  for (const key of PERSISTED) {
    const items = state[key].items
    if (items === last[key]) continue
    last[key] = items
    saveJSON(key, key === 'accounts' ? items.map((a) => ({ ...a, password: undefined })) : items)
  }
})
