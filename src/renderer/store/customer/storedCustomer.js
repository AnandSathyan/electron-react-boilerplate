import { createSlice } from '@reduxjs/toolkit'

// Initial state for customer information
const initialState = {
  // Current customer input and form data
  mobileInput: '',
  formData: null,
  
  // Customer search/lookup state
  isSearching: false,
  searchError: null,
  
  // Current customer information
  currentCustomer: {
    RegistrationNo: '',
    CustomerName: '',
    mobileno: '',
    Address: '',
    Emailid: '',
    CustomerCode: '',
    civilid: '',
    DOB: '',
    CreditLimit: '',
    ContactPerson: '',
    website: '',
    area: '',
    block: '',
    street: '',
    CustomerGroupID: '',
    GSTNO: '',
    StateID: '',
    ActiveStatus: '1',
    IsSync: '0',
  },
  
  // UI state
  showRegistrationForm: false,
  isExistingCustomer: false,
  
  // Recently searched customers cache
  recentCustomers: [],
  
  // Form validation state
  formErrors: {},
  isFormValid: false,
}

const customerInfoSlice = createSlice({
  name: 'customerInfo',
  initialState,
  reducers: {
    // Update mobile input value
    setMobileInput: (state, action) => {
      state.mobileInput = action.payload
      state.searchError = null // Clear any previous search errors
    },
    
    // Clear mobile input
    clearMobileInput: (state) => {
      state.mobileInput = ''
    },
    
    // Set form data (for both existing and new customers)
    setFormData: (state, action) => {
      state.formData = action.payload
      state.currentCustomer = { ...state.currentCustomer, ...action.payload }
    },
    
    // Update current customer information
    updateCurrentCustomer: (state, action) => {
      state.currentCustomer = { ...state.currentCustomer, ...action.payload }
    },
    
    // Set customer as existing or new
    setCustomerType: (state, action) => {
      state.isExistingCustomer = action.payload
    },
    
    // Show/hide registration form
    setShowRegistrationForm: (state, action) => {
      state.showRegistrationForm = action.payload
    },
    
    // Set search loading state
    setSearching: (state, action) => {
      state.isSearching = action.payload
      if (action.payload) {
        state.searchError = null
      }
    },
    
    // Set search error
    setSearchError: (state, action) => {
      state.searchError = action.payload
      state.isSearching = false
    },
    
    // Add to recent customers cache
    addToRecentCustomers: (state, action) => {
      const customer = action.payload
      // Remove if already exists to avoid duplicates
      state.recentCustomers = state.recentCustomers.filter(
        c => c.mobileno !== customer.mobileno
      )
      // Add to beginning of array
      state.recentCustomers.unshift(customer)
      // Keep only last 10 recent customers
      if (state.recentCustomers.length > 10) {
        state.recentCustomers = state.recentCustomers.slice(0, 10)
      }
    },
    
    // Clear recent customers
    clearRecentCustomers: (state) => {
      state.recentCustomers = []
    },
    
    // Set form validation errors
    setFormErrors: (state, action) => {
      state.formErrors = action.payload
      state.isFormValid = Object.keys(action.payload).length === 0
    },
    
    // Clear form errors
    clearFormErrors: (state) => {
      state.formErrors = {}
      state.isFormValid = true
    },
    
    // Reset customer state (useful when closing modal or starting fresh)
    resetCustomerState: (state) => {
      state.mobileInput = ''
      state.formData = null
      state.currentCustomer = initialState.currentCustomer
      state.showRegistrationForm = false
      state.isExistingCustomer = false
      state.searchError = null
      state.isSearching = false
      state.formErrors = {}
      state.isFormValid = false
    },
    
    // Set complete customer profile (after successful API call)
    setCustomerProfile: (state, action) => {
      const customerData = action.payload
      state.currentCustomer = { ...state.currentCustomer, ...customerData }
      state.formData = customerData
      state.isExistingCustomer = true
      
      // Add to recent customers if it has required fields
      if (customerData.mobileno && customerData.CustomerName) {
        const customer = {
          mobileno: customerData.mobileno,
          CustomerName: customerData.CustomerName,
          Address: customerData.Address || '',
          Emailid: customerData.Emailid || '',
          lastAccessed: new Date().toISOString()
        }
        // Remove if already exists
        state.recentCustomers = state.recentCustomers.filter(
          c => c.mobileno !== customer.mobileno
        )
        // Add to beginning
        state.recentCustomers.unshift(customer)
        // Keep only last 10
        if (state.recentCustomers.length > 10) {
          state.recentCustomers = state.recentCustomers.slice(0, 10)
        }
      }
    },
    
    // Update specific customer field
    updateCustomerField: (state, action) => {
      const { field, value } = action.payload
      state.currentCustomer[field] = value
      if (state.formData) {
        state.formData[field] = value
      }
    },
    
    // Set customer lookup results
    setCustomerLookupResults: (state, action) => {
      state.lookupResults = action.payload
    },
    
    // Clear lookup results
    clearLookupResults: (state) => {
      state.lookupResults = []
    }
  },
})

// Export actions
export const {
  setMobileInput,
  clearMobileInput,
  setFormData,
  updateCurrentCustomer,
  setCustomerType,
  setShowRegistrationForm,
  setSearching,
  setSearchError,
  addToRecentCustomers,
  clearRecentCustomers,
  setFormErrors,
  clearFormErrors,
  resetCustomerState,
  setCustomerProfile,
  updateCustomerField,
  setCustomerLookupResults,
  clearLookupResults,
} = customerInfoSlice.actions

// Selectors for easy access to state (with fallbacks to prevent undefined errors)
export const selectMobileInput = (state) => state.customerInfo?.mobileInput || ''
export const selectFormData = (state) => state.customerInfo?.formData || null
export const selectCurrentCustomer = (state) => state.customerInfo?.currentCustomer || initialState.currentCustomer
export const selectIsSearching = (state) => state.customerInfo?.isSearching || false
export const selectSearchError = (state) => state.customerInfo?.searchError || null
export const selectShowRegistrationForm = (state) => state.customerInfo?.showRegistrationForm || false
export const selectIsExistingCustomer = (state) => state.customerInfo?.isExistingCustomer || false
export const selectRecentCustomers = (state) => state.customerInfo?.recentCustomers || []
export const selectFormErrors = (state) => state.customerInfo?.formErrors || {}
export const selectIsFormValid = (state) => state.customerInfo?.isFormValid || false
export const selectLookupResults = (state) => state.customerInfo?.lookupResults || []

// Complex selectors (with safety checks)
export const selectIsCustomerDataComplete = (state) => {
  const customer = state.customerInfo?.currentCustomer || {}
  return !!(customer.CustomerName && customer.mobileno && customer.Address)
}

export const selectCustomerForSubmission = (state) => {
  const customer = state.customerInfo?.currentCustomer || {}
const users = useAppSelector((state) => state.auth?.user);
const { user, error, success } = useAppSelector((state) => state.posLogin);
const { brands} = useAppSelector((state) => state.brand)
  return {
    RegistrationNo: customer.RegistrationNo ||users?.formData?.registrationNumber?users?.formData?.registrationNumber:"",
    companyid: user?.CompanyID,
    brandid: user?.BrandID,
    countryid: "1",
    CustomerCode: customer.CustomerCode || "",
    LocalName: customer.CustomerName || "",
    CustomerName: customer.CustomerName || "",
    DOB: customer.DOB || "2001-12-25",
    Telephone: customer.mobileno || "",
    CreditLimit: customer.CreditLimit || "1000",
    Emailid: customer.Emailid || "",
    Address: customer.Address || "",
    ContactPerson: customer.ContactPerson || customer.CustomerName || "",
    civilid: customer.civilid || "CIV1111",
    mobileno: customer.mobileno || "",
    website: customer.website || "anand.com",
    area: customer.area || "Area",
    block: customer.block || "Block",
    street: customer.street || "Street",
    EditedByID: "",
    EditedDate: "",
    CreatedByID: "7",
    CreatedDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    ActiveStatus: customer.ActiveStatus || "1",
    mobileno2: customer.mobileno || "",
    IsSync: customer.IsSync || "0",
    CustomerGroupID: customer.CustomerGroupID || "4",
    GSTNO: customer.GSTNO || "123456789",
    StateID: customer.StateID || "47",
  }
}

export default customerInfoSlice.reducer