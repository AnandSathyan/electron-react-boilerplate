import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import qs from 'qs';
import api from '../../app/api/api'; // Axios instance

const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Async Thunk
export const getCountries = createAsyncThunk(
  'country/getCountries',
  async (_, { rejectWithValue }) => {
    const requestData = {
      RegistrationNo: '3205',
      Pass: 'Admin',
    };

    try {
      const response = await api.post(
        '/CountryMaster',
        qs.stringify(requestData),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      if (!response?.data) throw new Error('Empty response from server');

      // console.log("response", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

// Slice
const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // ✅ now this will not be undefined
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default countrySlice.reducer;
