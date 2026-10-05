import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from '@/features/accounts/accountsSlice'
import authReducer from '@/features/auth/authSlice'
import cappersReducer from '@/features/cappers/cappersSlice'
import importsReducer from '@/features/imports/importsSlice'
import partnersReducer from '@/features/partners/partnersSlice'
import siteLoginsReducer from '@/features/siteLogins/siteLoginsSlice'

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    auth: authReducer,
    cappers: cappersReducer,
    imports: importsReducer,
    partners: partnersReducer,
    siteLogins: siteLoginsReducer,
  },
})
