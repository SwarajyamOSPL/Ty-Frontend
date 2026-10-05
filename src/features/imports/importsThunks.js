import { createAsyncThunk } from '@reduxjs/toolkit'
import { importService } from '@/services/importService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export const importData = createAsyncThunk('imports/bulkImport', async (args, { rejectWithValue }) => {
  try {
    return await importService.bulkImport(args)
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})
