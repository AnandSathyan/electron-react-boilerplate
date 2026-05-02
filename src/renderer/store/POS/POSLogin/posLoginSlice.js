import { createSlice } from '@reduxjs/toolkit';
import { posLogin, posLogout } from './posLoginThunk';

const initialState = {
  loading: false,
  user: null,
  error: null,
  success: false,
};

const posLoginSlice = createSlice({
  name: 'posLogin',
  initialState,
  reducers: {
    // Optional manual logout trigger
    logoutPOS: (state) => {
      state.loading = false;
      state.user = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(posLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(posLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(posLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(posLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(posLogout.fulfilled, (state) => {
        // ✅ Clear the Redux state on logout
        state.loading = false;
        state.user = null;
        state.success = false;
        state.error = null;
      })
      .addCase(posLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const { logoutPOS } = posLoginSlice.actions;
export default posLoginSlice.reducer;
