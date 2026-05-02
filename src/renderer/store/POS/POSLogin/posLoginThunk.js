import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { POS_LOGIN, POS_LOGOUT } from './posLoginTypes';

export const posLogin = createAsyncThunk(
  POS_LOGIN,
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://74.208.235.72:1001/SelfCheckOutAPI/POSMasterAPI',
        [credentials],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data?.Status) {
        return response.data.Result[0];
      } else {
        return rejectWithValue(response.data.Message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

export const posLogout = createAsyncThunk(
  POS_LOGOUT,
  async (logoutPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://74.208.235.72:1001/SelfCheckOutAPI/POSMasterAPI',
        [logoutPayload],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.Status) {
        return response.data.Message;
      } else {
        return rejectWithValue(response.data.Message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);
