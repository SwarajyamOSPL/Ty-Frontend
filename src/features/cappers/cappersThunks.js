import { createAsyncThunk } from '@reduxjs/toolkit'
import { capperService } from '@/services/capperService'
import { getErrorMessage } from '@/utils/getErrorMessage'

// Pass { silent: true } to refetch without flipping the list back to skeleton
export const fetchCappers = createAsyncThunk('cappers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await capperService.getAll()
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

export const fetchUnregistered = createAsyncThunk('cappers/fetchUnregistered', async (_, { rejectWithValue }) => {
  try {
    return await capperService.getUnregistered()
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

// Runs a mutation, then refreshes both lists quietly
const mutation = (type, fn) =>
  createAsyncThunk(type, async (arg, { dispatch, rejectWithValue }) => {
    try {
      const result = await fn(arg)
      await Promise.all([
        dispatch(fetchCappers({ silent: true })),
        dispatch(fetchUnregistered({ silent: true })),
      ])
      return result
    } catch (e) {
      return rejectWithValue(getErrorMessage(e))
    }
  })

export const createCapper = mutation('cappers/create', (payload) => capperService.create(payload))
export const updateCapper = mutation('cappers/update', ({ id, ...patch }) => capperService.update(id, patch))
export const setCapperAccounts = mutation('cappers/setAccounts', ({ id, accounts }) =>
  capperService.setAccounts(id, accounts),
)
export const deleteCapper = mutation('cappers/delete', (id) => capperService.remove(id))
