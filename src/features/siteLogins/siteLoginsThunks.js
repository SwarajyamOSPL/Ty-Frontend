import { createAsyncThunk } from '@reduxjs/toolkit'
import { siteLoginService } from '@/services/siteLoginService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const fetchSiteLogins = createAsyncThunk('siteLogins/fetchAll', async (arg, { rejectWithValue }) => {
  try {
    return await siteLoginService.getAll(arg?.partnerId)
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

export const saveSiteLogin = createAsyncThunk('siteLogins/save', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const saved = await siteLoginService.save(payload)
    await dispatch(fetchSiteLogins({ silent: true }))
    return saved
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

export const deleteSiteLogin = createAsyncThunk('siteLogins/delete', async (id, { dispatch, rejectWithValue }) => {
  try {
    await siteLoginService.remove(id)
    await dispatch(fetchSiteLogins({ silent: true }))
    return id
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})
