// src/features/modifierProduct/modifierProductThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { submitmodifierProductData } from './modifierproductApi';

// src/features/modifierProduct/modifierProductThunks.js
export const submitmodifierProduct = createAsyncThunk(
  'modifierProduct/submitmodifierProduct',
  async (modifierProductData: any, thunkAPI: any) => {  
    try {
      const response = await submitmodifierProductData(modifierProductData);

      // console.log("🟢 modifierProduct API Response:", response);

      return response; // Must include Result
    } catch (error: any) {
      // console.log("🔴 modifierProduct API Error:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
