import { createAsyncThunk } from '@reduxjs/toolkit'
import { partnerService } from '@/services/partnerService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const fetchPartners = createAsyncThunk('partners/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await partnerService.getAll()
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

export const savePartner = createAsyncThunk('partners/save', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const saved = await partnerService.save(payload)
    await dispatch(fetchPartners({ silent: true }))
    return saved
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})
