// src/store/branch/branchslice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchbranchs = createAsyncThunk(
  'branch/fetchbranchs',
  async ({ registrationNo,CompanyID,BrandID }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://74.208.235.72:1001/SelfCheckOutAPI/BranchMasterAPI',
        [
          {
            Param: 'Select',
            BranchDetail: {
              RegistrationNo: registrationNo,
              CompanyID: CompanyID,
              BrandID: BrandID,
              IsSync: true,
              ActiveStatus: true,
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

const branchslice = createSlice({
  name: 'branch',
  initialState: {
    branchs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearbranchs: (state) => {
      state.branchs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchbranchs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchbranchs.fulfilled, (state, action) => {
        state.loading = false;
        state.branchs = action.payload;
      })
      .addCase(fetchbranchs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearbranchs } = branchslice.actions;

export default branchslice.reducer;
