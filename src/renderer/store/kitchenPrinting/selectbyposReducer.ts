// src/features/kitchenPrinters/kitchenPrintersSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface PrinterDetail {
  ID?: string
  CompanyID?: string
  BrandID?: string
  BranchID?: string
  POS_No?: string
  MenuID?: string
  CategoryID?: string
  PrintType?: string
  NetworkIP?: string
  Port?: string
  IsActive?: string
  CreatedBy?: string
  CreatedDate?: string
  ModifiedBy?: string
  ModifiedDate?: string
  // Legacy fields
  PrinterID?: string
  PrinterName?: string
  IPAddress?: string
}

interface KitchenPrintersState {
  data: PrinterDetail[]
  loading: boolean
  error: string | null
  autoSetupAttempted: boolean
  autoSetupSuccess: boolean
  lastAutoSetupTime: number | null
  message: string | null
}

const initialState: KitchenPrintersState = {
  data: [],
  loading: false,
  error: null,
  autoSetupAttempted: false,
  autoSetupSuccess: false,
  lastAutoSetupTime: null,
  message: null,
}

// 🔹 API call to fetch printers
export const fetchPrintersByPOSAndCategory = createAsyncThunk<
  PrinterDetail[],
  {
    registrationNo: string
    companyID: number
    brandID: number
    branchID: number
    posNo: string
    categoryIDs: number[]
  },
  { rejectValue: string }
>("kitchenPrinters/fetchByPOSAndCategory", async (params, { rejectWithValue }) => {
  console.log("params",params);
  
  try {
    const requestBody = [
      {
        Param: "SelectByPOSAndCategory",
        PrinterDetail: {
          RegistrationNo: params.registrationNo,
          CompanyID: params.companyID,
          BrandID: params.brandID,
          BranchID: params.branchID,
          POS_No: params.posNo,
          // ⚠️ API might not accept array → stringify if needed
          CategoryIDs:params.categoryIDs,
        },
      },
    ]

    console.log("[v1] API Request Body:", JSON.stringify(requestBody, null, 2))

    const response = await axios.post("http://74.208.235.72:1001/SelfCheckOutAPI/PosKitchenPrintersAPI", requestBody, {
      headers: { "Content-Type": "application/json" },
    })

    console.log("[v1] API Response:", response.data)

    if (response.data?.Status && Array.isArray(response.data.Result)) {
      return response.data.Result
    } else {
      return rejectWithValue("Invalid API response structure")
    }
  } catch (err: any) {
    console.error("[v1] API Error:", err.response?.status, err.response?.data || err.message)
    return rejectWithValue(
      typeof err.response?.data === "string" ? err.response.data : err.message || "Unknown API error",
    )
  }
})

// 🔹 Auto-setup printers
export const autoSetupPrinters = createAsyncThunk<
  { printers: PrinterDetail[]; timestamp: number; message: string },
  {
    registrationNo: string
    companyID: number
    brandID: number
    branchID: number
    posNo: string
    categoryIDs: number[]
  },
  { rejectValue: string }
>("kitchenPrinters/autoSetup", async (params, { rejectWithValue, dispatch }) => {
  try {
    console.log("[v1] Starting automatic printer setup...")

    dispatch(clearPrinters())

    const result = await dispatch(fetchPrintersByPOSAndCategory(params))

    if (fetchPrintersByPOSAndCategory.fulfilled.match(result)) {
      const printers = result.payload ?? []

      if (!printers.length) {
        return rejectWithValue("No printers found from API")
      }

      // Filter unique network printers
      const networkPrinters = printers.reduce((acc: PrinterDetail[], printer) => {
        if (printer.NetworkIP && printer.Port) {
          const exists = acc.find((p) => p.NetworkIP === printer.NetworkIP)
          if (!exists) acc.push(printer)
        }
        return acc
      }, [])

      console.log(`[v1] Auto-setup found ${networkPrinters.length} network printers`)

      return {
        printers: networkPrinters,
        timestamp: Date.now(),
        message: `${networkPrinters.length} network printers configured automatically`,
      }
    } else {
      return rejectWithValue("Failed to fetch printers from API")
    }
  } catch (error: any) {
    console.error("[v1] Auto-setup error:", error)
    return rejectWithValue(error.message || "Auto-setup failed")
  }
})

const kitchenPrintersSlice = createSlice({
  name: "kitchenPrinters",
  initialState,
  reducers: {
    clearPrinters: (state) => {
      state.data = []
      state.error = null
      state.loading = false
      state.message = null
      console.log("[v1] Cleared all printer data from Redux state")
    },
    resetAutoSetupState: (state) => {
      state.autoSetupAttempted = false
      state.autoSetupSuccess = false
      state.lastAutoSetupTime = null
      state.error = null
      state.message = null
    },
    setManualPrinters: (state, action: PayloadAction<PrinterDetail[]>) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Auto-setup
      .addCase(autoSetupPrinters.pending, (state) => {
        state.loading = true
        state.error = null
        state.autoSetupAttempted = true
        console.log("[v1] Auto-setup started")
      })
      .addCase(autoSetupPrinters.fulfilled, (state, action) => {
        state.loading = false
        state.autoSetupSuccess = true
        state.lastAutoSetupTime = action.payload.timestamp
        state.data = action.payload.printers
        state.message = action.payload.message
        console.log("[v1] Auto-setup completed successfully:", action.payload.message)
      })
      .addCase(autoSetupPrinters.rejected, (state, action) => {
        state.loading = false
        state.autoSetupSuccess = false
        state.error = action.payload || "Auto-setup failed"
        state.message = null
        console.log("[v1] Auto-setup failed:", action.payload)
      })
      // Fetch
      .addCase(fetchPrintersByPOSAndCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPrintersByPOSAndCategory.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPrintersByPOSAndCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch printers"
      })
  },
})

export const { clearPrinters, resetAutoSetupState, setManualPrinters } = kitchenPrintersSlice.actions
export default kitchenPrintersSlice.reducer
