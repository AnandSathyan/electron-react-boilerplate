// src/features/modifierProduct/modifierProductSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitmodifierProduct } from './modifierproductThunk';

const initialState = {
  modifierProducts: [],
  loading: false,
  error: null,
};

const modifierProductSlice = createSlice({
  name: 'modifierProduct',
  initialState,
  reducers: {
    clearmodifierProducts: (state) => {
      // console.log("state.modifierProducts",state.modifierProducts);
      
      state.modifierProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitmodifierProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitmodifierProduct.fulfilled, (state, action) => {
        state.loading = false;
      
        // Extract `Result` from response
        const results = Array.isArray(action.payload?.Result)
          ? action.payload.Result
          : [];
      
        state.modifierProducts = results;
      })  
      .addCase(submitmodifierProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearmodifierProducts } = modifierProductSlice.actions;

export default modifierProductSlice.reducer;
