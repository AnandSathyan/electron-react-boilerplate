// src/features/product/productThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { submitProductData } from './productApi';

// src/features/product/productThunks.js
export const submitProduct = createAsyncThunk(
  'product/submitProduct',
  async (productData: any, thunkAPI: any) => {  
    try {
      const response = await submitProductData(productData);

      // console.log("🟢 Product API Response:", response);

      return response; // Must include Result
    } catch (error: any) {
      // console.log("🔴 Product API Error:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
