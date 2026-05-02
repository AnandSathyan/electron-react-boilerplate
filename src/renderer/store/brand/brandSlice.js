// src/store/brand/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  async ({ registrationNo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://74.208.235.72:1001/SelfCheckOutAPI/BrandMasterAPI',
        [
          {
            Param: 'Select',
            BrandDetail: {
              RegistrationNo: registrationNo,
              IsSync: true,
            },
          },
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.Status) {
        return response.data.Result;
      } else {
        return rejectWithValue(response.data.Message || 'Unknown error');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBrands } = brandSlice.actions;

export default brandSlice.reducer;
