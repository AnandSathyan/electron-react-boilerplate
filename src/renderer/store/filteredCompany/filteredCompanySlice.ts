// store/slices/filteredSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filteredCountries: [],
};

const filteredSlice = createSlice({
  name: 'filtered',
  initialState,
  reducers: {
    setFilteredCountries: (state, action) => {
      state.filteredCountries = action.payload;
    },
  },
});

export const { setFilteredCountries } = filteredSlice.actions;
export default filteredSlice.reducer;
