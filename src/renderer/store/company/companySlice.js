// store/company/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCompanyDetails = createAsyncThunk(
    'company/fetchDetails',
    async ({ registrationNo, companyID }, { rejectWithValue }) => {
        // console.log("registrationNo, companyID",registrationNo, companyID);
      try {
        const response = await fetch("http://74.208.235.72:1001/SelfCheckOutAPI/CompanyMasterAPI", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify([
            {
              Param: "Select",
              CompanyDetail: {
                RegistrationNo: registrationNo,
                CompanyID: companyID,
                CompanyCode: "",
                CompanyName: "",
                CompanyAdd1: "",
                CompanyAdd2: "",
                CountryID: "",
                Phone1: "",
                Phone2: "",
                Fax: "",
                Website: "",
                EmailID: "",
                Remarks: "",
                CompanyLogo: "",
                CreatedByID: "",
                CreatedDate: "",
                EditedByID: "",
                EditedDate: "",
                IndustryID: "",
                IsSync: true
              }
            }
          ])
        });
  
        const data = await response.json();
        if (data?.Status) {
          return data?.Result || [];
        } else {
          return rejectWithValue(data?.Message || "Failed to fetch company data");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const companySlice = createSlice({
  name: 'company',
  initialState: {
    details: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default companySlice.reducer;
