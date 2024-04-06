import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
//don't need these anymore
import incomeTrackerSliceReducer from './slices/incomeTrackerSlice';
// import expenseSliceReducer from './slices/expenseTrackerSlice';
// import loanSliceReducer from './slices/loanTrackerSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add the generated reducer as a new top-level slice
    auth: authSliceReducer,

    // Don't think I need these anymore --- They don't hurt anything tho
    income: incomeTrackerSliceReducer,
    // expense: expenseSliceReducer,
    // loan: loanExpenseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;