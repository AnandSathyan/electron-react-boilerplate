import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for API call
export const fetchItemModifiers = createAsyncThunk(
  'itemModifiers/fetchItemModifiers',
  async (registrationNumber, { rejectWithValue }) => {
    // console.log("registrationNumber",registrationNumber);
    try {
      const response = await axios.post('http://74.208.235.72:1001/SelfCheckOutAPI/ItemModifireDetailAPI', [
        {
          Param: 'Select',
          ItemModifireDetails: [
            {
              RegistrationNo: registrationNumber.registrationNumber
            }
          ]
        }
      ]);
      return response.data.Result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const itemModifierSlice = createSlice({
  name: 'itemModifiers',
  initialState: {
    loading: false,
    error: null,
    data: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemModifiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemModifiers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchItemModifiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export default itemModifierSlice.reducer;
