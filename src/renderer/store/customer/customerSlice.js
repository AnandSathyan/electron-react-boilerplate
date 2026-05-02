import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { useAppSelector } from "../../hooks/hooks";

// API Base URL
const API_BASE_URL = "http://74.208.235.72:1001/SelfCheckOutAPI/CustomerMasterAPI"
const user = useAppSelector((state) => state.auth?.user);

// Async thunk for getting/searching customer by mobile number
export const getCustomer = createAsyncThunk(
  "customer/getCustomer",
  async ({ RegistrationNo, mobileno }, { rejectWithValue }) => {
    try {
      const payload = [
        {
          Param: "Select",
          CustomerMaster: {
            RegistrationNo: RegistrationNo || user?.formData?.registrationNumber?user?.formData?.registrationNumber:"",
            companyid: "",
            brandid: "",
            CustomerId: "",
            countryid: "",
            CustomerCode: "",
            LocalName: "",
            CustomerName: "",
            DOB: "",
            Telephone: "",
            CreditLimit: "",
            Emailid: "",
            Address: "",
            ContactPerson: "",
            civilid: "",
            mobileno: mobileno || "",
            website: "",
            area: "",
            block: "",
            street: "",
            EditedByID: "",
            EditedDate: "",
            CreatedByID: "",
            CreatedDate: "",
            ActiveStatus: "",
            mobileno2: "",
            IsSync: "",
            CustomerGroupID: "",
            GSTNO: "",
            StateID: "",
          },
        },
      ]


      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error("Error searching customer:", error)
      return rejectWithValue(error.message)
    }
  },
)

// Async thunk for adding/inserting new customer
export const addCustomer = createAsyncThunk("customer/addCustomer", async (customerData, { rejectWithValue }) => {
  try {
    const payload = [
      {
        Param: "Insert",
        CustomerMaster: {
          RegistrationNo: customerData.RegistrationNo || user?.formData?.registrationNumber?user?.formData?.registrationNumber:"",
          companyid: customerData.companyid || "",
          brandid: customerData.brandid || "",
          countryid: customerData.countryid || "1",
          CustomerCode: customerData.CustomerCode || "",
          LocalName: customerData.LocalName || customerData.CustomerName,
          CustomerName: customerData.CustomerName || "",
          DOB: customerData.DOB || "2001-12-25",
          Telephone: customerData.Telephone || customerData.mobileno,
          CreditLimit: customerData.CreditLimit || "1000",
          Emailid: customerData.Emailid || "",
          Address: customerData.Address || "",
          ContactPerson: customerData.ContactPerson || customerData.CustomerName,
          civilid: customerData.civilid || "CIV1111",
          mobileno: customerData.mobileno || "",
          website: customerData.website || "anand.com",
          area: customerData.area || "Area",
          block: customerData.block || "Block",
          street: customerData.street || "Street",
          EditedByID: customerData.EditedByID || "",
          EditedDate: customerData.EditedDate || "",
          CreatedByID: customerData.CreatedByID || "7",
          CreatedDate: customerData.CreatedDate || new Date().toISOString().slice(0, 19).replace("T", " "),
          ActiveStatus: customerData.ActiveStatus || "1",
          mobileno2: customerData.mobileno2 || customerData.mobileno,
          IsSync: customerData.IsSync || "0",
          CustomerGroupID: customerData.CustomerGroupID || "4",
          GSTNO: customerData.GSTNO || "123456789",
          StateID: customerData.StateID || "47",
        },
      },
    ]


    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error adding customer:", error)
    return rejectWithValue(error.message)
  }
})

// Customer slice
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    // Search customer state
    searchLoading: false,
    searchError: null,
    searchResults: [],
    foundCustomer: null,

    // Add customer state
    addLoading: false,
    addError: null,
    addSuccess: false,

    // Current customer data
    currentCustomer: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = []
      state.foundCustomer = null
      state.searchError = null
    },
    clearAddStatus: (state) => {
      state.addError = null
      state.addSuccess = false
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null
    },
    resetCustomerState: (state) => {
      state.searchLoading = false
      state.searchError = null
      state.searchResults = []
      state.foundCustomer = null
      state.addLoading = false
      state.addError = null
      state.addSuccess = false
      state.currentCustomer = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get/Search Customer cases
      .addCase(getCustomer.pending, (state) => {
        state.searchLoading = true
        state.searchError = null
        state.foundCustomer = null
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload?.Result || []

        // If we have results, check if any match the searched mobile number
        if (state.searchResults.length > 0) {
          // The API returns all customers, so we need to find the exact match
          // This will be handled in the component
          state.foundCustomer = null // Will be set in component
        }
      })
      .addCase(getCustomer.rejected, (state, action) => {
        state.searchLoading = false
        state.searchError = action.payload || "Failed to search customer"
        state.searchResults = []
        state.foundCustomer = null
      })

      // Add Customer cases
      .addCase(addCustomer.pending, (state) => {
        state.addLoading = true
        state.addError = null
        state.addSuccess = false
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addLoading = false
        state.addSuccess = true

        // If the response has a Result with customer data, set it as current customer
        if (action.payload?.Status && action.payload?.Result) {
          state.currentCustomer = action.payload.Result[0] || null
        }
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addLoading = false
        state.addError = action.payload || "Failed to add customer"
        state.addSuccess = false
      })
  },
})

export const { clearSearchResults, clearAddStatus, setCurrentCustomer, clearCurrentCustomer, resetCustomerState } =
  customerSlice.actions

export default customerSlice.reducer
