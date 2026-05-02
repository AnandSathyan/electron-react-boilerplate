import { createSlice } from '@reduxjs/toolkit';
import { fetchPOSMaster } from './PosMasterApi';

const posMasterSlice = createSlice({
  name: 'posMaster',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchPOSMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOSMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPOSMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default posMasterSlice.reducer;
