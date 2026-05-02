import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPOSMaster = createAsyncThunk(
  'posMaster/fetchPOSMaster',
  async (registrationNo, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://74.208.235.72:1001/SelfCheckOutAPI/POSMasterAPI', [
        {
          Param: "Select",
          POSMaster: {
            RegistrationNo: registrationNo,
          },
        },
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
