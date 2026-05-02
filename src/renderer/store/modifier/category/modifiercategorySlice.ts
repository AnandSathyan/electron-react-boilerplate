// src/features/modifierCategory/modifierCategorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchmodifierCategories } from './modifiercategoryThunk';

const initialState = {
  modifierCategories: [],
  loading: false,
  error: null,
};

const modifierCategorySlice = createSlice({
  name: 'modifierCategory',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
      .addCase(fetchmodifierCategories.pending, (state:any) => {
        state.loading = true;
        state.error = null;  // Clear previous errors
      })
      .addCase(fetchmodifierCategories.fulfilled, (state:any, action:any) => {
        state.loading = false;
        state.modifierCategories = action.payload;  // Store the modifierCategories
      })
      .addCase(fetchmodifierCategories.rejected, (state:any, action:any) => {
        state.loading = false;
        state.error = action.payload || action.error.message;  // Handle error
      });
  },
});

export default modifierCategorySlice.reducer;
