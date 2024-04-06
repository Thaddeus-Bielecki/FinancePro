// Don't need this file anymore
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('income') ? JSON.parse(localStorage.getItem('userInfo')) : 
  [],

}

const incomeTrackerSlice = createSlice({
  name: 'incomeTracker',
  initialState,
  reducers: {
    addIncome: (state, action) => {
      // Add the new income to the state
      state.incomes.push(action.payload);
      // Update the local storage
      localStorage.setItem('incomes', JSON.stringify(state.incomes));
    },
    removeIncome: (state, action) => {
      // Remove the income from the state
      state.incomes = state.incomes.filter(income => income.id !== action.payload);
      // Update the local storage
      localStorage.setItem('incomes', JSON.stringify(state.incomes));
    },
  },
});



export const { addIncome, removeIncome } = incomeTrackerSlice.actions;

export default incomeTrackerSlice.reducer;