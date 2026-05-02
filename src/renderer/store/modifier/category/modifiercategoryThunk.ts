// src/features/modifierCategory/modifierCategoryThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchmodifierCategoriesFromAPI } from './modifiercategoryApi';

// Define the data type you'll be receiving (adjust it to match your API response)
interface Category 
    {
        "Param": "Select",
        "MenuCategories": {
           "RegistrationNo":"",
            "CompanyID": "",
            "BrandID": "",
            "BranchID": "1",
            "ID": "0",
            "MenuName": "",
            "POS_ITEM_CAT_ID": "",
            "POS_ITEM_CAT_PARENT": "",
            "POS_ITEM_CAT_NAME": "",
            "E_BUTTON_NAME": "",
            "B_BUTTON_NAME": "",
            "BTN_BACK_COLOR": "",
            "BTN_FORE_COLOR": "",
            "KITCHEN_PRINTER": "",
            "KITCHEN_DISPLAY": "",
            "ItemLogo": "",
            "CreatedByID": "",
            "CreatedDate": "",
            "EditedByID": "",
            "EditedDate": "",
            "ActiveStatus":""
        }
    }


export const fetchmodifierCategories = createAsyncThunk<Category[], object>(
  'modifierCategory/fetchmodifierCategories',  // Action type
  async (modifierCategoryData:any, thunkAPI) => {
    try {
      const modifiercategories = await fetchmodifierCategoriesFromAPI(modifierCategoryData);
      return modifiercategories;  // Return the fetched categories
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error
    }
  }
);
