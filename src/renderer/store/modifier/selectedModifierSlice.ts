import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ModifierSelections {
  crust: string | null
  addons: { [categoryId: string]: number[] }
  modifiers: { [key: string]: any }
}

interface SelectedModifiersState {
  [productId: string]: ModifierSelections
}

interface SetSelectedModifiersPayload {
  productId: string
  modifiers: ModifierSelections
}

const initialState: SelectedModifiersState = {}

const selectedModifierSlice = createSlice({
  name: "selectedModifiers",
  initialState,
  reducers: {
    setSelectedModifiers: (state, action: PayloadAction<SetSelectedModifiersPayload>) => {
      const { productId, modifiers } = action.payload
      // console.log("=== SAVING MODIFIERS TO REDUX ===")
      // console.log("Product ID:", productId)
      // console.log("Modifiers:", modifiers)

      state[productId] = {
        crust: modifiers.crust,
        addons: { ...modifiers.addons },
        modifiers: { ...modifiers.modifiers },
      }

      // console.log("Updated Redux state:", state)
    },

    clearSelectedModifiers: (state, action: PayloadAction<string>) => {
      const productId = action.payload
      // console.log("=== CLEARING MODIFIERS FROM REDUX ===")
      // console.log("Product ID:", productId)

      delete state[productId]

      // console.log("Updated Redux state after clearing:", state)
    },

    clearAllSelectedModifiers: (state) => {
      // console.log("=== CLEARING ALL MODIFIERS FROM REDUX ===")
      return {}
    },

    updateModifierSelection: (
      state,
      action: PayloadAction<{
        productId: string
        type: "crust" | "addon"
        categoryId?: string
        value: any
      }>,
    ) => {
      const { productId, type, categoryId, value } = action.payload

      if (!state[productId]) {
        state[productId] = {
          crust: null,
          addons: {},
          modifiers: {},
        }
      }

      if (type === "crust") {
        state[productId].crust = value
      } else if (type === "addon" && categoryId) {
        state[productId].addons[categoryId] = value
      }

      // console.log("=== UPDATING MODIFIER SELECTION ===")
      // console.log("Product ID:", productId)
      // console.log("Type:", type)
      // console.log("Value:", value)
      // console.log("Updated state:", state[productId])
    },
  },
})

export const { setSelectedModifiers, clearSelectedModifiers, clearAllSelectedModifiers, updateModifierSelection } =
  selectedModifierSlice.actions

export default selectedModifierSlice.reducer
