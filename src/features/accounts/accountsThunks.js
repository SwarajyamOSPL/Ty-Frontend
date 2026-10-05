import { createAsyncThunk } from '@reduxjs/toolkit'
import { accountService } from '@/services/accountService'
import { getErrorMessage } from '@/utils/getErrorMessage'

const wrap = (fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg)
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
}

export const fetchAccounts = createAsyncThunk('accounts/fetchAll', wrap((arg) =>
    accountService.getAll({ start_date: arg?.startDate || undefined, end_date: arg?.endDate || undefined }),
  ))
export const fetchRuns = createAsyncThunk('accounts/fetchRuns', wrap(() => accountService.getRuns(10)))
export const fetchHistory = createAsyncThunk('accounts/fetchHistory', wrap((id) => accountService.getHistory(id)))
export const fetchReceipt = createAsyncThunk('accounts/fetchReceipt', wrap((id) => accountService.getReceipt(id)))
export const runPipeline = createAsyncThunk('accounts/run', async (_, { dispatch, rejectWithValue }) => {
  try {
    await accountService.run()
    await dispatch(fetchAccounts())
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})
