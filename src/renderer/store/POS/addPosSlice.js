// src/features/posMaster/posMasterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const insertPOSMaster = createAsyncThunk(
  'posMaster/insertPOSMaster',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://74.208.235.72:1001/SelfCheckOutAPI/POSMasterAPI',
        [payload], // API expects an array
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const posMasterSlice = createSlice({
  name: 'posMaster',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetPOSMasterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertPOSMaster.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(insertPOSMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(insertPOSMaster.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetPOSMasterState } = posMasterSlice.actions;

export default posMasterSlice.reducer;
