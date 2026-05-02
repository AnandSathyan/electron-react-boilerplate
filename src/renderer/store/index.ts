import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import slices
// import apiReducer from '../slices/apiSlice';
import licenceReducer from './license/licenseSlice';
import categoryReducer from './category/categorySlice';
import productReducer from './product/productSlice';
import cartReducer from './cart/cartSlice';
import getUserReducer from './customer/getCustomerSlice';
import deviceReducer from './device/deviceSlice';
import customerReducer from './customer/getCustomerSlice';
import checkoutReducer from './checkout/checkoutSlice';
import modifierCategoryReducer from './modifier/category/modifiercategorySlice';
import modifierDescriptionReducer from './modifier/modifierDetailsSlice';
import customerInfoReducer from './customer/storedCustomer'
import authReducer from './auth/authSlice';
import brandReducer from './brand/brandSlice'
import posMasterReducer from './POS/PosMasterSlice'
import posLoginReducer from './POS/POSLogin/posLoginSlice'
import companyReducer from './company/companySlice'
import branchReducer from './branch/branchSlice'
import countryReducer from './country/getCountrySlice'
import itemModifiersReducer from './modifier/itemModifierSlice'
import modifierProductReducer from './modifier/product/modifierproductSlice'
import selectedModifierReducer from './modifier/selectedModifierSlice'
import filteredCompanyReducer from './filteredCompany/filteredCompanySlice';
import kitchenPrintersReducer from './kitchenPrinting/selectbyposReducer'
const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'isAuthenticated'], 
};
const posLoginPersistConfig = {
  key: 'posLogin',
  storage: AsyncStorage,
  whitelist: ['user', 'success', 'IsLogin'],
};
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedPosLoginReducer = persistReducer(posLoginPersistConfig, posLoginReducer);

const store = configureStore({
  reducer: {
    // api: apiReducer,
    licence: licenceReducer,
    category: categoryReducer,
    product: productReducer,
    modifierProduct:modifierProductReducer,
    cart: cartReducer,
    getUserDetails: getUserReducer,
    device: deviceReducer,
    auth: persistedAuthReducer,
    brand: brandReducer,
    filteredCountries:filteredCompanyReducer,
    // customer: customerReducer,
    checkout: checkoutReducer,
    modifierCategory: modifierCategoryReducer,
    modifierDescription: modifierDescriptionReducer,
    customer: customerReducer,
    customerInfo: customerInfoReducer,
    posMaster: posMasterReducer,
    posLogin:persistedPosLoginReducer,
    company: companyReducer,
    branch:branchReducer,
    country: countryReducer,
    itemModifiers: itemModifiersReducer,
    selectedModifiers: selectedModifierReducer,
    kitchenPrinters: kitchenPrintersReducer,
    // posMaster: posMasterReducer,
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
})
  // devTools: process.env.NODE_ENV !== 'production',
export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
