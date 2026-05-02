// store/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // store the API response
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
        state.user = {
          ...action.payload,
          registrationNumber: action.meta?.registrationNumber, // ⬅️ add extra field
        };
        state.isAuthenticated = true;
      },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
