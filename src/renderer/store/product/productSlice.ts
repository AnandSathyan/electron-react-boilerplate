// src/features/product/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { submitProduct } from './productThunk';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProducts: (state) => {
      // console.log("state.products",state.products);
      
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitProduct.fulfilled, (state, action) => {
        state.loading = false;
      
        // Extract `Result` from response
        const results = Array.isArray(action.payload?.Result)
          ? action.payload.Result
          : [];
      
        state.products = results;
      })  
      .addCase(submitProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearProducts } = productSlice.actions;

export default productSlice.reducer;
