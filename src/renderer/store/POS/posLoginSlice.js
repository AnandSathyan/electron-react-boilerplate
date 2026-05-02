// src/features/posMaster/posLoginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://74.208.235.72:1001/SelfCheckOutAPI/POSMasterAPI";

/**
 * POS Login
 */
export const posLogin = createAsyncThunk(
  "posMaster/posLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, [credentials], {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.Status) {
        return data.Result?.[0] || null;
      } else {
        return rejectWithValue(data?.Message || "Login failed");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.Message || error.message || "Network error"
      );
    }
  }
);

/**
 * POS Logout
 */
export const posLogout = createAsyncThunk(
  "posMaster/posLogout",
  async (logoutPayload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, [logoutPayload], {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.Status) {
        return data.Message || "Logout successful";
      } else {
        return rejectWithValue(data?.Message || "Logout failed");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.Message || error.message || "Network error"
      );
    }
  }
);

/**
 * Slice
 */
const posLoginSlice = createSlice({
  name: "posLogin",
  initialState: {
    loading: false,
    user: null,
    error: null,
    success: false,
    message: null, // new field for API messages
  },
  reducers: {
    logoutPOS: (state) => {
      state.loading = false;
      state.user = null;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login
      .addCase(posLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(posLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
        state.message = "Login successful";
      })
      .addCase(posLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.success = false;
        state.error = action.payload;
        state.message = null;
      })

      // 🔹 Logout
      .addCase(posLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(posLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.success = false;
        state.error = null;
        state.message = action.payload;
      })
      .addCase(posLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { logoutPOS } = posLoginSlice.actions;

export default posLoginSlice.reducer;
